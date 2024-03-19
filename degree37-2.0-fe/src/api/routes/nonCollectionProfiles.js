import axios from 'axios';
const BASE_URL = process.env.REACT_APP_BASE_URL;

export const nonCollectionProfiles = {
  collectionOperation: {
    getAll: async (token, status) => {
      return await axios.get(
        BASE_URL + `/business_units/collection_operations/list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
  },
  ownerId: {
    getAll: async (token, params) => {
      return await axios.get(
        BASE_URL + `/user/collection-operation/${params}/all-owners`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
  },
  eventCategory: {
    getAll: async (token, status) => {
      return await axios.get(
        BASE_URL +
          `/nce-category/get-all${status ? `?is_active=${status}` : ''}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
  },
  eventSubCategory: {
    getAll: async (token, params, status) => {
      return await axios.get(
        BASE_URL +
          `/nce-subcategory/get-all${params ? `?id=${params}` : ''}${
            status ? `&is_active=${status}` : ''
          }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
  },
  create: {
    post: async (token, body) => {
      return await axios.post(BASE_URL + `/non-collection-profiles`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
  },
  getNonCollectionProfile: {
    get: async (token, params) => {
      return await axios.get(BASE_URL + `/non-collection-profiles/${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
  },
  update: {
    put: async (token, id, body) => {
      return await axios.put(
        BASE_URL + `/non-collection-profiles/${id}`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
  },
  archive: {
    patch: async (token, params) => {
      return await axios.patch(
        BASE_URL + `/non-collection-profiles/archive/${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
  },
  list: {
    getAll: async (
      token,
      limit,
      currentPage,
      sortBy,
      sortOrder,
      organizationalLevel,
      eventCategoryData,
      eventSubCategoryData,
      searchText,
      isActive
    ) => {
      return await axios.get(
        BASE_URL +
          `/non-collection-profiles${limit ? `?limit=${limit}` : ''}${
            currentPage ? `&page=${currentPage}` : ''
          }${sortBy ? `&sortBy=${sortBy}&sortOrder=${sortOrder}` : ''}${
            organizationalLevel
              ? `&organizational_levels=${organizationalLevel}`
              : ''
          }${
            eventCategoryData ? `&event_category_id=${eventCategoryData}` : ''
          }${
            eventSubCategoryData
              ? `&event_subcategory_id=${eventSubCategoryData}`
              : ''
          }${`&is_active=${
            isActive === true ? true : isActive === false ? false : ''
          }`}${searchText ? `&keyword=${searchText}` : ''}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    get: async (token) => {
      return await axios.get(BASE_URL + `/non-collection-profiles/get-all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
  },
  blueprint: {
    getAll: async (
      token,
      id,
      currentPage,
      limit,
      sortBy,
      sortOrder,
      statusDataText,
      searchText
    ) => {
      return await axios.get(
        `${BASE_URL}/non-collection-profiles/${id}/blueprints?page=${currentPage}&limit=${limit}${
          statusDataText?.value != null
            ? `&is_active=${statusDataText?.value}`
            : ''
        }${searchText ? `&keyword=${searchText}` : ''}${
          sortBy ? `&sortBy=${sortBy}` : ''
        }${sortOrder ? `&sortOrder=${sortOrder}` : ''}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    getViewAbout: async (id, token) => {
      return await axios.get(
        `${BASE_URL}/non-collection-profiles/blueprints/${id}/about`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    getViewShiftDetails: async (id, token) => {
      return await axios.get(
        `${BASE_URL}/non-collection-profiles/blueprints/${id}/shift-details`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    getLocations: async (token) => {
      return await axios.get(`${BASE_URL}/crm/locations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    getStaffRoles: async (token) => {
      return await axios.get(
        `${BASE_URL}/contact-roles?status=true&function_id=1`
      );
    },
    getVehicles: async (token) => {
      return await axios.get(`${BASE_URL}/vehicles`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    getNcpVehicles: async (token, id) => {
      return await axios.get(
        `${BASE_URL}/non-collection-profiles/collection-operation/${id}?vehicles=true`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    getNcpDevices: async (token, id) => {
      return await axios.get(
        `${BASE_URL}/non-collection-profiles/collection-operation/${id}?devices=true`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    getNcproles: async (token, id) => {
      return await axios.get(
        `${BASE_URL}/non-collection-profiles/collection-operation/${id}?roles=true`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    getDevices: async (token) => {
      return await axios.get(`${BASE_URL}/devices`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    archive: async (id, token) => {
      return await axios.patch(
        `${BASE_URL}/non-collection-profiles/blueprints/archive/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    defaultBlueprint: async (id, token) => {
      return await axios.patch(
        `${BASE_URL}/non-collection-profiles/blueprints/default/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    edit: async (id, token, body) => {
      return await axios.put(
        `${BASE_URL}/non-collection-profiles/blueprints/${id}`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    create: async (id, token, body) => {
      return await axios.post(
        `${BASE_URL}/non-collection-profiles/${id}/blueprints`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
  },
  eventHistory: {
    getAll: async (
      token,
      id,
      currentPage,
      limit,
      sortBy,
      sortOrder,
      statusDataText,
      searchText,
      dateFormat
    ) => {
      return await axios.get(
        `${BASE_URL}/non-collection-profiles/${id}/events?page=${currentPage}&limit=${limit}${
          statusDataText?.value != null
            ? `&status=${statusDataText?.value}`
            : ''
        }${searchText ? `&keyword=${searchText}` : ''}${
          sortBy ? `&sortBy=${sortBy}` : ''
        }${sortOrder ? `&sortOrder=${sortOrder}` : ''}${
          dateFormat ? `&selected_date=${dateFormat}` : ''
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    getStatus: async (token) => {
      return await axios.get(`${BASE_URL}/oc_non_collection_events/status`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
  },
};
