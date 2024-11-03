import axios from 'axios';
import { BASE_URL } from './config';

const settlementService = {
  getAll: async () => {
    const response = await axios.get(`${BASE_URL}/auth/settlements`);
    return response.data;
  }
};

export default settlementService;
