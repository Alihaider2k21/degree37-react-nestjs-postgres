import { toast } from 'react-toastify';

export default function setupAxios(axios) {
  axios.interceptors.request.use(
    (config) => {
      config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
      return config;
    },
    (err) => Promise.reject(err)
  );
  axios.interceptors.response.use(
    (response) => {
      // we can include success intercepters here and can return the modified resposne for example;
      //   return {
      //     ...response.data,
      //     apiStatus: response.status,
      //   };
      return response;
    },
    function (error) {
      // error interceptors here
      const message = error.response?.data?.message;
      if (error.response) {
        if (error.response?.status === 401) {
          toast.error('Session Expired ! Please login again.');
          // handle logout here
        } else if (error.response?.status === 404) {
          // global 404 not found
        } else if (error.response?.status === 409) {
          // global conclick error
        } else {
          // 500
          toast.error(message || 'Something Went Wrong! Please try again');
        }
      }
      return Promise.reject(error);
    }
  );
}
