import axios from 'axios';
const BASE_URL = process.env.REACT_APP_BASE_URL;

export const ocCalendar = {
  goalvariance: {
    getGoalVariance: async (token) => {
      return await axios.get(`${BASE_URL}/goal_variance`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
  },
  filters: {
    getProcedure: async (token) => {
      return await axios.get(`${BASE_URL}/procedure_types?page=1&limit=10`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    getOrganization: async (token) => {
      return await axios.get(`${BASE_URL}/organizational_levels`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    getAllProducts: async (token) => {
      return await axios.get(`${BASE_URL}/products?page=1&limit=10`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    getProductsById: async (token, productsId) => {
      return await axios.get(
        `${BASE_URL}/operations-center/calender/procedure-type-products/${productsId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    getOperationStatus: async (token) => {
      return await axios.get(`${BASE_URL}/booking-drive/operation-status`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    createFavorite: async (token, body) => {
      return await axios.post(
        `${BASE_URL}/operations-center/manage-favorites`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
  },
  getView: async (token, month, year) => {
    return await axios.get(
      `${BASE_URL}/operations-center/calender/monthly-view${
        month ? `?month=${month}&year=${year}` : ''
      }`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },
  getPromotions: async (token) => {
    return await axios.get(`${BASE_URL}/marketing-equipment/promotions`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  getBanners: async (token) => {
    return await axios.get(`${BASE_URL}/banners`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
