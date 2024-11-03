import { Algorithm_Run } from '@prisma/client';
import axios from 'axios';
import { BASE_URL } from './config';

export interface CreateAlgorithmRunDto {
  parameters?: string;
  Is_active?: boolean;
  last_run_id?: number;
}

const algorithmRunService = {
  getAll: async (): Promise<Algorithm_Run[]> => {
    const response = await axios.get(`${BASE_URL}/auth/algorithm-runs`);
    return response.data;
  },
  create: async (data: CreateAlgorithmRunDto): Promise<Algorithm_Run> => {
    const response = await axios.post(`${BASE_URL}/auth/algorithm-runs`, data);
    return response.data;
  }
};

export default algorithmRunService;
