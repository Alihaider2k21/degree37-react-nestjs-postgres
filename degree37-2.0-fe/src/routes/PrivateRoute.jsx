import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export const PrivateRoute = ({ path, ...rest }) => {
  let auth = null;
  if (localStorage.getItem('token')) {
    auth = true;
  }

  return auth ? <Outlet /> : <Navigate to="/login" />;
};
