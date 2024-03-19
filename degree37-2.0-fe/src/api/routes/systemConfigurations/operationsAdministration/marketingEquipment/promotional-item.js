import axios from 'axios';
const BASE_URL = process.env.REACT_APP_BASE_URL;

export const promotionalItems = {
  getPromotionalItemsByCollectionOperation: async (params) => {
    return await axios.get(
      BASE_URL +
        `/marketing-equipment/promotional-items/drives/byCollectionOperation?collectionOperationId=${params.collection_operations}`
    );
  },
};
