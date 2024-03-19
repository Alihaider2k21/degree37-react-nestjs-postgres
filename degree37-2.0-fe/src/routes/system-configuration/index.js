import React from 'react';
import ListFacility from '../../pages/system-configuration/facilities-management/ListFacilities';
import CreateFacility from '../../pages/system-configuration/facilities-management/create/CreateFacility';
import FacilityEdit from '../../pages/system-configuration/facilities-management/edit/FacilityEdit';
import ListRole from '../../pages/system-configuration/platform-administration/roles-administration/ListRole';
import ListTenants from '../../pages/system-configuration/platform-administration/tenant-onboarding/tenants/ListTenants';
import CreateTenant from '../../pages/system-configuration/platform-administration/tenant-onboarding/tenants/create/CreateTenant';
import TenantEdit from '../../pages/system-configuration/platform-administration/tenant-onboarding/tenants/edit/TenantEdit';

import NotFoundPage from '../../pages/not-found/NotFoundPage';
import FacilityView from '../../pages/system-configuration/facilities-management/view/FacilityView';
import Reports from '../../pages/system-configuration/logs-events/Reports';
import EditPlatformAdminRoles from '../../pages/system-configuration/platform-administration/roles-administration/EditAdminRole';
import ViewRoleDetail from '../../pages/system-configuration/platform-administration/roles-administration/ViewRoleDetails';
import AddPlatformAdminRoles from '../../pages/system-configuration/platform-administration/roles-administration/addAdminRoles';
import CreateTenantConfigurations from '../../pages/system-configuration/platform-administration/tenant-onboarding/tenants/configuration/configuration';
import ViewTenant from '../../pages/system-configuration/platform-administration/tenant-onboarding/tenants/view/ViewTenant';

import AddEmail from '../../pages/system-configuration/tenants-administraion/organizational-administration/content-management-system/email-template/AddEmail';
import EditEmail from '../../pages/system-configuration/tenants-administraion/organizational-administration/content-management-system/email-template/EditEmail';
import ListEmail from '../../pages/system-configuration/tenants-administraion/organizational-administration/content-management-system/email-template/ListEmail';
import ViewEmail from '../../pages/system-configuration/tenants-administraion/organizational-administration/content-management-system/email-template/ViewEmail';
import ListBusinessUnits from '../../pages/system-configuration/tenants-administraion/organizational-administration/hierarchy/business-units/ListBusinessUnits';
import EditBusinessUnit from '../../pages/system-configuration/tenants-administraion/organizational-administration/hierarchy/business-units/edit/EditBusinessUnit';
import ViewBusinessUnit from '../../pages/system-configuration/tenants-administraion/organizational-administration/hierarchy/business-units/view/ViewBusinessUnit';
import ListOrganizationalLevels from '../../pages/system-configuration/tenants-administraion/organizational-administration/hierarchy/organizational-levels/ListOrganizationalLevels';
import CreateOrganizationalLevels from '../../pages/system-configuration/tenants-administraion/organizational-administration/hierarchy/organizational-levels/create/CreateOrganizationalLevels';
import EditOrganizationalLevels from '../../pages/system-configuration/tenants-administraion/organizational-administration/hierarchy/organizational-levels/edit/EditOrganizationalLevels';
import ViewOrganizationalLevels from '../../pages/system-configuration/tenants-administraion/organizational-administration/hierarchy/organizational-levels/view/ViewOrganizationalLevels';
import PasswordReset from '../../pages/system-configuration/users-administration/users/change-password/PasswordReset';
import CreateUser from '../../pages/system-configuration/users-administration/users/create/CreateUser';
import UserEdit from '../../pages/system-configuration/users-administration/users/edit/UserEdit';
import ListUsers from '../../pages/system-configuration/users-administration/users/view/ListUsers';
import ViewUser from '../../pages/system-configuration/users-administration/users/view/ViewUser';

