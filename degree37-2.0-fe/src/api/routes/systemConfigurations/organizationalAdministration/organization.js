import axios from 'axios';
const BASE_URL = process.env.REACT_APP_BASE_URL;

export const organization = {
  getOrganizationalLevels: async () => {
    return await axios.get(BASE_URL + `/organizational_levels`);
  },
  getBusinessUnits: async (donor_centers = true, recruiters = true) => {
    const payload = { donor_centers, recruiters, status: true };
    let url = BASE_URL + `/business_units/list`;
    url += '?' + new URLSearchParams(payload).toString();
    return await axios.get(url);
  },
};
