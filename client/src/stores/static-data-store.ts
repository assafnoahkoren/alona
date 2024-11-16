import {makeAutoObservable, runInAction} from 'mobx';
import apiService from '../services/apiService';
import {EnrichedHotel} from '../../../server/routers/models/hotelRoutes';
import {EnrichedSettlement} from '../../../server/routers/models/settlementRoutes';
import {EvacuationData} from "../services/evacuationDataService.ts";

export class StaticDataStore {
    hotels: EnrichedHotel[] = [];
    settlements: EnrichedSettlement[] = [];
    evacuationData: EvacuationData[] = [];
    isLoading = false;
    initialized = false;
    error: string | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    public async fetchData() {
        try {
            this.isLoading = true;
            this.initialized = true;
            const [hotelsResponse, settlementsResponse, evacuationDataResponse] = await Promise.all([
                apiService.hotels.getAll(),
                apiService.settlements.getAll(),
                apiService.evacuationData.getAll()
            ]);

            runInAction(() => {
                this.hotels = hotelsResponse;
                this.settlements = settlementsResponse;
                this.evacuationData = evacuationDataResponse;
                this.isLoading = false;
            });
        } catch (error) {
            runInAction(() => {
                this.error = 'Failed to fetch data';
                this.isLoading = false;
            });
        }
    }

    get settlementsToEvacuate() {
        return this.settlements.filter(settlement => settlement.Settlements_To_Evacuate.length > 0);
    }

    get allSettlements(): EnrichedSettlement[] {
        return this.settlements;

    }

    get settlementsNotToEvacuate() {
        return this.settlements.filter(settlement => !settlement.Settlements_To_Evacuate || settlement.Settlements_To_Evacuate.length === 0);
    }

    get hotelsWithRooms() {
        return this.hotels.filter(hotel => hotel.rooms.reduce((acc, room) => acc + room.free_room_count, 0) > 0);
    }
}

export const staticDataStore = new StaticDataStore();
