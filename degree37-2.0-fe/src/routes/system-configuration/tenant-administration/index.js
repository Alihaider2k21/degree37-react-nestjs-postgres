import React from 'react';

import NotFoundPage from '../../../pages/not-found/NotFoundPage';

import CreateDailyGoalsAllocation from '../../../pages/system-configuration/tenants-administraion/organizational-administration/goals/daily-goals-allocation/CreateDailyGoalsAllocation';
import DailyGoalsAllocationList from '../../../pages/system-configuration/tenants-administraion/organizational-administration/goals/daily-goals-allocation/DailyGoalsAllocationList';
import EditDailyGoalsAllocation from '../../../pages/system-configuration/tenants-administraion/organizational-administration/goals/daily-goals-allocation/EditDailyGoalsAllocation';
import ViewDailyGoalsAllocation from '../../../pages/system-configuration/tenants-administraion/organizational-administration/goals/daily-goals-allocation/ViewDailyGoalsAllocation';
import DailyGoalsCalenderEdit from '../../../pages/system-configuration/tenants-administraion/organizational-administration/goals/daily-goals-calender/EditGoalsCalendar';
import DailyGoalsCalenderView from '../../../pages/system-configuration/tenants-administraion/organizational-administration/goals/daily-goals-calender/ViewGoalsCalender';
import CreateMonthlyGoal from '../../../pages/system-configuration/tenants-administraion/organizational-administration/goals/monthly-goals/CreateMonthlyGoal';
import EditMonthlyGoal from '../../../pages/system-configuration/tenants-administraion/organizational-administration/goals/monthly-goals/EditMonthlyGoal';
import MonthlyGoalsList from '../../../pages/system-configuration/tenants-administraion/organizational-administration/goals/monthly-goals/MonthlyGoalsList';
import ViewMonthlyGoal from '../../../pages/system-configuration/tenants-administraion/organizational-administration/goals/monthly-goals/ViewMonthlyGoal';
import EditGoalsPerformanceRules from '../../../pages/system-configuration/tenants-administraion/organizational-administration/goals/performance-rules/EditGoalsPerformanceRules';
import ViewGoalsPerformanceRules from '../../../pages/system-configuration/tenants-administraion/organizational-administration/goals/performance-rules/ViewGoalsPerformanceRules';
import CreateBusinessUnit from '../../../pages/system-configuration/tenants-administraion/organizational-administration/hierarchy/business-units/create/CreateBusinessUnit';

import TenantUserRolesEdit from '../../../pages/system-configuration/tenants-administraion/users-administration/user-roles/TenantUserRolesEdit';
import TenantUserRolesView from '../../../pages/system-configuration/tenants-administraion/users-administration/user-roles/TenantUserRolesView';
import UserRoleCreate from '../../../pages/system-configuration/tenants-administraion/users-administration/user-roles/UserRoleCreate';
import TenantUserRolesList from '../../../pages/system-configuration/tenants-administraion/users-administration/user-roles/UserRoleList';

export const SystemConfigurationTenantAdministrationRoutes = [
  {
    path: 'organizational-administration',
    children: [
      {
        path: '',
        element: <NotFoundPage />,
      },
      // Goals
      {
        path: 'goals',
        children: [
          // Monthly goals
          {
            path: 'monthly-goals',
            children: [
              {
                path: '',
                element: <MonthlyGoalsList />,
              },
              {
                path: 'create',
                element: <CreateMonthlyGoal />,
              },
              {
                path: ':id',
                children: [
                  {
                    path: '',
                    element: <NotFoundPage />,
                  },
                  {
                    path: 'view',
                    element: <ViewMonthlyGoal />,
                  },
                  {
                    path: 'edit',
                    element: <EditMonthlyGoal />,
                  },
                ],
              },
            ],
          },
          // Daily goals allocation
          {
            path: 'daily-goals-allocation',
            children: [
              {
                path: '',
                element: <DailyGoalsAllocationList />,
              },
              {
                path: 'create',
                element: <CreateDailyGoalsAllocation />,
              },
              {
                path: ':id',
                children: [
                  {
                    path: '',
                    element: <NotFoundPage />,
                  },
                  {
                    path: 'view',
                    element: <ViewDailyGoalsAllocation />,
                  },
                  {
                    path: 'edit',
                    element: <EditDailyGoalsAllocation />,
                  },
                ],
              },
            ],
          },
          // Daily goals calendar view
          {
            path: 'daily-goals-calendar',
            children: [
              {
                path: '',
                element: <NotFoundPage />,
              },
              {
                path: 'view',
                element: <DailyGoalsCalenderView />,
              },
            ],
          },
          // Daily goals calendar edit
          {
            path: 'daily-goals-calendar',
            children: [
              {
                path: '',
                element: <NotFoundPage />,
              },
              {
                path: 'edit',
                element: <DailyGoalsCalenderEdit />,
              },
            ],
          },
          // Performance Rules View
          {
            path: 'performance-rules',
            children: [
              {
                path: '',
                element: <NotFoundPage />,
              },
              {
                path: 'view',
                element: <ViewGoalsPerformanceRules />,
              },
            ],
          },
          // Performance Rules Edit
          {
            path: 'performance-rules',
            children: [
              {
                path: '',
                element: <NotFoundPage />,
              },
              {
                path: 'edit',
                element: <EditGoalsPerformanceRules />,
              },
            ],
          },
        ],
      },
      // hierarchy
      {
        path: 'hierarchy',
        children: [
          {
            path: '',
            element: <NotFoundPage />,
          },
          {
            path: 'business-units',
            children: [
              {
                path: '',
                element: <NotFoundPage />,
              },
              {
                path: 'create',
                element: <CreateBusinessUnit />,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: 'users-administration',
    children: [
      {
        path: 'user-roles/create',
        element: <UserRoleCreate />,
      },
      {
        path: 'user-roles/:id/edit',
        element: <TenantUserRolesEdit />,
      },
      {
        path: 'user-roles/:id/view',
        element: <TenantUserRolesView />,
      },
      {
        path: 'user-roles',
        element: <TenantUserRolesList />,
      },
    ],
  },
];
