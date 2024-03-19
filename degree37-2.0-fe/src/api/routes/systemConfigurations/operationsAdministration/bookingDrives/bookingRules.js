import axios from 'axios';
const BASE_URL = process.env.REACT_APP_BASE_URL;

export const bookingRulesBookingDrive = {
  getBookingRules: async () => {
    return await axios.get(BASE_URL + `/booking-drive/booking-rule/{id}`);
  },
};
