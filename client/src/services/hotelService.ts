import axios from 'axios';
import { BASE_URL } from './config';

const hotelService = {
  getAll: async () => {
    const response = await axios.get(`${BASE_URL}/hotels`);
    return response.data;
  }
};

export default hotelService;
