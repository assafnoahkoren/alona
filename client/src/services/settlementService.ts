import axios from 'axios';
import { BASE_URL } from './config';

export interface SettlementToEvacuate {
  Settlement_ID: string;
  Name?: string;
  rooms_needed?: string;
  run_id?: number;
}

export interface Settlement {
  Settlement_ID: string;
  Name: string;
  District?: string;
  Settlements_To_Evacuate?: SettlementToEvacuate[];
}

const settlementService = {
  getAll: async () => {
    const response = await axios.get(`${BASE_URL}/auth/settlements`);
    return response.data;
  }
};

export default settlementService;
