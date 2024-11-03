import { Algorithm_Run } from '@prisma/client';
import { makeAutoObservable } from 'mobx';
import { Allocations } from '../../../server/routers/authenticatedRouter';
import apiService from '../services/apiService';
import { showToast } from '../infra/toast';
import { staticDataStore } from './static-data-store';
import settlementService from '../services/settlementService';

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
        const algorithmRun = await apiService.algorithmRun.create({
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
        
        

        return algorithmRun;
    }
}

export const evacPlanStore = new EvacPlanStore();
