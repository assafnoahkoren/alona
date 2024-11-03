import { makeAutoObservable, runInAction } from 'mobx';
import { hotelService } from '../services/hotelService';
import { settlementService } from '../services/settlementService';

export class StaticDataStore {
    hotels: any[] = [];
    settlements: any[] = [];
    isLoading = false;
    error: string | null = null;

    constructor() {
        makeAutoObservable(this);
        this.fetchData();
    }

    private async fetchData() {
        try {
            this.isLoading = true;
            const [hotelsResponse, settlementsResponse] = await Promise.all([
                hotelService.getAll(),
                settlementService.getAll()
            ]);

            runInAction(() => {
                this.hotels = hotelsResponse.data;
                this.settlements = settlementsResponse.data;
                this.isLoading = false;
            });
        } catch (error) {
            runInAction(() => {
                this.error = 'Failed to fetch data';
                this.isLoading = false;
            });
        }
    }
}

export const staticDataStore = new StaticDataStore();
