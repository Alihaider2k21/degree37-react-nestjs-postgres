import axios from 'axios';
const BASE_URL = process.env.REACT_APP_BASE_URL;

export const marketingEquipmentMarketingMaterials = {
  getMarketingEquipmentMarketingMaterialsByCollectionOperation: async (
    params
  ) => {
    return await axios.get(
      BASE_URL +
        `/marketing-equipment/marketing-material/drives/byCollectionOperation?collectionOperationId=${params.collection_operations}`
    );
  },
};
