import { Algorithm_Run } from '@prisma/client';
import axios from 'axios';
import { BASE_URL } from './config';

export interface CreateAlgorithmRunDto {
  parameters?: string;
  Is_active?: boolean;
  last_run_id?: number;
}

export interface AlgorithmRunWithResult {
  algorithmRun: Algorithm_Run;
  result: {
    allocations: Record<string, Record<string, {
      Room_ID: number;
      Hotel_ID: string;
      Room_type: string;
      free_room_count: number;
    }[]>>;
    unallocated: Record<string, {
      Room_ID: number;
      Hotel_ID: string;
      Room_type: string;
      free_room_count: number;
    }[]>;
    duration: number;
  }
}

const algorithmRunService = {
  getAll: async (): Promise<Algorithm_Run[]> => {
    const response = await axios.get(`${BASE_URL}/auth/algorithm-runs`);
    return response.data;
  },
  create: async (data: CreateAlgorithmRunDto): Promise<AlgorithmRunWithResult> => {
    const response = await axios.post(`${BASE_URL}/auth/algorithm-runs`, data);
    return response.data;
  }
};

export default algorithmRunService;
