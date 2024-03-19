import axios from 'axios';
const BASE_URL = process.env.REACT_APP_BASE_URL;

export const attachmentApi = {
  createAttachment: async (id, type, payload) => {
    return await axios.post(
      `${BASE_URL}/documents/attachments?attachmentable_id=${id}&attachmentable_type=${type}`,
      payload
    );
  },
  updateAttachment: async (attachId, payload) => {
    return await axios.put(
      `${BASE_URL}/documents/attachments/${attachId}`,
      payload
    );
  },
  archiveAttachment: async (attachId) => {
    return await axios.patch(
      `${BASE_URL}/documents/attachments/archive/${attachId}`
    );
  },
  getAllAttachment: async (queryParams) => {
    queryParams = queryParams || {};
    const url = `${BASE_URL}/documents/attachments?attachmentable_id=${encodeURIComponent(
      queryParams.id || ''
    )}&attachmentable_type=${encodeURIComponent(
      queryParams.type || ''
    )}&sortBy=${encodeURIComponent(queryParams.sortBy || '')}&sortOrder=${
      queryParams.sortOrder ? 'asc' : 'desc'
    }&limit=${queryParams.limit || ''}&page=${queryParams.currentPage || ''}${
      queryParams.category ? `&category_id=${+queryParams.category}` : ''
    }${
      queryParams.subCategory
        ? `&sub_category_id=${+queryParams.subCategory}`
        : ''
    }${
      queryParams?.search
        ? `&keyword=${encodeURIComponent(queryParams?.search)}`
        : ''
    }`;

    return await axios.get(url);
  },
  getAttachmentByID: async (attachId) => {
    return await axios.get(`${BASE_URL}/documents/attachments/${attachId}`);
  },
};
