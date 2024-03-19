import axios from 'axios';
const BASE_URL = process.env.REACT_APP_BASE_URL;

export const locations = {
  attachmentCategories: {
    getAll: async () => {
      return await axios.get(
        `${BASE_URL}/locations/attachment-category?is_active=true`
      );
    },
  },
  attachmentSubcategories: {
    getAll: async () => {
      return await axios.get(
        `${BASE_URL}/locations/attachment-subcategory?is_active=true`
      );
    },
  },
  noteCategories: {
    getAll: async () => {
      return await axios.get(
        `${BASE_URL}/locations/note-category?is_active=true`
      );
    },
  },
  noteSubcategories: {
    getAll: async () => {
      return await axios.get(
        `${BASE_URL}/locations/note-subcategory?is_active=true`
      );
    },
  },
};
