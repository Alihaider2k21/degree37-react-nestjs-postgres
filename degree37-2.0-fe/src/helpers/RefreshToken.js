import { API } from '../../src/api/api-routes.js';

const refreshToken = async () => {
  const userName = localStorage?.getItem('user_name');
  if (userName) {
    const response = await API.auth.refreshToken(userName);
    const data = await response?.data;
    if (data?.token) {
      localStorage.setItem('token', data?.token);
    }
  }
};

const refreshTokenApi = (timestamp = null) => {
  const prevTime = localStorage.getItem('UTC_time');
  const shouldRefreshToken =
    !prevTime ||
    (timestamp && new Date(timestamp) - new Date(prevTime) >= 30000);
  if (shouldRefreshToken) {
    const currentUTCTime = timestamp || new Date().toISOString();
    localStorage.setItem('UTC_time', currentUTCTime);
    refreshToken();
  }
};

export default refreshTokenApi;
