import axios from 'axios';
import { BASE_URL } from './config';

const roomService = {
  getAll: async () => {
    const response = await axios.get(`${BASE_URL}/rooms`);
    return response.data;
  }
};

export default roomService;
