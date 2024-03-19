import axios from 'axios';
const BASE_URL = process.env.REACT_APP_BASE_URL;

export const staffSetup = {
  getStaffSetupForBlueprint: async (params) => {
    let url = BASE_URL + `/staffing-admin/staff-setup/blueprint/donor_center`;
    url += '?' + new URLSearchParams(params).toString();
    return await axios.get(url);
  },
};
