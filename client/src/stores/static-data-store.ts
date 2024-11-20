import { Settlements_To_Evacuate } from '@prisma/client';
import {makeAutoObservable, runInAction} from 'mobx';
import apiService from '../services/apiService';
import {EnrichedHotel} from '../../../server/routers/models/hotelRoutes';
import {EnrichedSettlement} from '../../../server/routers/models/settlementRoutes';
import {EvacuationDataResponse} from '../../../server/routers/models/evacuationDataRoutes.ts';

type MerhavRashutEshkol_Key = string;

export class StaticDataStore {
    hotels: EnrichedHotel[] = [];
    settlements: EnrichedSettlement[] = [];
    evacuationData: EvacuationDataResponse[] = [];
    settlementsIdsToEvacuate: number[] = [];
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
                this.settlementsIdsToEvacuate = settlementsResponse.map(row => {
                    if (row.Settlement_sign) {
                        const settlementId = parseInt(row.Settlement_sign);
                        if (!isNaN(settlementId)) {
                            return settlementId;
                        }
                    }
                    return null;
                }).filter(id => id !== null) as number[];
                this.hotels = hotelsResponse;
                this.settlements = settlementsResponse;
                const SettlementsSigns = settlementsResponse.map(row => row.Settlement_sign);
                this.evacuationData = evacuationDataResponse.filter(row => SettlementsSigns.includes(row.yishuvNumber.toString()));
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
        const evacSettlementsIds = this.settlements.map(settlement => settlement.Settlement_sign);
        return this.evacuationData.filter(row => evacSettlementsIds.includes(row.yishuvNumber.toString()));
    }

    get allSettlements(): EnrichedSettlement[] {
        return this.settlements;

    }

    get settlementsNotToEvacuate() {
        return this.settlements.filter(settlement => !settlement.Settlements_To_Evacuate || settlement.Settlements_To_Evacuate.length === 0);
    }

    get settlementsByEshkol() {
        const map: Record<MerhavRashutEshkol_Key, EvacuationDataResponse[]> = {}
        this.evacuationData.forEach(evacData => {
            const key = `${evacData.Rishut}_${evacData.Merhav}_${evacData.Eshkol}`;
            if (!map[key]) {
                map[key] = [];
            }
            map[key].push(evacData);
        });
        return map;
    }
    

    get hotelsWithRooms() {
        return this.hotels.filter(hotel => hotel.rooms.reduce((acc, room) => acc + room.free_room_count, 0) > 0);
    }

    get hotelsWithRoomsMapByCity() {
        const map: Record<string, EnrichedHotel[]> = {};
        this.hotelsWithRooms.forEach(hotel => {
            if (!hotel.City) {
                return;
            }
            map[hotel.City] = map[hotel.City] || [];
            map[hotel.City].push(hotel);
        });
        return map;
    }

    getMerhavim() {
        const merhavim = this.evacuationData.map(row => row.Merhav).filter(merhav => merhav !== null);
        return Array.from(new Set(merhavim));
    }

    
}

export const staticDataStore = new StaticDataStore();
