import axios from 'axios';
const BASE_URL = process.env.REACT_APP_BASE_URL;

export const marketingEquipmentPromotions = {
  getMarketingEquipmentByCollectionOperationAndType: async (params) => {
    return await axios.get(
      BASE_URL +
        `/marketing-equipment/equipment/drives?type=${params.type}&collection_operations=${params.collection_operations}`
    );
  },
  getPromotionsForOperationAdministration: async ({
    collectionOperationId,
    date,
    status = '',
  }) => {
    return await axios.get(
      BASE_URL +
        `/marketing-equipment/promotions/drives?collection_operation_id=${collectionOperationId}&date=${date}&status=${status}`
    );
  },
};
