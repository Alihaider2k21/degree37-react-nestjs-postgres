import axios from 'axios';
const BASE_URL = process.env.REACT_APP_BASE_URL;

export const procedureTypes = {
  list: async (params) => {
    let url = BASE_URL + `/procedure_types`;
    url += '?' + new URLSearchParams(params).toString();
    return await axios.get(url);
  },
};
