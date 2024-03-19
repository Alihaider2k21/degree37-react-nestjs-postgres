import axios from 'axios';
const BASE_URL = process.env.REACT_APP_BASE_URL;

export const operationStatusBookingDrive = {
  getOperationStatus: async (appliesTo = 'Sessions') => {
    return await axios.get(
      BASE_URL + `/booking-drive/operation-status?appliesTo=${appliesTo}`
    );
  },
};