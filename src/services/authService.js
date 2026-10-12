import api from '../api/Axios';

export const loginRequest = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};