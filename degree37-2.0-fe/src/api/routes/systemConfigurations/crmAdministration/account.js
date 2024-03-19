import axios from 'axios';
const BASE_URL = process.env.REACT_APP_BASE_URL;

export const accounts = {
  attachmentCategories: {
    getAll: async () => {
      return await axios.get(
        `${BASE_URL}/accounts/attachment-category?is_active=true`
      );
    },
  },
  attachmentSubcategories: {
    getAll: async () => {
      return await axios.get(
        `${BASE_URL}/accounts/attachment-subcategory?is_active=true`
      );
    },
  },
  noteCategories: {
    getAll: async () => {
      return await axios.get(
        `${BASE_URL}/accounts/note-category?is_active=true`
      );
    },
  },
  noteSubcategories: {
    getAll: async () => {
      return await axios.get(
        `${BASE_URL}/accounts/note-subcategory?is_active=true`
      );
    },
  },
};
