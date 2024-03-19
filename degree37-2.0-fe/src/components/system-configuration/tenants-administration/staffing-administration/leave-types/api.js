import axios from 'axios';
const BASE_URL = process.env.REACT_APP_BASE_URL;
const bearerToken = localStorage.getItem('token');
const headers = { authorization: `Bearer ${bearerToken}` };

export const getLeaveTypesApi = ({ params }) => {
  return axios.get(`${BASE_URL}/staffing-admin/leave-type/`, {
    params,
    headers,
  });
};
export const getLeaveTypeApi = ({ id }) => {
  return axios.get(`${BASE_URL}/staffing-admin/leave-type/${id}`, {
    headers,
  });
};
export const createLeaveTypeApi = ({ stage }) => {
  return axios.post(`${BASE_URL}/staffing-admin/leave-type/`, stage, {
    headers,
  });
};
export const updateLeaveTypeApi = ({ id, stage }) => {
  return axios.put(`${BASE_URL}/staffing-admin/leave-type/${id}`, stage, {
    headers,
  });
};
export const archiveLeaveTypeApi = ({ id }) => {
  return axios.put(
    `${BASE_URL}/staffing-admin/leave-type/archive/${id}`,
    {},
    {
      headers,
    }
  );
};
