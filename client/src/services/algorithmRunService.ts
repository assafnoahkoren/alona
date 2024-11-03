import axios from 'axios';
import { BASE_URL } from './config';

export interface CreateAlgorithmRunDto {
  parameters?: string;
  Is_active?: boolean;
  last_run_id?: number;
}

const algorithmRunService = {
  getAll: async () => {
    const response = await axios.get(`${BASE_URL}/algorithm-runs`);
    return response.data;
  },
  create: async (data: CreateAlgorithmRunDto) => {
    const response = await axios.post(`${BASE_URL}/algorithm-runs`, data);
    return response.data;
  }
};

export default algorithmRunService;
