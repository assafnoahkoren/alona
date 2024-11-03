import axios from 'axios';
import { BASE_URL } from './config';

export interface CreateAllocationDto {
  Hotel_ID?: string;
  Settelment_ID?: string;
  Rooms?: string;
  run_id?: number;
}

const allocationService = {
  getAll: async () => {
    const response = await axios.get(`${BASE_URL}/allocations`);
    return response.data;
  },
  create: async (data: CreateAllocationDto) => {
    const response = await axios.post(`${BASE_URL}/allocations`, data);
    return response.data;
  }
};

export default allocationService;
