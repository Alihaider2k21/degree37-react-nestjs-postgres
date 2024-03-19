import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './pages/App';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './components/common/context/AuthContext';
import axios from 'axios';
import setupAxios from './api/setupAxios.js';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import refreshTokenApi from './helpers/RefreshToken';
axios.interceptors.response.use(
  (res) => {
    // Add configurations here
    refreshTokenApi(res?.data?.timestamp);
    return res;
  },
  (err) => {
    return Promise.reject(err);
  }
);
const root = ReactDOM.createRoot(document.getElementById('root'));
setupAxios(axios);
root.render(
  // <React.StrictMode>
  <AuthProvider>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <App />
    </LocalizationProvider>
  </AuthProvider>
  // </React.StrictMode>
);
