import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api';

interface CreateAlgorithmRunDto {
  parameters?: string;
  Is_active?: boolean;
  last_run_id?: number;
}

interface CreateAllocationDto {
  Hotel_ID?: string;
  Settelment_ID?: string;
  Rooms?: string;
  run_id?: number;
}

interface CreateSettlementToEvacuateDto {
  Settlement_ID: string;
  Name?: string;
  rooms_needed?: string;
  run_id?: number;
}

const apiService = {
  algorithmRun: {
    getAll: async () => {
      const response = await axios.get(`${BASE_URL}/algorithm-runs`);
      return response.data;
    },
    create: async (data: CreateAlgorithmRunDto) => {
      const response = await axios.post(`${BASE_URL}/algorithm-runs`, data);
      return response.data;
    }
  },

  allocation: {
    getAll: async () => {
      const response = await axios.get(`${BASE_URL}/allocations`);
      return response.data;
    },
    create: async (data: CreateAllocationDto) => {
      const response = await axios.post(`${BASE_URL}/allocations`, data);
      return response.data;
    }
  },

  settlementToEvacuate: {
    getAll: async () => {
      const response = await axios.get(`${BASE_URL}/settlements-to-evacuate`);
      return response.data;
    },
    create: async (data: CreateSettlementToEvacuateDto) => {
      const response = await axios.post(`${BASE_URL}/settlements-to-evacuate`, data);
      return response.data;
    }
  },

  hotels: {
    getAll: async () => {
      const response = await axios.get(`${BASE_URL}/hotels`);
      return response.data;
    }
  },

  rooms: {
    getAll: async () => {
      const response = await axios.get(`${BASE_URL}/rooms`);
      return response.data;
    }
  },

  settlements: {
    getAll: async () => {
      const response = await axios.get(`${BASE_URL}/settlements`);
      return response.data;
    }
  }
};

export default apiService;
