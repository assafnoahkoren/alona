import { makeAutoObservable, runInAction } from 'mobx';
import apiService from '../services/apiService';
export class StaticDataStore {
    hotels: any[] = [];
    settlements: any[] = [];
    isLoading = false;
    error: string | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    public async fetchData() {
        try {
            this.isLoading = true;
            const [hotelsResponse, settlementsResponse] = await Promise.all([
                apiService.hotels.getAll(),
                apiService.settlements.getAll()
            ]);

            runInAction(() => {
                this.hotels = hotelsResponse;
                this.settlements = settlementsResponse;
                this.isLoading = false;
            });
        } catch (error) {
            runInAction(() => {
                this.error = 'Failed to fetch data';
                this.isLoading = false;
            });
        }
    }

    get settlemenentToEvacuate() {
        return this.settlements.filter(settlement => settlement.Settlements_To_Evacuate.length > 0);
    }

    get hotelsWithRooms() {
        return this.hotels.filter(hotel => hotel.rooms.length > 0);
    }
}

export const staticDataStore = new StaticDataStore();
