import axios from 'axios';
const BASE_URL = process.env.REACT_APP_BASE_URL;

export const leaveTypes = {
  getAll: async ({ params }) => {
    return await axios.get(BASE_URL + `/staffing-admin/leave-type/`, {
      params,
    });
  },
  getOne: async ({ id }) => {
    return await axios.get(BASE_URL + `/staffing-admin/leave-type/${id}`);
  },
};
