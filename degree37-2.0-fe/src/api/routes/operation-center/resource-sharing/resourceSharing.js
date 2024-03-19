import axios from 'axios';
const BASE_URL = process.env.REACT_APP_BASE_URL;

export const resourceSharingApis = {
  getCollectionOperations: async (token) => {
    return await axios.get(
      `${BASE_URL}/operations-center/resource-sharing/collection_operations/list`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },
  create: async (token, body) => {
    return await axios.post(
      `${BASE_URL}/operations-center/resource-sharing`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },
  getById: async (token, id) => {
    return await axios.get(
      `${BASE_URL}/operations-center/resource-sharing/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },
  updateById: async (token, id, body) => {
    return await axios.put(
      `${BASE_URL}/operations-center/resource-sharing/${id}`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },
  getAll: async (
    token,
    limit,
    currentPage,
    sortBy,
    sortOrder,
    searchText,
    collectionOperation,
    shareType,
    startDate,
    endDate
  ) => {
    return await axios.get(
      `${BASE_URL}/operations-center/resource-sharing${
        limit ? `?limit=${limit}` : ''
      }${currentPage ? `&page=${currentPage}` : ''}${
        sortBy ? `&sortBy=${sortBy}&sortOrder=${sortOrder}` : ''
      }${searchText ? `&keyword=${searchText}` : ''}${
        collectionOperation
          ? `&collection_operation_id=${collectionOperation?.value}`
          : ''
      }${shareType ? `&share_type=${shareType?.value}` : ''}${
        startDate && endDate
          ? `&date_range=${startDate},${endDate}`
          : startDate
          ? `&date_range=${startDate},`
          : endDate
          ? `&date_range=,${endDate}`
          : ''
      }`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },
  getAllFileData: async (token) => {
    return await axios.get(
      `${BASE_URL}/operations-center/resource-sharing?fetchAll=true`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },
  archiveData: async (token, id) => {
    return await axios.patch(
      `${BASE_URL}/operations-center/resource-sharing/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },
  postFullfillRequest: async (token, id, body) => {
    return await axios.post(
      `${BASE_URL}/operations-center/resource-sharing/${id}/fulfill-request`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },
  archivedFullfillRequest: async (token, id, body) => {
    return await axios.patch(
      `${BASE_URL}/operations-center/resource-sharing/${id}/fulfill-request`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },
  getFullfillRequest: async (token, id) => {
    return await axios.get(
      `${BASE_URL}/operations-center/resource-sharing/${id}/fulfill-request`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },
};
