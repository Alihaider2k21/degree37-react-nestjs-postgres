import axios from 'axios';
import moment from 'moment';
const BASE_URL = process.env.REACT_APP_BASE_URL;

export const crmAccounts = {
  getAll: async () => {
    return await axios.get(
      `${BASE_URL}/accounts/?fetch_all=true&is_active=true`
    );
  },
  getAllRecruiterAccounts: async () => {
    return await axios.get(`${BASE_URL}/accounts/recruiter`);
  },
  getAllRecruiterAccountsByRecruiterId: async (id, accountsSearchText) => {
    return await axios.get(
      `${BASE_URL}/accounts/recruiter/${id}?${
        accountsSearchText && accountsSearchText.length
          ? '&name=' + accountsSearchText
          : ''
      }`
    );
  },
  getDriveHistory: async (id, filters) => {
    return await axios.get(
      `${BASE_URL}/accounts/${id}/drives-history?status=${
        filters?.status || ''
      }&page=${filters?.page}&limit=${filters?.limit}&start_date=${
        filters?.startDate != '' ? moment(filters?.startDate) : ''
      }&end_date=${
        filters?.endDate != '' ? moment(filters?.endDate) : ''
      }&sortName=${filters?.sortName}&sortOrder=${filters?.sortOrder}`
    );
  },
  getDriveHistoryKPI: async (id, filters) => {
    return await axios.get(`${BASE_URL}/accounts/${id}/drives-history/kpi`);
  },

  getDriveHistoryDetail: async (id, driveId) => {
    return await axios.get(
      `${BASE_URL}/accounts/${id}/drives-history/detail/${driveId}`
    );
  },
  getAccountShiftDetails: async (id, token) => {
    return await axios.get(`${BASE_URL}/shifts/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  makeDefaultBlueprint: async (account_id, blueprint_id) => {
    return await axios.post(`${BASE_URL}/accounts/blueprint/default`, {
      account_id,
      blueprint_id,
    });
  },
};
