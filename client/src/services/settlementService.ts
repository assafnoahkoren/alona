import { EnrichedSettlement } from './../../../server/routers/models/settlementRoutes';
import axios from 'axios';
import { BASE_URL } from './config';


const settlementService = {
  getAll: async (): Promise<EnrichedSettlement[]> => {
    const response = await axios.get(`${BASE_URL}/auth/settlements`);
    return response.data;
  }
};

export default settlementService;
