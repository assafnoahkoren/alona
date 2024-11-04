import { EnrichedSettlement } from './../../../server/routers/models/settlementRoutes';
import axios from 'axios';
import { BASE_URL } from './config';


const settlementService = {
  getAll: async (): Promise<EnrichedSettlement[]> => {
    const response = await axios.get(`${BASE_URL}/auth/settlements`);
    return response.data;
  },
  create: async (settlementId: EnrichedSettlement['Settlement_id'], numberOfRooms: number): Promise<EnrichedSettlement> => {
    const response = await axios.post(`${BASE_URL}/auth/settlements/${settlementId}`, {numberOfRooms});
    return response.data;
  },
  remove: async (settlementId: EnrichedSettlement['Settlement_id']): Promise<EnrichedSettlement> => {
    const response = await axios.delete(`${BASE_URL}/auth/settlements/${settlementId}`);
    return response.data;
  },
};

export default settlementService;
