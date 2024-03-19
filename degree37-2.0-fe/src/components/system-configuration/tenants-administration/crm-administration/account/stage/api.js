import axios from 'axios';
const BASE_URL = process.env.REACT_APP_BASE_URL;

export const getStagesApi = ({ params }) => {
  return axios.get(`${BASE_URL}/stages`, {
    params,
  });
};
export const getStageApi = ({ id }) => {
  return axios.get(`${BASE_URL}/stages/${id}`);
};
export const createStageApi = ({ stage }) => {
  return axios.post(`${BASE_URL}/stages`, stage);
};
export const updateStageApi = ({ id, stage }) => {
  return axios.put(`${BASE_URL}/stages/${id}`, stage);
};
export const archiveStageApi = ({ id }) => {
  return axios.put(`${BASE_URL}/stages/archive/${id}`);
};
