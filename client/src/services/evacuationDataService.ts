import axios from 'axios';
import { BASE_URL } from './config';
import { EvacuationDataResponse } from '../../../server/routers/models/evacuationDataRoutes.ts';


const evacuationDataService = {
  getAll: async (): Promise<EvacuationDataResponse[]> => {
    const response = await axios.get(`${BASE_URL}/auth/evacuation-data`);
    return response.data;
  }
};

export default evacuationDataService;
