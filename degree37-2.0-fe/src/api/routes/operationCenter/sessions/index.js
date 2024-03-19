import axios from 'axios';
const BASE_URL = process.env.REACT_APP_BASE_URL;

export const sessions = {
  create: async (payload) => {
    return await axios.post(BASE_URL + `/operations/sessions/create`, payload);
  },
  list: async (params) => {
    let url = BASE_URL + `/operations/sessions/list`;
    url += '?' + new URLSearchParams(params).toString();
    return await axios.get(url);
  },
  delete: async (id) => {
    return await axios.delete(BASE_URL + `/operations/sessions/${id}/delete`);
  },
  getShiftDetails: async (id) => {
    let url = BASE_URL + `/operations/sessions/shift/${id}`;
    return await axios.get(url);
  },
  getSessionData: async (id) => {
    let url = BASE_URL + `/operations/sessions/${id}`;
    return await axios.get(url);
  },
};
