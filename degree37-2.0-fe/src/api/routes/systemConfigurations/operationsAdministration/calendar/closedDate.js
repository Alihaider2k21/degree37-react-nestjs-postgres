import axios from 'axios';
const BASE_URL = process.env.REACT_APP_BASE_URL;

export const closedDateCalendar = {
  getIsClosedDate: async ({ collectionOperationId, date }) => {
    return await axios.get(
      BASE_URL +
        `/close-dates/is_closed?collection_operation_id=${collectionOperationId}&date=${date}`
    );
  },
};
