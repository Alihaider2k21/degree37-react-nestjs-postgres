import axios from 'axios';
const BASE_URL = process.env.REACT_APP_BASE_URL;

export const nonCollectionEvents = {
  categories: {
    getAll: async () => {
      return await axios.get(`${BASE_URL}/nce-category`);
    },
  },
  Subcategories: {
    getAll: async () => {
      return await axios.get(`${BASE_URL}/nce-subcategory`);
    },
  },
};
