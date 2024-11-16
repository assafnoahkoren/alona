import { Algorithm_Run } from "@prisma/client";
import { makeAutoObservable, toJS } from "mobx";
import { Allocations } from "../../../server/routers/authenticatedRouter";
import { showToast } from "../infra/toast";
import { staticDataStore } from "./static-data-store";
import algorithmRunService from "../services/algorithmRunService";
import { EvacuationDataResponse } from "../../../server/routers/models/evacuationDataRoutes";
import { EnrichedHotel } from "../../../server/routers/models/hotelRoutes";

type AlgorithmRunId = string;
type Results = {
  allocations: Allocations[];
  algorithmRun: Algorithm_Run;
};
type SettlementData = {
  markedForEvac: boolean;
  evacData?: EvacuationDataResponse;
};

type HotelData = {
  hotel?: EnrichedHotel | null;
  markedForAcceptance: boolean;
};

class EvacPlanStore {
  algorithmRuns: Record<AlgorithmRunId, Results> = {};
  mode: "static" | "dynamic" = "static";
  settlementDataMap: Record<number, SettlementData> = {};
  hotelsDataMap: Record<string, HotelData> = {};

  constructor() {
    makeAutoObservable(this);
  }

  async createEvacPlan() {
    const { algorithmRun, result } = await algorithmRunService.create({
      parameters: JSON.stringify({
        hotels: this.getHotelsForAcceptance(),
        settlement: this.getAllSettlementData().filter((data) => data.markedForEvac).map(row => ({
          Settlement_id: staticDataStore.settlements.find((settlement) => settlement.Settlement_sign === row.evacData?.yishuvNumber.toString())?.Settlement_id,
          Name: row.evacData?.yishuvName,
          Settlement_sign: row.evacData?.yishuvNumber,
          rooms_needed: row.evacData?.would_need_room_estimated,
        })),
      }),
    });
    this.algorithmRuns[algorithmRun.ID] = {
      allocations: [],
      algorithmRun,
    };
    showToast(`הרצה מס' ${algorithmRun.ID} נוצרה בהצלחה`);
    const totalRoomsAllocated = Object.values(result.allocations).reduce(
      (acc, allocation) => {
        return acc + Object.values(allocation).reduce((sum, rooms) =>
          sum + rooms[0].free_room_count, 0);
      },
      0,
    );
    const totalRoomsUnallocated = Object.values(result.unallocated).reduce(
      (acc, rooms) => {
        return acc + rooms[0].free_room_count;
      },
      0,
    );
    showToast(`שורינו ${totalRoomsAllocated} חדרים`);
    showToast(`נותרו ${totalRoomsUnallocated} חדרים`);

    return algorithmRun;
  }

  getSettlementData(settlementId: number | string): SettlementData {
    const id = typeof settlementId === "string"
      ? parseInt(settlementId)
      : settlementId;
    const data = this.settlementDataMap[id];
    if (data) {
      return {
        ...data,
        evacData: staticDataStore.evacuationData.find((settlement) =>
          settlement.yishuvNumber === id
        ),
      };
    }

    return {
      markedForEvac: staticDataStore.settlementsIdsToEvacuate.includes(id),
      evacData: staticDataStore.evacuationData.find((settlement) =>
        settlement.yishuvNumber === id
      ),
    };
  }

  getAllSettlementData(): SettlementData[] {
    return staticDataStore.evacuationData.map((settlement) =>
      this.getSettlementData(settlement.yishuvNumber)
    );
  }

  set_markedForEvac(settlementId: number, markedForEvac: boolean) {
    let data = this.settlementDataMap[settlementId] ?? {};
    data.markedForEvac = markedForEvac;
    this.settlementDataMap[settlementId] = data;
  }

  set_markedForAcceptance(hotelId: string, markedForAcceptance: boolean) {
    let data = this.hotelsDataMap[hotelId] ?? {};
    data.markedForAcceptance = markedForAcceptance;
    this.hotelsDataMap[hotelId] = data;
  }

  getHotelData(hotelId: string): HotelData {
    const data = this.hotelsDataMap[hotelId] ?? {};
    return {
      ...data,
      hotel: staticDataStore.hotelsWithRooms.find((hotel) =>
        hotel.Hotel_ID === hotelId
      ),
    };
  }

  getRequiredRooms(evacData?: EvacuationDataResponse): number {
    if (!evacData) {
      return 0;
    }
    return evacData.would_need_room_estimated;
  }

  getTotalRequiredRooms(): number {
    const settlements = this.getAllSettlementData().filter((data) =>
      data.markedForEvac
    );
    return settlements.reduce(
      (acc, data) => acc + this.getRequiredRooms(data.evacData),
      0,
    );
  }

  getTotalAvailableRooms(): number {
    const hotelsIds = Object.keys(this.hotelsDataMap).filter((hotelId) =>
      this.hotelsDataMap[hotelId].markedForAcceptance
    );

    return hotelsIds.reduce((acc, hotelId) => {
      const hotel = this.getHotelData(hotelId);
      if (!hotel.hotel?.rooms) {
        return acc;
      }
      return acc +
        hotel.hotel.rooms.reduce((sum, room) => sum + room.free_room_count, 0);
    }, 0);
  }

  getHotelsForAcceptance(): EnrichedHotel[] {
    return Object.keys(this.hotelsDataMap)
      .filter((hotelId) => this.hotelsDataMap[hotelId].markedForAcceptance)
      .map((hotelId) => this.getHotelData(hotelId).hotel)
      .filter((hotel) => hotel) as EnrichedHotel[];
  }
}

export const evacPlanStore = new EvacPlanStore();
