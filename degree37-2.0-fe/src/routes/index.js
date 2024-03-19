import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import TenantDashboard from '../components/dashboard/tenant-dashboard';
import Login from '../pages/authentication/login/Login.jsx';
import { Signup } from '../pages/authentication/signup/Signup.jsx';
import { Dashboard } from '../pages/dashboard/Dashboard';
import NotFoundPage from '../pages/not-found/NotFoundPage';
import { SystemConfigurationRoutes } from './system-configuration/index.js';

export const ReactRoutes = (isAuthenticated) => [
  { path: '*', element: <NotFoundPage /> },
  { path: 'not-found', element: <NotFoundPage /> },
  // If user is not authenticated, then we will use these routes
  {
    path: '/',
    element: !isAuthenticated ? <Outlet /> : <Navigate to="/dashboard" />,
    children: [
      { path: '', element: <Navigate to="/login" /> },
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <Signup /> },
    ],
  },
  // if user is authenticated then we will use these routes
  {
    path: '/',
    element: isAuthenticated ? <Outlet /> : <Navigate to="/login" />,
    children: [
      { path: '', element: <Navigate to="/dashboard" /> },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'tenant-dashboard',
        element: <TenantDashboard />,
      },
      {
        path: 'system-configuration',
        element: <Outlet />,
        children: SystemConfigurationRoutes,
      },
    ],
  },
];
