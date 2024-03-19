import axios from 'axios';
const BASE_URL = process.env.REACT_APP_BASE_URL;

export const donorCenter = {
  blueprint: {
    getdetails: async (bluePrintId, token) => {
      return await axios.get(
        `${BASE_URL}/facility/donor-center/bluePrints/details/${bluePrintId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    getShiftDetails: async (bluePrintId, token) => {
      return await axios.get(
        `${BASE_URL}/facility/donor-center/bluePrints/shift-details/${bluePrintId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    getDonorSchedule: async (token, id) => {
      return await axios.get(
        `${BASE_URL}/non-collection-profiles/${id}/blueprints`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    archive: async (id) => {
      return await axios.delete(
        `${BASE_URL}/facility/donor-center/bluePrints/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
    },
    getOne: async (id) => {
      return await axios.get(
        `${BASE_URL}/facility/donor-center/bluePrints/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
    },
  },
};
