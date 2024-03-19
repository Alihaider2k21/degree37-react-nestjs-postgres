import axios from 'axios';
const BASE_URL = process.env.REACT_APP_BASE_URL;

export const approvals = {
  getApprovals: async () => {
    return await axios.get(BASE_URL + `/marketing-equipment/approvals`);
  },
};
