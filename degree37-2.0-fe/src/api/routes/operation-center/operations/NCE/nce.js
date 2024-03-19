import axios from 'axios';
const BASE_URL = process.env.REACT_APP_BASE_URL;

export const ocNonCollectionEvents = {
  list: {
    getAll: async (
      token,
      limit,
      currentPage,
      sortBy,
      sortOrder,
      collectionOperationData,
      eventCategoryData,
      eventSubCategoryData,
      exportType,
      selectedOptions,
      searchText,
      isActive
    ) => {
      return await axios.get(
        BASE_URL +
          `/operations/non-collection-events${limit ? `?limit=${limit}` : ''}${
            currentPage ? `&page=${currentPage}` : ''
          }${
            sortBy ? `&sortBy=${sortBy}&sortOrder=${sortOrder}` : ''
          }${`&is_active=${
            isActive === true ? true : isActive === false ? false : ''
          }`}${searchText ? `&keyword=${searchText}` : ''}
          ${
            selectedOptions && exportType === 'filtered'
              ? `&selectedOptions=${selectedOptions?.label}`
              : ''
          }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
  },
  create: async (token, body) => {
    return await axios.post(
      BASE_URL + `/operations/non-collection-events`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },
  operationstatus: {
    getAll: async (token) => {
      return await axios.get(
        `${BASE_URL}/booking-drive/operation-status?status=true`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
  },
  blueprint: {
    getAll: async (token, id) => {
      return await axios.get(
        `${BASE_URL}/non-collection-profiles/${id}/blueprints`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    shiftGetAll: async (token, id) => {
      return await axios.get(
        `${BASE_URL}/non-collection-profiles/blueprints/${id}/shift-details`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
  },
  singleGet: async (token, id) => {
    return await axios.get(
      `${BASE_URL}/operations/non-collection-events/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },
  shiftSingleGet: async (token, id) => {
    return await axios.get(
      `${BASE_URL}/operations/non-collection-events/${id}/shift-details`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },
  nceCopyDataGet: async (token, id) => {
    return await axios.get(
      `${BASE_URL}/operations/non-collection-events/location-events/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },
  updateData: async (token, id, body) => {
    return await axios.put(
      BASE_URL + `/operations/non-collection-events/${id}`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },
  archiveData: async (token, id) => {
    return await axios.patch(
      BASE_URL + `/operations/non-collection-events/archive/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },
  getNceLocations: async (token, cOId, date) => {
    return await axios.get(
      `${BASE_URL}/operations/non-collection-events/with-directions${
        cOId ? `/${cOId}` : ''
      } ${date ? `?date=${date}` : ''}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },
  getCustomFieldData: async (id) => {
    return await axios.get(
      `${BASE_URL}/system-configuration/organization-administration/custom-fields/data?custom_field_datable_id=${id}&custom_field_datable_type=non_collection_events`
    );
  },
};
