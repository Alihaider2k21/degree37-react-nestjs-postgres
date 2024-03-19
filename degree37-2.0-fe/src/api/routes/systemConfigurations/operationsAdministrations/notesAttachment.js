import axios from 'axios';
const BASE_URL = process.env.REACT_APP_BASE_URL;

export const notesAttachment = {
  attachmentCategories: {
    getAll: async () => {
      return await axios.get(
        `${BASE_URL}/notes-attachments/attachment-categories?is_active=true`
      );
    },
  },
  attachmentSubcategories: {
    getAll: async () => {
      return await axios.get(
        `${BASE_URL}/notes-attachments/attachment-subcategories?is_active=true`
      );
    },
  },
  noteCategories: {
    getAll: async () => {
      return await axios.get(
        `${BASE_URL}/note-attachment/note-category?is_active=true`
      );
    },
  },
  noteSubcategories: {
    getAll: async () => {
      return await axios.get(
        `${BASE_URL}/note-attachment/note-subcategory?is_active=true`
      );
    },
  },
};
