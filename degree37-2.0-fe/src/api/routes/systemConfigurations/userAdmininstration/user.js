import axios from 'axios';
const BASE_URL = process.env.REACT_APP_BASE_URL;

export const users = {
  getCurrent: async () => {
    return await axios.get(BASE_URL + `/user/current/detail`);
  },
};
