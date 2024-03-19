import axios from 'axios';
const BASE_URL = process.env.REACT_APP_BASE_URL;

export const getAttachmentSubcategoriesApi = ({ params }) => {
  return axios.get(`${BASE_URL}/notes-attachments/attachment-subcategories`, {
    params,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
};
export const getAttachmentSubcategoryApi = ({ id }) => {
  return axios.get(
    `${BASE_URL}/notes-attachments/attachment-subcategories/${id}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );
};
export const createAttachmentSubcategoryApi = ({ payload }) => {
  return axios.post(
    `${BASE_URL}/notes-attachments/attachment-subcategories`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );
};
export const updateAttachmentSubcategoryApi = ({ id, payload }) => {
  return axios.put(
    `${BASE_URL}/notes-attachments/attachment-subcategories/${id}`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );
};
export const archiveAttachmentSubcategoryApi = ({ id }) => {
  return axios.patch(
    `${BASE_URL}/notes-attachments/attachment-subcategories/${id}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );
};
