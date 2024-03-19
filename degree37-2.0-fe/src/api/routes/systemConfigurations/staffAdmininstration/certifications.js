import axios from 'axios';
const BASE_URL = process.env.REACT_APP_BASE_URL;

export const Certifications = {
  getCertificationsByType: async (type, is_active) => {
    return await axios.get(
      BASE_URL +
        `/staffing-admin/certification?associationType=${type}&is_active=${is_active}`
    );
  },
};
