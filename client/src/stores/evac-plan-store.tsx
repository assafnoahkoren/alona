import { Algorithm_Run } from "@prisma/client";
import { makeAutoObservable, runInAction, toJS } from "mobx";
import { Allocations } from "../../../server/routers/authenticatedRouter";
import { showToast } from "../infra/toast";
import { staticDataStore } from "./static-data-store";
import algorithmRunService from "../services/algorithmRunService";
import { EvacuationDataResponse } from "../../../server/routers/models/evacuationDataRoutes";
import { EnrichedHotel } from "../../../server/routers/models/hotelRoutes";
import { modals } from '@mantine/modals';
import { Stack, Text } from "@mantine/core";

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
  settlementDataMap: Record<number, SettlementData> = {};
  hotelsDataMap: Record<string, HotelData> = {};
  mode: "static" | "dynamic" = "static";
  requiredRoomsPopulationPercentage: number = 80;
  fitInRoom: number = 4;
  constructor() {
    makeAutoObservable(this);
  }
  getRoomsNeededForEvacuation(evacData?: EvacuationDataResponse): number {
    if (this.mode === "static") {
      return evacData?.would_need_room_estimated ?? 0;
    }
    const population = evacData?.population ?? 0;
    if (population === 0) {
      return 0;
    }

    return Math.ceil(
      population * (this.requiredRoomsPopulationPercentage / 100) /
      this.fitInRoom,
    );
  }
  async createEvacPlan() {
    const { algorithmRun, result } = await algorithmRunService.create({
      parameters: JSON.stringify({
        hotels: this.getHotelsForAcceptance(),
        settlement: this.getAllSettlementData().filter((data) =>
          data.markedForEvac
        ).map((row) => ({
          Settlement_id: staticDataStore.settlements.find((settlement) =>
            settlement.Settlement_sign === row.evacData?.yishuvNumber.toString()
          )?.Settlement_id,
          Name: row.evacData?.yishuvName,
          Settlement_sign: row.evacData?.yishuvNumber,
          rooms_needed: this.getRoomsNeededForEvacuation(row.evacData),
        })),
        parameters: this.mode === 'dynamic' ? {
          fitInRoom: this.fitInRoom,
          requiredRoomsPopulationPercentage: this.requiredRoomsPopulationPercentage,
          mode: this.mode,
          creationDate: new Date().toISOString(),
          createTime: new Date().getTime(),
        } : {
          mode: this.mode,
          creationDate: new Date().toISOString(),
          createTime: new Date().getTime(),
          fitInRoom: null,
          requiredRoomsPopulationPercentage: null,
        },
      }),
    });
    this.algorithmRuns[algorithmRun.ID] = {
      allocations: [],
      algorithmRun,
    };
    const totalRoomsAllocated = Object.values(result.allocations).reduce(
      (acc, allocation) => {
        return acc +
          Object.values(allocation).reduce(
            (sum, rooms) => sum + rooms[0].free_room_count,
            0,
          );
      },
      0,
    );
    const totalRoomsUnallocated = Object.values(result.unallocated).reduce(
      (acc, rooms) => {
        return acc + rooms[0].free_room_count;
      },
      0,
    );

    modals.openConfirmModal({
      title: (
        <Text>
          הרצה מס' {algorithmRun.ID} נוצרה בהצלחה.
        </Text>
      ),
      children: (
        <Stack>
          <Text>
            נותרו {totalRoomsUnallocated} חדרים
          </Text>
          <Text>
            שורינו {totalRoomsAllocated} חדרים
          </Text>
        </Stack>
      ),
      labels: { confirm: 'עבור למערכת ה-BI', cancel: 'סגור' },
      onCancel: () => console.log('סגור'),
      onConfirm: () => {
        window.open('https://sqlbi2019.mot.gov.il/reports_pbi/powerbi/IDF/QA/SafeDistanceV3_May_2022', '_blank');
      },
    });

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

  setMultiple_markedForEvac(
    settlements: EvacuationDataResponse[],
    markedForEvac: boolean,
  ) {
    runInAction(() => {
      settlements.forEach((settlement) => {
        this.set_markedForEvac(settlement.yishuvNumber, markedForEvac);
      });
    });
  }

  set_markedForAcceptance(hotelId: string, markedForAcceptance: boolean) {
    let data = this.hotelsDataMap[hotelId] ?? {};
    data.markedForAcceptance = markedForAcceptance;
    this.hotelsDataMap[hotelId] = data;
  }

  toggle_markedForAcceptance(hotelId: string) {
    this.set_markedForAcceptance(
      hotelId,
      !this.getHotelData(hotelId).markedForAcceptance,
    );
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
      (acc, data) => acc + this.getRoomsNeededForEvacuation(data.evacData),
      0,
    );
  }

  getRoomsDifference(): number {
    return this.getTotalAvailableRooms() - this.getTotalRequiredRooms();
  }

  roomsDifferenceIsNegative(): boolean {
    return this.getRoomsDifference() < 0;
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

  isAnySettlementSelected() {
    return this.getAllSettlementData().some((row) => row.markedForEvac);
  }

  toggleAllSelection() {
    if (this.isAnySettlementSelected()) {
      this.getAllSettlementData().forEach((row) => {
        this.set_markedForEvac(row.evacData?.yishuvNumber ?? 0, false);
      });
    } else {
      this.getAllSettlementData().forEach((row) => {
        this.set_markedForEvac(row.evacData?.yishuvNumber ?? 0, true);
      });
    }
  }

  isMerhavSelected(merhav: string) {
    return this.getAllSettlementData().some((row) =>
      row.evacData?.Merhav === merhav && row.markedForEvac
    );
  }

  toggleMerhavSelection(merhav: string) {
    if (this.isMerhavSelected(merhav)) {
      this.getAllSettlementData().forEach((row) => {
        if (row.evacData?.Merhav === merhav) {
          this.set_markedForEvac(row.evacData.yishuvNumber, false);
        }
      });
    } else {
      this.getAllSettlementData().forEach((row) => {
        if (row.evacData?.Merhav === merhav) {
          this.set_markedForEvac(row.evacData.yishuvNumber, true);
        }
      });
    }
  }

  isAnyOfSettlementSelected(settlements: EvacuationDataResponse[]) {
    return settlements.some((settlement) =>
      this.getAllSettlementData().some((row) =>
        row.evacData?.yishuvNumber === settlement.yishuvNumber &&
        row.markedForEvac
      )
    );
  }

  toggleSettlementSelection(settlements: EvacuationDataResponse[]) {
    this.setMultiple_markedForEvac(
      settlements,
      !this.isAnyOfSettlementSelected(settlements),
    );
  }

  isAnyHotelSelected() {
    return Object.values(this.hotelsDataMap).some((hotel) =>
      hotel.markedForAcceptance
    );
  }

  toggleAllHotelSelection() {
    this.setMultiple_markedForAcceptance(
      this.getHotelsForAcceptance(),
      !this.isAnyHotelSelected(),
    );
  }


  isAnyHotelOfHotelsSelected(hotels: EnrichedHotel[]) {
    return hotels.some((hotel) =>
      this.hotelsDataMap[hotel.Hotel_ID]?.markedForAcceptance
    );
  }

  toggleHotels(hotels: EnrichedHotel[]) {
    this.setMultiple_markedForAcceptance(
      hotels,
      !this.isAnyHotelOfHotelsSelected(hotels),
    );
  }

  setMultiple_markedForAcceptance(
    hotels: EnrichedHotel[],
    markedForAcceptance: boolean,
  ) {
    hotels.forEach((hotel) =>
      this.set_markedForAcceptance(hotel.Hotel_ID, markedForAcceptance)
    );
  }
}

export const evacPlanStore = new EvacPlanStore();