import BookingRules from '../../pages/system-configuration/tenants-administraion/operations-administration/booking-drives/booking-rule/BookingRule';
import CreateBookingRules from '../../pages/system-configuration/tenants-administraion/operations-administration/booking-drives/booking-rule/CreateBookingRule';
import CreateDailyCapacity from '../../pages/system-configuration/tenants-administraion/operations-administration/booking-drives/daily-capacity/CreateDailyCapacity';
import DailyCapacity from '../../pages/system-configuration/tenants-administraion/operations-administration/booking-drives/daily-capacity/DailyCapacity';
import EditDailyCapacity from '../../pages/system-configuration/tenants-administraion/operations-administration/booking-drives/daily-capacity/EditDailyCapacity';
import CreateOperationsStatus from '../../pages/system-configuration/tenants-administraion/operations-administration/booking-drives/operations-status/CreateOperationsStatus';
import EditOperationStatus from '../../pages/system-configuration/tenants-administraion/operations-administration/booking-drives/operations-status/EditOperationStatus';
import ListOperationStatus from '../../pages/system-configuration/tenants-administraion/operations-administration/booking-drives/operations-status/ListOperationStatus';
import ViewOperationStatus from '../../pages/system-configuration/tenants-administraion/operations-administration/booking-drives/operations-status/ViewOperationStatus';
import CreateTeam from '../../pages/system-configuration/tenants-administraion/staffing-administration/teams/create/CreateTeam';
import TeamEdit from '../../pages/system-configuration/tenants-administraion/staffing-administration/teams/edit/TeamEdit';
import ListTeams from '../../pages/system-configuration/tenants-administraion/staffing-administration/teams/view/ListTeams';
import ViewTeam from '../../pages/system-configuration/tenants-administraion/staffing-administration/teams/view/ViewTeam';

import AssignMembersCreate from '../../pages/system-configuration/tenants-administraion/staffing-administration/teams/assign-members/assign/AssignMembers';
import ListAssignMembers from '../../pages/system-configuration/tenants-administraion/staffing-administration/teams/assign-members/view/ListAssignMembers';

import CreateDailyHour from '../../pages/system-configuration/tenants-administraion/operations-administration/booking-drives/daily-hour/CreateDailyHour';
import DailyHour from '../../pages/system-configuration/tenants-administraion/operations-administration/booking-drives/daily-hour/DailyCapacity';
import EditDailyHourPage from '../../pages/system-configuration/tenants-administraion/operations-administration/booking-drives/daily-hour/EditDailyCapacity';

import TasksCreate from '../../pages/tasks/TasksCreate';
import TasksEdit from '../../pages/tasks/TasksEdit';
import TasksList from '../../pages/tasks/TasksList';
import TasksView from '../../pages/tasks/TasksView';
import { SystemConfigurationTenantAdminRoutes } from './tenant-admin/index.js';
import { SystemConfigurationTenantAdministrationRoutes } from './tenant-administration/index.js';

