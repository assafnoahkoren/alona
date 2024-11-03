import { Algorithm_Run } from '@prisma/client';
import { makeAutoObservable } from 'mobx';
import { Allocations } from '../../../server/routers/authenticatedRouter';
import apiService from '../services/apiService';
import { showToast } from '../infra/toast';
import { staticDataStore } from './static-data-store';
import settlementService from '../services/settlementService';
import algorithmRunService from '../services/algorithmRunService';

type AlgorithmRunId = string;
type Results =  {
  allocations: Allocations[];
  algorithmRun: Algorithm_Run;
}
class EvacPlanStore {
    algorithmRuns: Record<AlgorithmRunId, Results> = {};
    constructor() {
        makeAutoObservable(this);
    }

    async createEvacPlan() {
        const { algorithmRun, result } = await algorithmRunService.create({
          parameters: JSON.stringify({
            hotels: staticDataStore.hotelsWithRooms,
            settlement: staticDataStore.settlementsToEvacuate
          })
        })
        this.algorithmRuns[algorithmRun.ID] = {
          allocations: [],
          algorithmRun
        }
        showToast(`הרצה מס' ${algorithmRun.ID} נוצרה בהצלחה`)
        const totalRoomsAllocated = Object.values(result.allocations).reduce((acc, allocation) => {
          return acc + Object.values(allocation).reduce((sum, rooms) => sum + rooms[0].free_room_count, 0);
        }, 0);
        const totalRoomsUnallocated = Object.values(result.unallocated).reduce((acc, rooms) => {  
          return acc + rooms[0].free_room_count;
        }, 0);
        showToast(`שורינו ${totalRoomsAllocated} חדרים`)
        showToast(`נותרו ${totalRoomsUnallocated} חדרים`)
        
        

        return algorithmRun;
    }
}

export const evacPlanStore = new EvacPlanStore();
