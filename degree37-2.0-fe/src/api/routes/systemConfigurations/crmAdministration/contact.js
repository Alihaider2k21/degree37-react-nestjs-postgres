import axios from 'axios';
const BASE_URL = process.env.REACT_APP_BASE_URL;

export const contacts = {
  attachmentCategories: {
    getAll: async () => {
      return await axios.get(
        `${BASE_URL}/contacts/attachment-category?is_active=true`
      );
    },
  },
  attachmentSubcategories: {
    getAll: async () => {
      return await axios.get(
        `${BASE_URL}/contacts/attachment-subcategory?is_active=true`
      );
    },
  },
  noteCategories: {
    getAll: async () => {
      return await axios.get(
        `${BASE_URL}/contacts/note-category?is_active=true`
      );
    },
  },
  noteSubcategories: {
    getAll: async () => {
      return await axios.get(
        `${BASE_URL}/contacts/note-subcategory?is_active=true`
      );
    },
  },

  getContactRoles: async (searchQuery, function_id) => {
    return await axios.get(
      `${BASE_URL}/contact-roles?status=true&&${
        searchQuery && searchQuery.length > 1 ? `name=${searchQuery}&` : ``
      }${function_id && `function_id=${function_id}`}`
    );
  },
  getContactDonorCenters: async (searchQuery) => {
    return await axios.get(
      `${BASE_URL}/system-configuration/facilities${
        searchQuery && searchQuery.length > 1 ? `?search=${searchQuery}` : ``
      }`
    );
  },
  getTeams: async (params = null) => {
    return await axios.get(`${BASE_URL}/staff-admin/teams`, { params: params });
  },
  getCertificates: async (staff_id) => {
    return await axios.get(
      `${BASE_URL}/staffing-admin/certification/list?is_active=true&staff_id=${staff_id}`
    );
  },
};
