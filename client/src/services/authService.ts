import axios from 'axios';
import { BASE_URL } from './config.ts';

const authService = {
  login: async (data: { email: string; password: string }) => {
    const response = await axios.post(`${BASE_URL}/auth/login`, data);
    return response.data;
  },
  register: async (data: { email: string; password: string }) => {
    const response = await axios.post(`${BASE_URL}/auth/register`, data);
    return response.data;
  },
};

export default authService;
