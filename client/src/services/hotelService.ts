import { EnrichedHotel } from './../../../server/routers/models/hotelRoutes';
import axios from 'axios';
import { BASE_URL } from './config';

const hotelService = {
  getAll: async (): Promise<EnrichedHotel[]> => {
    const response = await axios.get(`${BASE_URL}/auth/hotels`);
    return response.data;
  }
};

export default hotelService;
