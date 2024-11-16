import axios from 'axios';
import { BASE_URL } from './config';

const evacuationDataService = {
  getAll: async () => {
    const response = await axios.get(`${BASE_URL}/auth/evacuation-data`);
    return response.data;
  }
};

export default evacuationDataService;
