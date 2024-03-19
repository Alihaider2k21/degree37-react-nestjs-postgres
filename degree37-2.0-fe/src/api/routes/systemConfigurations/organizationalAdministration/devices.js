import axios from 'axios';
const BASE_URL = process.env.REACT_APP_BASE_URL;

export const devices = {
  getDriveDevices: async (params) => {
    let url = BASE_URL + `/devices/drives`;
    url += '?' + new URLSearchParams(params).toString();
    return await axios.get(url);
  },
};