export const SystemConfigurationRoutes = [
  // initial route of main path? : so it won't show blank screen, it will redirect to the not found
  {
    path: '',
    element: <NotFoundPage />,
  },
  // Tenant Admin
  {
    path: 'tenant-admin',
    children: SystemConfigurationTenantAdminRoutes,
  },
  // tenant administration
  {
    path: 'tenant-administration',
    children: SystemConfigurationTenantAdministrationRoutes,
  },
  {
    path: 'resource-management',
    children: [
      {
        path: '',
        element: <NotFoundPage />,
      },
      {
        path: 'facilities',
        children: [
          {
            path: '',
            element: <ListFacility />,
          },
          {
            path: 'create',
            element: <CreateFacility />,
          },
          {
            path: ':id',
            element: <FacilityEdit />,
          },
          {
            path: 'view',
            children: [
              {
                path: '',
                element: <NotFoundPage />,
              },
              {
                path: ':id',
                element: <FacilityView />,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: 'organizational-levels',
    children: [
      {
        path: '',
        element: <ListOrganizationalLevels />,
      },
      {
        path: 'create',
        element: <CreateOrganizationalLevels />,
      },
      {
        path: ':id',
        children: [
          {
            path: '',
            element: <ViewOrganizationalLevels />,
          },
          {
            path: 'edit',
            element: <EditOrganizationalLevels />,
          },
        ],
      },
    ],
  },
  {
    path: 'hierarchy',
    children: [
      {
        path: '',
        element: <NotFoundPage />,
      },
      {
        path: 'business-units',
        element: <ListBusinessUnits />,
      },
    ],
  },
  {
    path: 'business-unit',
    children: [
      {
        path: '',
        element: <NotFoundPage />,
      },
      {
        path: 'edit',
        children: [
          {
            path: '',
            element: <NotFoundPage />,
          },
          {
            path: ':id',
            element: <EditBusinessUnit />,
          },
        ],
      },
      {
        path: 'view',
        children: [
          {
            path: '',
            element: <NotFoundPage />,
          },
          {
            path: ':id',
            element: <ViewBusinessUnit />,
          },
        ],
      },
    ],
  },
  {
    path: 'platform-admin',
    children: [
      {
        path: 'email-template',
        children: [
          {
            path: '',
            element: <ListEmail />,
          },
          {
            path: 'create',
            element: <AddEmail />,
          },
          {
            path: 'view',
            children: [
              {
                path: '',
                element: <NotFoundPage />,
              },
              {
                path: ':id',
                element: <ViewEmail />,
              },
            ],
          },
          {
            path: 'edit',
            children: [
              {
                path: '',
                element: <NotFoundPage />,
              },
              {
                path: ':id',
                element: <EditEmail />,
              },
            ],
          },
        ],
      },
      {
        path: 'tenant-management',
        children: [
          {
            path: '',
            element: <ListTenants />,
          },
          {
            path: 'create',
            element: <CreateTenant />,
          },
          {
            path: ':id/edit',
            element: <TenantEdit />,
          },

          {
            path: ':tid/configuration',
            element: <CreateTenantConfigurations />,
          },

          {
            path: ':id/view',
            element: <ViewTenant />,
          },
        ],
      },
      {
        path: 'roles-admin',
        children: [
          {
            path: '',
            element: <ListRole />,
          },
          {
            path: ':id/view',
            element: <ViewRoleDetail />,
          },
        ],
      },
      {
        path: 'user-administration',
        children: [
          {
            path: '',
            element: <NotFoundPage />,
          },
          {
            path: 'users/create',
            element: <CreateUser />,
          },
          {
            path: 'users',
            element: <ListUsers />,
          },
          {
            path: 'users/:id/edit',
            element: <UserEdit />,
          },

          {
            path: 'users/:id/reset-password',
            element: <PasswordReset />,
          },

          {
            path: 'users/:id',
            element: <ViewUser />,
          },
        ],
      },
      {
        path: 'roles',
        children: [
          {
            path: '',
            element: <NotFoundPage />,
          },
          {
            path: 'create',
            element: <AddPlatformAdminRoles />,
          },
          {
            path: ':id/edit',
            element: <EditPlatformAdminRoles />,
          },
        ],
      },
    ],
  },
  // operations-admin
  {
    path: 'operations-admin',
    children: [
      {
        path: 'booking-drives/booking-rule',
        element: <BookingRules />,
      },
      {
        path: 'booking-drives/booking-rule/create',
        element: <CreateBookingRules />,
      },
      {
        path: 'booking-drives/daily-capacities',
        element: <DailyCapacity />,
      },
      {
        path: 'booking-drives/daily-capacities/create',
        element: <CreateDailyCapacity />,
      },
      {
        path: 'booking-drives/daily-capacities/:id',
        element: <EditDailyCapacity />,
      },
      {
        path: 'booking-drives/daily-capacities/:schedule/:id',
        element: <EditDailyCapacity />,
      },
      {
        path: 'booking-drives/daily-hours',
        element: <DailyHour />,
      },
      {
        path: 'booking-drives/daily-hours/create',
        element: <CreateDailyHour />,
      },
      {
        path: 'booking-drives/daily-hours/:id',
        element: <EditDailyHourPage />,
      },
      {
        path: 'booking-drives/daily-hours/:schedule/:id',
        element: <EditDailyHourPage />,
      },
      {
        path: 'booking-drives/operation-status/create',
        element: <CreateOperationsStatus />,
      },
      {
        path: 'booking-drives/operation-status',
        element: <ListOperationStatus />,
      },
      {
        path: 'booking-drives/operation-status/:id',
        element: <ViewOperationStatus />,
      },
      {
        path: 'booking-drives/operation-status/:id/edit',
        element: <EditOperationStatus />,
      },
    ],
  },
  // staffing admin
  {
    path: 'staffing-admin/teams',
    element: <ListTeams />,
  },
  {
    path: 'staffing-admin/teams/create',
    element: <CreateTeam />,
  },
  {
    path: 'staffing-admin/teams/:id/edit',
    element: <TeamEdit />,
  },
  {
    path: 'staffing-admin/teams/:id',
    element: <ViewTeam />,
  },
  {
    path: 'staffing-admin/teams/members',
    element: <ListAssignMembers />,
  },
  {
    path: 'staffing-admin/teams/assign-members',
    element: <AssignMembersCreate />,
  },
  {
    path: 'reports',
    element: <Reports />,
  },
  {
    path: 'tasks',
    element: <TasksList />,
  },
  {
    path: 'tasks/create',
    element: <TasksCreate />,
  },
  {
    path: 'tasks/:id/view',
    element: <TasksView />,
  },
  {
    path: 'tasks/:id/edit',
    element: <TasksEdit />,
  },
];
