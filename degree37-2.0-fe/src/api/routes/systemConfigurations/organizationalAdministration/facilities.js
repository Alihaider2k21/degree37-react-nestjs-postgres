import axios from 'axios';
const BASE_URL = process.env.REACT_APP_BASE_URL;

export const facilities = {
  getDonorCenters: async () => {
    return await axios.post(
      BASE_URL + '/system-configuration/facilities/donor-centers/search',
      {
        fetch_all: true,
        is_donor_center: true,
        is_active: true,
      }
    );
  },
  getSessionHistoryKPI: async (facilityId, kind = true) => {
    return await axios.get(
      BASE_URL +
        `/system-configuration/facilities/${facilityId}/sessions-histories/key-performance-indicators?kind=${kind}`
    );
  },
  getSessionHistory: async (facilityId, params = null) => {
    let queryParams = '';
    if (params) queryParams = '?' + new URLSearchParams(params).toString();

    return await axios.get(
      BASE_URL +
        `/system-configuration/facilities/${facilityId}/sessions-histories${queryParams}`
    );
  },
  getSessionHistoryDetail: async (facilityId, sessionId) => {
    return await axios.get(
      BASE_URL +
        `/system-configuration/facilities/${facilityId}/sessions-histories/${sessionId}`
    );
  },
  getSingle: async (id) => {
    return await axios.get(BASE_URL + `/system-configuration/facilities/${id}`);
  },
  getStagingSitesAndDonorCenters: async (driveDate, collectionOperationId) => {
    return await axios.get(
      BASE_URL +
        `/system-configuration/facilities/get/stagingsite-donorcenters?collection_operation=${parseInt(
          collectionOperationId
        )}&drive_date=${driveDate}`
    );
  },
};
