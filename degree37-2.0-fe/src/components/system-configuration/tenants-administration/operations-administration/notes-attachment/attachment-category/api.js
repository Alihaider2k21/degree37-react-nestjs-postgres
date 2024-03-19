import axios from 'axios';
const BASE_URL = process.env.REACT_APP_BASE_URL;

export const getAttachmentCategoriesApi = ({ params = {} }) => {
  return axios.get(`${BASE_URL}/notes-attachments/attachment-categories`, {
    params,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
};
export const getAttachmentCategoryApi = ({ id }) => {
  return axios.get(
    `${BASE_URL}/notes-attachments/attachment-categories/${id}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );
};
export const createAttachmentCategoryApi = ({ payload }) => {
  return axios.post(
    `${BASE_URL}/notes-attachments/attachment-categories`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );
};
export const updateAttachmentCategoryApi = ({ id, payload }) => {
  return axios.put(
    `${BASE_URL}/notes-attachments/attachment-categories/${id}`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );
};
export const archiveAttachmentCategoryApi = ({ id }) => {
  return axios.patch(
    `${BASE_URL}/notes-attachments/attachment-categories/${id}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );
};
