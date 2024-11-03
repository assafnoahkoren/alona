import axios from 'axios';
import { BASE_URL } from './config';

export interface CreateSettlementToEvacuateDto {
  Settlement_ID: string;
  Name?: string;
  rooms_needed?: string;
  run_id?: number;
}

const settlementToEvacuateService = {
  getAll: async () => {
    const response = await axios.get(`${BASE_URL}/settlements-to-evacuate`);
    return response.data;
  },
  create: async (data: CreateSettlementToEvacuateDto) => {
    const response = await axios.post(`${BASE_URL}/settlements-to-evacuate`, data);
    return response.data;
  }
};

export default settlementToEvacuateService;
