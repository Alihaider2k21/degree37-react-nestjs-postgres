import axios from 'axios';
const BASE_URL = process.env.REACT_APP_BASE_URL;

export const operationCenterNce = {
  operationstatus: {
    getAll: async (token) => {
      return await axios.get(`${BASE_URL}/booking-drive/operation-status`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
  },
  blueprint: {
    getAll: async (token, id) => {
      return await axios.get(
        `${BASE_URL}/non-collection-profiles/${id}/blueprints`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
  },
};
