import axios from 'axios';
const BASE_URL = process.env.REACT_APP_BASE_URL;

export const drives = {
  getAccountBlueprints: async (id) => {
    let url = BASE_URL + `/drives/blueprints/account/${id}`;
    return await axios.get(url);
  },
  getAccountDrives: async (id) => {
    let url = BASE_URL + `/drives/list/account/${id}`;
    return await axios.get(url);
  },
  getSingle: async (id) => {
    let url = BASE_URL + `/drives/single/${id}`;
    return await axios.get(url);
  },
  getShiftDetails: async (id) => {
    let url = BASE_URL + `/drives/shift/${id}`;
    return await axios.get(url);
  },
  getDriveData: async (id) => {
    let url = BASE_URL + `/drives/${id}`;
    return await axios.get(url);
  },
  archive: async (id) => {
    return await axios.delete(`${BASE_URL}/drives/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  },
};
