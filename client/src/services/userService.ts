import axios from 'axios';
import { BASE_URL } from './config';

const userService = {
  getAll: async () => {
    const response = await axios.get(`${BASE_URL}/auth/users`);
    return response.data;
  },
};

export default userService;
