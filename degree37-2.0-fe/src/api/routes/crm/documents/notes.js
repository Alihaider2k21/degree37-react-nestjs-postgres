import axios from 'axios';
const BASE_URL = process.env.REACT_APP_BASE_URL;

export const notesApi = {
  createNote: async (payload) => {
    return await axios.post(`${BASE_URL}/notes`, payload);
  },
  updateNote: async (noteId, payload) => {
    return await axios.put(`${BASE_URL}/notes/${noteId}`, payload);
  },
  archiveNote: async (noteId) => {
    return await axios.patch(`${BASE_URL}/notes/archive/${noteId}`);
  },
  getAllNotes: async (queryParams) => {
    const url = `${BASE_URL}/notes?noteable_type=${encodeURIComponent(
      queryParams?.noteable_type
    )}&noteable_id=${encodeURIComponent(queryParams?.id)}&sortBy=${
      queryParams?.sortBy ?? ''
    }&sortOrder=${queryParams?.sortOrder}&limit=${queryParams?.limit}&page=${
      queryParams?.currentPage
    }${
      queryParams?.status && queryParams?.status.label !== 'Status'
        ? `&is_active=${encodeURIComponent(queryParams?.status.value)}`
        : ''
    }${
      queryParams?.category_id?.id
        ? `&category_id=${encodeURIComponent(queryParams?.category_id.id)}`
        : ''
    }${
      queryParams?.sub_category_id?.id
        ? `&sub_category_id=${encodeURIComponent(
            queryParams?.sub_category_id.id
          )}`
        : ''
    }${
      queryParams?.search
        ? `&keyword=${encodeURIComponent(queryParams?.search)}`
        : ''
    }`;

    return await axios.get(url);
  },
  getNoteByID: async (noteId) => {
    return await axios.get(`${BASE_URL}/notes/${noteId}`);
  },
};
