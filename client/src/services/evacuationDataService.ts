import axios from 'axios';
import { BASE_URL } from './config';

export interface EvacuationData {
  yishuvName: string;
  yishuvNumber: number;
  population: number;
  would_need_room_estimated: number;
}

const evacuationDataService = {
  getAll: async (): Promise<EvacuationData[]> => {
  getAll: async () => {
    const response = await axios.get(`${BASE_URL}/auth/evacuation-data`);
    return response.data;
  }
};

export default evacuationDataService;
