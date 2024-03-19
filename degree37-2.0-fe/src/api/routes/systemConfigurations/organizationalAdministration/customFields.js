import axios from 'axios';
const BASE_URL = process.env.REACT_APP_BASE_URL;

export const customFields = {
  getModuleCustomFields: async (module) => {
    return await axios.get(
      BASE_URL +
        `/system-configuration/organization-administration/custom-fields/modules/${module}`
    );
  },
};
