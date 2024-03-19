import axios from 'axios';
import moment from 'moment';
const BASE_URL = process.env.REACT_APP_BASE_URL;

export const locationsApi = {
  getLocation: async (id) => {
    return await axios.get(`${BASE_URL}/crm/locations/${id}`);
  },
  getDriveHistory: async (id, filters) => {
    return await axios.get(
      `${BASE_URL}/crm/locations/${id}/drives-history?status=${
        filters?.status || ''
      }&page=${filters?.page}&limit=${filters?.limit}&start_date=${
        filters?.startDate != '' ? moment(filters?.startDate) : ''
      }&end_date=${
        filters?.endDate != '' ? moment(filters?.endDate) : ''
      }&sortName=${filters?.sortName}&sortOrder=${filters?.sortOrder}`
    );
  },
  getDriveHistoryKPI: async (id, filters) => {
    return await axios.get(
      `${BASE_URL}/crm/locations/${id}/drives-history/kpi`
    );
  },

  getDriveHistoryDetail: async (id, driveId) => {
    return await axios.get(
      `${BASE_URL}/crm/locations/${id}/drives-history/detail/${driveId}`
    );
  },
};
