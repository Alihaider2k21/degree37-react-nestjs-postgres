import axios from 'axios';
const BASE_URL = process.env.REACT_APP_BASE_URL;

export const directionsApi = {
  createDirection: async (payload) => {
    return await axios.post(`${BASE_URL}/location/direction`, payload);
  },
  updateDirection: async (id, payload) => {
    return await axios.put(`${BASE_URL}/location/direction/${id}`, payload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  },
  archiveDirection: async (id) => {
    return await axios.patch(`${BASE_URL}/location/direction/archive/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  },
  getAllDirections: async (queryParams) => {
    queryParams = queryParams || {};
    const url = `${BASE_URL}/location/direction`;

    return await axios.get(url, { params: queryParams });
  },
  getDirectionByID: async (id) => {
    return await axios.get(`${BASE_URL}/location/direction/${id}`);
  },
};
