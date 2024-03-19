import axios from 'axios';
const BASE_URL = process.env.REACT_APP_BASE_URL;

export const auth = {
  login: async (payload) => {
    const response = await axios.post(BASE_URL + 'route here', payload);
    return response;
  },
  refreshToken: async (username) => {
    const response = await axios.post(BASE_URL + '/auth/refresh-token', {
      username,
    });
    return response;
  },
};
