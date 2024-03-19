/* eslint-disable */

import '@fortawesome/fontawesome-svg-core/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect } from 'react';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigationType,
  createRoutesFromChildren,
  matchRoutes,
} from 'react-router-dom';
import * as Sentry from '@sentry/react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import TenantDashboard from '../components/dashboard/tenant-dashboard';
import '../styles/Global/Global.scss';
import '../styles/Global/Variable.scss';
import '../styles/index.css';
import CrmDashboard from './dashboard/CrmDashboard';
import { Dashboard } from './dashboard/Dashboard';

import ListFacility from './system-configuration/facilities-management/ListFacilities';
import CreateFacility from './system-configuration/facilities-management/create/CreateFacility';
import FacilityEdit from './system-configuration/facilities-management/edit/FacilityEdit';
import ListRole from './system-configuration/platform-administration/roles-administration/ListRole';
import ListUsersRoles from './system-configuration/platform-administration/roles-administration/ListUsersRoles';
import CreateUserRoles from './system-configuration/platform-administration/roles-administration/create/CreateUserRoles';
import ListTenants from './system-configuration/platform-administration/tenant-onboarding/tenants/ListTenants';
import CreateTenant from './system-configuration/platform-administration/tenant-onboarding/tenants/create/CreateTenant';
import TenantEdit from './system-configuration/platform-administration/tenant-onboarding/tenants/edit/TenantEdit';
import ListProcedureTypes from './system-configuration/tenants-administraion/organizational-administration/products-procedures/procedure-types/ListProceduresTypes';
import CreateProcedureTypes from './system-configuration/tenants-administraion/organizational-administration/products-procedures/procedure-types/create/CreateProcedureTypes';
import ViewProcedureTypes from './system-configuration/tenants-administraion/organizational-administration/products-procedures/procedure-types/view/ViewProcedureTypes';
import ListProducts from './system-configuration/tenants-administraion/organizational-administration/products-procedures/products/ListProducts';
import CreateProfile from './crm/non-collection-profiles/profiles/CreateProfile';
import ListProfile from './crm/non-collection-profiles/profiles/ListProfile';

import { PrivateRoute } from '../routes/PrivateRoute.jsx'; // Update the import path
import { Login, Signup } from './authentication/index.js';
import NotFoundPage from './not-found/NotFoundPage';
// import Home from "./home/Home.jsx";
import FacilityView from '../pages/system-configuration/facilities-management/view/FacilityView';
import AddPlatformAdminRoles from '../pages/system-configuration/platform-administration/roles-administration/addAdminRoles';
import CreateTenantConfigurations from '../pages/system-configuration/platform-administration/tenant-onboarding/tenants/configuration/configuration';
import ViewTenant from '../pages/system-configuration/platform-administration/tenant-onboarding/tenants/view/ViewTenant';
import ListBanners from '../pages/system-configuration/tenants-administraion/operations-administration/calendar/banners/ListBanners';
import ViewBanner from '../pages/system-configuration/tenants-administraion/operations-administration/calendar/banners/ViewBanner';
import ListProcedures from '../pages/system-configuration/tenants-administraion/organizational-administration/products-procedures/procedures/ListProcedures';
import CreateProcedures from '../pages/system-configuration/tenants-administraion/organizational-administration/products-procedures/procedures/create/CreateProcedures';
import ViewProcedure from '../pages/system-configuration/tenants-administraion/organizational-administration/products-procedures/procedures/view/ViewProcedure';
import CreateDevice from '../pages/system-configuration/tenants-administraion/organizational-administration/resources/device/CreateDevice';
import EditDevice from '../pages/system-configuration/tenants-administraion/organizational-administration/resources/device/EditDevice';
import ListDevices from '../pages/system-configuration/tenants-administraion/organizational-administration/resources/device/ListDevices';
import ListVehicleTypes from '../pages/system-configuration/tenants-administraion/organizational-administration/resources/vehicle-type/ListVehicleTypes';
import ViewVehicleType from '../pages/system-configuration/tenants-administraion/organizational-administration/resources/vehicle-type/ViewVehicleType';
import ListVehicle from '../pages/system-configuration/tenants-administraion/organizational-administration/resources/vehicle/ListVehicle';
import ViewVehicle from '../pages/system-configuration/tenants-administraion/organizational-administration/resources/vehicle/ViewVehicle';
import NonCollectionEventList from './operations-center/operations/NEC/NonCollectionEventList';
import NonCollectionEventView from './operations-center/operations/NEC/NonCollectionEventView';
import NonCollectionEventShiftDetails from './operations-center/operations/NEC/NonCollectionEventShiftDetails';
import NonCollectionEventCreate from './operations-center/operations/NEC/NonCollectionEventCreate';
import NonCollectionEventEdit from './operations-center/operations/NEC/NonCollectionEventEdit';
import SessionShiftDetails from './operations-center/operations/sessions/SessionShiftDetails.jsx';
import ViewShiftDetailsAccount from './crm/accounts/blueprint/view/ViewShiftDetails.jsx';
import ViewAboutBlueprintAccount from './crm/accounts/blueprint/view/ViewAboutDetail.jsx';
import {
  BUSINESS_UNIT_PATH,
  CLASSIFICATIONS_PATH,
  DAILY_GOALS_ALLOCATION_PATH,
  FACILITIES_PATH,
  GOALS_PERFORMANCE_RULES,
  MONTHLY_GOALS_PATH,
  TEAMS_PATH,
  USER_ROLES,
  SETTINGS_CLASSIFICATIONS_PATH,
  TEAMS_ASSIGN_MEMBERS,
  STAFF_SETUP,
  DAILY_GOALS_CALENDAR,
  CRM_DONORS_CENTERS,
  ACCOUNT_TASKS_PATH,
  LOCATIONS_TASKS_PATH,
  DONOR_TASKS_PATH,
  DONOR_DONATION_HISTORY_PATH,
  STAFF_TASKS_PATH,
  DONOR_CENTERS_TASKS_PATH,
  CRM_VOLUNTEER_TASKS_PATH,
  CRM_NON_COLLECTION_PROFILES_TASKS_PATH,
  SESSION_TASKS_PATH,
  CRM_NON_COLLECTION_PROFILES_PATH,
  DRIVES_TASKS_PATH,
  DRIVES_STAFFING_PATH,
  OPERATIONS_CENTER_DRIVES_PATH,
  OPERATIONS_CENTER_DRIVES_DONOR_SCHEDULES,
  OPERATIONS_CENTER_SESSIONS_PATH,
  OPERATIONS_CENTER_APPROVALS_PATH,
  OPERATIONS_CENTER_CALENDAR_PATH,
  CRM_NON_COLLECTION_PROFILES_BLUEPRINTS_PATH,
  OPERATIONS_CENTER_NON_COLLECTION_EVENTS_TASKS,
  OPERATIONS_CENTER_NON_COLLECTION_EVENTS_STAFFING,
  OPERATIONS_CENTER_DRIVES_DOCUMENT_ATTACHMENT_PATH,
  OPERATIONS_CENTER_DRIVES_DOCUMENT_NOTE_PATH,
  OPERATIONS_CENTER_SESSIONS_DOCUMENT_NOTE_PATH,
  OPERATIONS_CENTER_SESSIONS_DOCUMENT_ATTACHMENT_PATH,
  OPERATIONS_CENTER_NCE_DOCUMENT_NOTE_PATH,
  OPERATIONS_CENTER_NCE_DOCUMENT_ATTACHMENT_PATH,
  OPERATIONS_CENTER_MANAGE_FAVORITES_PATH,
  OPERATIONS_CENTER_NCE,
  OPERATIONS_CENTER,
  CRM_NON_COLLECTION_PROFILES_EVENT_HISTORY_PATH,
  DONOR_CENTERS_SESSION_HISTORY_PATH,
  CRM_STAFF_SCHEDULE_PATH,
  CRM_DONOR_SCHEDULE_PATH,
  OPERATIONS_CENTER_NCE_CHANGE_AUDIT_PATH,
  OPERATIONS_CENTER_SESSIONS_CHANGE_AUDIT_PATH,
  SESSION_STAFFING_PATH,
  OS_PROSPECTS_PATH,
  CRM_ACCOUNT_BLUEPRINT_PATH,
  DRIVES_CHANGE_AUDIT_PATH,
  STAFFING_MANAGEMENT_STAFF_LIST,
  OPERATIONS_CENTER_RESOURCE_SHARING,
  STAFFING_MANAGEMENT_VIEW_SCHEDULE,
  STAFFING_MANAGEMENT_BUILD_SCHEDULE,
  SYSTEM_CONFIGURATION,
} from '../routes/path';
import Reports from './system-configuration/logs-events/Reports';
import EditPlatformAdminRoles from './system-configuration/platform-administration/roles-administration/EditAdminRole';
import ViewRoleDetail from './system-configuration/platform-administration/roles-administration/ViewRoleDetails';
import StagingList from './system-configuration/tenants-administraion/crm-admin/accounts/stage/StageList';
import CreateStage from './system-configuration/tenants-administraion/crm-admin/accounts/stage/create/CreateStage';
import CreateAffiliation from './system-configuration/tenants-administraion/crm-administration/account/affiliations/create/CreateAffiliation';
import AffiiliationEdit from './system-configuration/tenants-administraion/crm-administration/account/affiliations/edit/AffiliationEdit';
import ListAffiliations from './system-configuration/tenants-administraion/crm-administration/account/affiliations/view/ListAffiliations';
import ViewAffiliations from './system-configuration/tenants-administraion/crm-administration/account/affiliations/view/ViewAffiliations';
import ListIndustryCategories from './system-configuration/tenants-administraion/crm-administration/account/industry-categories/ListIndustryCategories';
import CreateIndustryCategories from './system-configuration/tenants-administraion/crm-administration/account/industry-categories/create/CreateIndustryCategories';
import EditIndustryCategories from './system-configuration/tenants-administraion/crm-administration/account/industry-categories/edit/EditIndustryCategories';
import ViewIndustryCategories from './system-configuration/tenants-administraion/crm-administration/account/industry-categories/view/ViewIndustryCategories';
import ListIndustrySubCategories from './system-configuration/tenants-administraion/crm-administration/account/industry-subcategories/ListIndustryCategories';
import CreateIndustrySubCategories from './system-configuration/tenants-administraion/crm-administration/account/industry-subcategories/create/CreateIndustryCategories';
import EditIndustrySubCategories from './system-configuration/tenants-administraion/crm-administration/account/industry-subcategories/edit/EditIndustryCategories';
import ViewIndustrySubCategories from './system-configuration/tenants-administraion/crm-administration/account/industry-subcategories/view/ViewIndustryCategories';
import AccountNoteCategoryList from './system-configuration/tenants-administraion/crm-administration/account/note-category/NoteCategoryList';
import AccountAddNoteCategory from './system-configuration/tenants-administraion/crm-administration/account/note-category/create/CreateNoteCategory';
import AccountEditNoteCategory from './system-configuration/tenants-administraion/crm-administration/account/note-category/edit/EditNoteCategory';
import AccountViewNoteCategory from './system-configuration/tenants-administraion/crm-administration/account/note-category/view/ViewNoteCategory';
import AccountNoteSubCategoryList from './system-configuration/tenants-administraion/crm-administration/account/note-subcategory/NoteSubCategoryList';
import AccountCreateNoteSubCategory from './system-configuration/tenants-administraion/crm-administration/account/note-subcategory/create/CreateNoteSubCategory';
import AccountEditNoteSubCategory from './system-configuration/tenants-administraion/crm-administration/account/note-subcategory/edit/EditNoteSubCategory';
import AccountViewNoteSubCategory from './system-configuration/tenants-administraion/crm-administration/account/note-subcategory/view/ViewNoteSubCategory';
import CreateAttachmentCategory from './system-configuration/tenants-administraion/crm-administration/contact/attachment-categories/CreateAttachmentCategory';
import ListAttachmentCategory from './system-configuration/tenants-administraion/crm-administration/contact/attachment-categories/ListAttachmentCategory';
import ViewAttachmentCategory from './system-configuration/tenants-administraion/crm-administration/contact/attachment-categories/ViewAttachmentCategory';
import CreateAttachmentSubCategory from './system-configuration/tenants-administraion/crm-administration/contact/attachment-subcategories/CreateAttachmentSubCategory';
import ListAttachmentSubCategory from './system-configuration/tenants-administraion/crm-administration/contact/attachment-subcategories/ListAttachmentSubCategory';
import ViewAttachmentSubCategory from './system-configuration/tenants-administraion/crm-administration/contact/attachment-subcategories/ViewAttachmentSubCategory';

import ContactRoleCreate from './system-configuration/tenants-administraion/crm-administration/contact/roles/ContactRoleCreate';
import ContactRoleList from './system-configuration/tenants-administraion/crm-administration/contact/roles/ContactRoleList';
import ContactRoleUpdate from './system-configuration/tenants-administraion/crm-administration/contact/roles/ContactRoleUpdate';
import ContactRoleView from './system-configuration/tenants-administraion/crm-administration/contact/roles/ContactRoleView';
import ListTerritoryManagement from './system-configuration/tenants-administraion/geo-administration/territory-management/ListTerritoryManagement';
import CreateTerritory from './system-configuration/tenants-administraion/geo-administration/territory-management/create/CreateTerritory';
import TerritoryEdit from './system-configuration/tenants-administraion/geo-administration/territory-management/edit/TerritoryEdit';
import TerritoryView from './system-configuration/tenants-administraion/geo-administration/territory-management/view/TerritoryView';
import CreateBanner from './system-configuration/tenants-administraion/operations-administration/calendar/banners/CreateBanner';
import EditBanner from './system-configuration/tenants-administraion/operations-administration/calendar/banners/EditBanner';
import CreateAds from './system-configuration/tenants-administraion/organizational-administration/content-management-system/ads/CreateAds';
import EditAds from './system-configuration/tenants-administraion/organizational-administration/content-management-system/ads/EditAds';
import ListAds from './system-configuration/tenants-administraion/organizational-administration/content-management-system/ads/ListAds';
import ViewAds from './system-configuration/tenants-administraion/organizational-administration/content-management-system/ads/ViewAds';
import AddEmail from './system-configuration/tenants-administraion/organizational-administration/content-management-system/email-template/AddEmail';
import EditEmail from './system-configuration/tenants-administraion/organizational-administration/content-management-system/email-template/EditEmail';
import ListEmail from './system-configuration/tenants-administraion/organizational-administration/content-management-system/email-template/ListEmail';
import ViewEmail from './system-configuration/tenants-administraion/organizational-administration/content-management-system/email-template/ViewEmail';
import CreateDailyGoalsAllocation from './system-configuration/tenants-administraion/organizational-administration/goals/daily-goals-allocation/CreateDailyGoalsAllocation';
import DailyGoalsAllocationList from './system-configuration/tenants-administraion/organizational-administration/goals/daily-goals-allocation/DailyGoalsAllocationList';
import EditDailyGoalsAllocation from './system-configuration/tenants-administraion/organizational-administration/goals/daily-goals-allocation/EditDailyGoalsAllocation';
import ViewDailyGoalsAllocation from './system-configuration/tenants-administraion/organizational-administration/goals/daily-goals-allocation/ViewDailyGoalsAllocation';
import DailyGoalsCalenderEdit from './system-configuration/tenants-administraion/organizational-administration/goals/daily-goals-calender/EditGoalsCalendar';
import DailyGoalsCalenderView from './system-configuration/tenants-administraion/organizational-administration/goals/daily-goals-calender/ViewGoalsCalender';
import CreateMonthlyGoal from './system-configuration/tenants-administraion/organizational-administration/goals/monthly-goals/CreateMonthlyGoal';
import EditMonthlyGoal from './system-configuration/tenants-administraion/organizational-administration/goals/monthly-goals/EditMonthlyGoal';
import MonthlyGoalsList from './system-configuration/tenants-administraion/organizational-administration/goals/monthly-goals/MonthlyGoalsList';
import ViewMonthlyGoal from './system-configuration/tenants-administraion/organizational-administration/goals/monthly-goals/ViewMonthlyGoal';
import EditGoalsPerformanceRules from './system-configuration/tenants-administraion/organizational-administration/goals/performance-rules/EditGoalsPerformanceRules';
import ViewGoalsPerformanceRules from './system-configuration/tenants-administraion/organizational-administration/goals/performance-rules/ViewGoalsPerformanceRules';
import ListBusinessUnits from './system-configuration/tenants-administraion/organizational-administration/hierarchy/business-units/ListBusinessUnits';
import CreateBusinessUnit from './system-configuration/tenants-administraion/organizational-administration/hierarchy/business-units/create/CreateBusinessUnit';
import EditBusinessUnit from './system-configuration/tenants-administraion/organizational-administration/hierarchy/business-units/edit/EditBusinessUnit';
import ViewBusinessUnit from './system-configuration/tenants-administraion/organizational-administration/hierarchy/business-units/view/ViewBusinessUnit';
import ListOrganizationalLevels from './system-configuration/tenants-administraion/organizational-administration/hierarchy/organizational-levels/ListOrganizationalLevels';
import CreateOrganizationalLevels from './system-configuration/tenants-administraion/organizational-administration/hierarchy/organizational-levels/create/CreateOrganizationalLevels';
import EditOrganizationalLevels from './system-configuration/tenants-administraion/organizational-administration/hierarchy/organizational-levels/edit/EditOrganizationalLevels';
import ViewOrganizationalLevels from './system-configuration/tenants-administraion/organizational-administration/hierarchy/organizational-levels/view/ViewOrganizationalLevels';
import EditProcedureTypes from './system-configuration/tenants-administraion/organizational-administration/products-procedures/procedure-types/edit/EditProcedureTypes';
import EditProcedures from './system-configuration/tenants-administraion/organizational-administration/products-procedures/procedures/Edit/EditProcedures';
import CreateDeviceType from './system-configuration/tenants-administraion/organizational-administration/resources/device-types/CreateDeviceType';
import { DeviceTypeList } from './system-configuration/tenants-administraion/organizational-administration/resources/device-types/DeviceTypeList';
import { DeviceTypeView } from './system-configuration/tenants-administraion/organizational-administration/resources/device-types/DeviceTypeView';
import UpdateDeviceType from './system-configuration/tenants-administraion/organizational-administration/resources/device-types/UpdateDeviceType';
import ListDeviceMaintenance from './system-configuration/tenants-administraion/organizational-administration/resources/device/ListDeviceMaintenance';
import ListDeviceShare from './system-configuration/tenants-administraion/organizational-administration/resources/device/ListDeviceShare';
import ScheduleDeviceMaintenance from './system-configuration/tenants-administraion/organizational-administration/resources/device/ScheduleDeviceMaintenance';
import ScheduleDeviceReitrement from './system-configuration/tenants-administraion/organizational-administration/resources/device/ScheduleDeviceRetirement';
import ShareDevice from './system-configuration/tenants-administraion/organizational-administration/resources/device/ShareDevice';
import ViewDevice from './system-configuration/tenants-administraion/organizational-administration/resources/device/ViewDevice';
import CreateVehicleType from './system-configuration/tenants-administraion/organizational-administration/resources/vehicle-type/CreateVehicleType';
import EditVehicleType from './system-configuration/tenants-administraion/organizational-administration/resources/vehicle-type/EditVehicleType';
import CreateVehicle from './system-configuration/tenants-administraion/organizational-administration/resources/vehicle/CreateVehicle';
import EditVehicle from './system-configuration/tenants-administraion/organizational-administration/resources/vehicle/EditVehicle';
import ListVehicleMaintenance from './system-configuration/tenants-administraion/organizational-administration/resources/vehicle/ListVehicleMaintenance';
import ListVehicleShare from './system-configuration/tenants-administraion/organizational-administration/resources/vehicle/ListVehicleShare';
import ScheduleVehicleMaintenance from './system-configuration/tenants-administraion/organizational-administration/resources/vehicle/ScheduleVehicleMaintenance';
import ScheduleVehicleRetirement from './system-configuration/tenants-administraion/organizational-administration/resources/vehicle/ScheduleVehicleRetirement';
import ShareVehicle from './system-configuration/tenants-administraion/organizational-administration/resources/vehicle/ShareVehicle';
import PasswordReset from './system-configuration/users-administration/users/change-password/PasswordReset';
import CreateUser from './system-configuration/users-administration/users/create/CreateUser';
import UserEdit from './system-configuration/users-administration/users/edit/UserEdit';
import ListUsers from './system-configuration/users-administration/users/view/ListUsers';
import ViewUser from './system-configuration/users-administration/users/view/ViewUser';

/* room sizes */
import ListAllRooms from './system-configuration/tenants-administraion/crm-administration/locations/room-sizes/ListAllRooms';
import ViewRoomDetail from './system-configuration/tenants-administraion/crm-administration/locations/room-sizes/ViewRoomDetail';
import CreateUpdateRoomSize from './system-configuration/tenants-administraion/crm-administration/locations/room-sizes/CreateUpdateRoomSize';
import CreateTeam from './system-configuration/tenants-administraion/staffing-administration/teams/create/CreateTeam';
import CreateLockDate from './system-configuration/tenants-administraion/operations-administration/calendar/lock-dates/CreateLockDate';
import EditLockDate from './system-configuration/tenants-administraion/operations-administration/calendar/lock-dates/EditLockDate';
import ListLockDates from '../pages/system-configuration/tenants-administraion/operations-administration/calendar/lock-dates/ListLockDate';
import ViewLockDate from '../pages/system-configuration/tenants-administraion/operations-administration/calendar/lock-dates/ViewLockDate';
import CreateOperationsStatus from './system-configuration/tenants-administraion/operations-administration/booking-drives/operations-status/CreateOperationsStatus';
import BookingRules from './system-configuration/tenants-administraion/operations-administration/booking-drives/booking-rule/BookingRule';
import DailyCapacity from './system-configuration/tenants-administraion/operations-administration/booking-drives/daily-capacity/DailyCapacity';
import CreateDailyCapacity from './system-configuration/tenants-administraion/operations-administration/booking-drives/daily-capacity/CreateDailyCapacity';
import EditDailyCapacity from './system-configuration/tenants-administraion/operations-administration/booking-drives/daily-capacity/EditDailyCapacity';
import CreateBookingRules from './system-configuration/tenants-administraion/operations-administration/booking-drives/booking-rule/CreateBookingRule';
import View from './system-configuration/tenants-administraion/crm-admin/view/View';
import CreateClassification from './system-configuration/tenants-administraion/staffing-administration/classifications/create/CreateClassification';
import ListOperationStatus from './system-configuration/tenants-administraion/operations-administration/booking-drives/operations-status/ListOperationStatus';
import LeaveType from './system-configuration/tenants-administraion/staffing-administration/leave-types/LeaveType';
import ListSource from './system-configuration/tenants-administraion/crm-administration/account/sources/index';
import AddSource from './system-configuration/tenants-administraion/crm-administration/account/sources/create/CreateSource';
import ViewSource from './system-configuration/tenants-administraion/crm-administration/account/sources/view/ViewSource';
import EditSource from './system-configuration/tenants-administraion/crm-administration/account/sources/edit/EditSource';
import ViewOperationStatus from './system-configuration/tenants-administraion/operations-administration/booking-drives/operations-status/ViewOperationStatus';
import UserRoleCreate from './system-configuration/tenants-administraion/users-administration/user-roles/UserRoleCreate';
import TenantUserRolesList from './system-configuration/tenants-administraion/users-administration/user-roles/UserRoleList';
import TenantUserRolesView from './system-configuration/tenants-administraion/users-administration/user-roles/TenantUserRolesView';
import ListTeams from './system-configuration/tenants-administraion/staffing-administration/teams/view/ListTeams';
import ViewTeam from './system-configuration/tenants-administraion/staffing-administration/teams/view/ViewTeam';
import TeamEdit from './system-configuration/tenants-administraion/staffing-administration/teams/edit/TeamEdit';
import ListClassifications from './system-configuration/tenants-administraion/staffing-administration/classifications/ListClassifications';
import ViewClassification from './system-configuration/tenants-administraion/staffing-administration/classifications/create/view/ViewClassification';
import EditOperationStatus from './system-configuration/tenants-administraion/operations-administration/booking-drives/operations-status/EditOperationStatus';
import EditClassification from './system-configuration/tenants-administraion/staffing-administration/classifications/edit/ClassificationEdit';
import NotesAttachmentCreateNoteCategory from './system-configuration/tenants-administraion/operations-administration/notes-attachment/note-category/create/CreateNoteCategory';
import NotesAttachmentNoteCategoryList from './system-configuration/tenants-administraion/operations-administration/notes-attachment/note-category/NoteCategoryList';
import NotesAttachmentViewNoteCategory from './system-configuration/tenants-administraion/operations-administration/notes-attachment/note-category/view/ViewNoteCategory';
import NotesAttachmentEditNoteCategory from './system-configuration/tenants-administraion/operations-administration/notes-attachment/note-category/edit/EditNoteCategory';
import NotesAttachmentCreateNoteSubCategory from './system-configuration/tenants-administraion/operations-administration/notes-attachment/note-subcategory/create/CreateNoteSubCategory';
import NotesAttachmentNoteSubCategoryList from './system-configuration/tenants-administraion/operations-administration/notes-attachment/note-subcategory/NoteSubCategoryList';
import NotesAttachmentViewNoteSubCategory from './system-configuration/tenants-administraion/operations-administration/notes-attachment/note-subcategory/view/ViewNoteSubCategory';
import NotesAttachmentEditNoteSubCategory from './system-configuration/tenants-administraion/operations-administration/notes-attachment/note-subcategory/edit/EditNoteSubCategory';
import EditOrCreateLeave from '../pages/system-configuration/tenants-administraion/staffing-administration/leave-types/EditOrCreateLeave';
import AccountsCreateAttachmentCategory from './system-configuration/tenants-administraion/crm-administration/account/attachment-categories/CreateAttachmentCategory';
import AccountsListAttachmentCategory from './system-configuration/tenants-administraion/crm-administration/account/attachment-categories/ListAttachmentCategory';
import AccountsViewAttachmentCategory from './system-configuration/tenants-administraion/crm-administration/account/attachment-categories/ViewAttachmentCategory';
import AccountsEditAttachmentCategory from './system-configuration/tenants-administraion/crm-administration/account/attachment-categories/EditAttachmentCategory';
import CreateCertification from './system-configuration/tenants-administraion/staffing-administration/certifications/CreateCertification';
import ListCertification from './system-configuration/tenants-administraion/staffing-administration/certifications/ListCertification';
import ViewCertification from './system-configuration/tenants-administraion/staffing-administration/certifications/ViewCertification';
import EditCertification from './system-configuration/tenants-administraion/staffing-administration/certifications/EditCertification';
import AssignCertification from './system-configuration/tenants-administraion/staffing-administration/certifications/AssignCertification';
import AssignedCertification from './system-configuration/tenants-administraion/staffing-administration/certifications/AssignedCertification';
import CreateMarketingMaterial from './system-configuration/tenants-administraion/operations-administration/marketing-equipment/marketing-material/CreateMarketingMaterial';
import ViewGoalVariance from './system-configuration/tenants-administraion/operations-administration/calendar/goal-variance/ViewGoalVariance';
import CreateGoalVariance from './system-configuration/tenants-administraion/operations-administration/calendar/goal-variance/CreateGoalVariance';
import EditGoalVariance from './system-configuration/tenants-administraion/operations-administration/calendar/goal-variance/EditGoalVariance';
import CreateUsers from './system-configuration/tenants-administraion/users-administration/users/CreateUser';
import EditUsers from './system-configuration/tenants-administraion/users-administration/users/EditUser';
import UsersLists from './system-configuration/tenants-administraion/users-administration/users/UsersList';
import ViewSingleUser from './system-configuration/tenants-administraion/users-administration/users/ViewSingleUser';
import ResetUserPassword from './system-configuration/tenants-administraion/users-administration/users/ResetPassword';
import ListMarketingMaterial from './system-configuration/tenants-administraion/operations-administration/marketing-equipment/marketing-material/ListMarketingMaterial';
import CreateAttachment from './system-configuration/tenants-administraion/crm-administration/location-attachment-categories/CreateCategory';
import TenantUserRolesEdit from './system-configuration/tenants-administraion/users-administration/user-roles/TenantUserRolesEdit';
import EditMarketingMaterial from './system-configuration/tenants-administraion/operations-administration/marketing-equipment/marketing-material/EditMarketingMaterial';
import ViewMarketingMaterial from './system-configuration/tenants-administraion/operations-administration/marketing-equipment/marketing-material/ViewMarketingMaterial';
import CreateNceCategory from './system-configuration/tenants-administraion/operations-administration/non-collection-events/nce-category/create/CreateNceCategory';
import NceCategoryList from './system-configuration/tenants-administraion/operations-administration/non-collection-events/nce-category/NceCategoryList';
import NceCategory from './system-configuration/tenants-administraion/operations-administration/non-collection-events/nce-category/view/ViewNceCategory';
import EditNceCategory from './system-configuration/tenants-administraion/operations-administration/non-collection-events/nce-category/edit/EditNceCategory';
import CreateEquipment from './system-configuration/tenants-administraion/operations-administration/marketing-equipment/equipments/create/CreateEquipment';
import ListEquipments from './system-configuration/tenants-administraion/operations-administration/marketing-equipment/equipments/ListEquipments';
import EditEquipment from './system-configuration/tenants-administraion/operations-administration/marketing-equipment/equipments/edit/EditEquipment';
import CreateSettings from './system-configuration/tenants-administraion/staffing-administration/classifications/settings/Create/CreateSettings';
import ViewEquipment from './system-configuration/tenants-administraion/operations-administration/marketing-equipment/equipments/view/ViewEquipment';
import ViewLeave from './system-configuration/tenants-administraion/staffing-administration/leave-types/ViewLeave.jsx';
import SettingEdit from './system-configuration/tenants-administraion/staffing-administration/classifications/settings/edit/SettingEdit';
import CreateCloseDate from './system-configuration/tenants-administraion/operations-administration/calendar/close-dates/CreateCloseDate';
import EditCloseDate from './system-configuration/tenants-administraion/operations-administration/calendar/close-dates/EditCloseDate';
import ListCloseDates from '../pages/system-configuration/tenants-administraion/operations-administration/calendar/close-dates/ListCloseDate';
import ViewCloseDate from '../pages/system-configuration/tenants-administraion/operations-administration/calendar/close-dates/ViewCloseDate';
import CreateNceSubCategory from './system-configuration/tenants-administraion/operations-administration/non-collection-events/nce-subcategory/create/CreateNceSubCategory';
import NceSubCategoryList from './system-configuration/tenants-administraion/operations-administration/non-collection-events/nce-subcategory/NceSubCategoryList';
import ViewNceSubCategory from './system-configuration/tenants-administraion/operations-administration/non-collection-events/nce-subcategory/view/ViewNceSubCategory';
import EditNceSubCategory from './system-configuration/tenants-administraion/operations-administration/non-collection-events/nce-subcategory/edit/EditNceSubCategory';
import ListPromotions from './system-configuration/tenants-administraion/operations-administration/marketing-equipment/promotions/index';
import CreatePromotion from './system-configuration/tenants-administraion/operations-administration/marketing-equipment/promotions/create/CreatePromotion';
import EditPromotion from './system-configuration/tenants-administraion/operations-administration/marketing-equipment/promotions/edit/EditPromotion';
import ViewPromotion from './system-configuration/tenants-administraion/operations-administration/marketing-equipment/promotions/view/ViewPromotion';
import ViewSetting from './system-configuration/tenants-administraion/staffing-administration/classifications/settings/view/ViewSetting';
import ListSetting from './system-configuration/tenants-administraion/staffing-administration/classifications/settings/ListSetting';
/* alias list */
import { ViewAttachmentCategory as ViewNotesAttachmentCategory } from './system-configuration/tenants-administraion/operations-administration/notes-attachment/attachment-category/view/ViewAttachmentCategory.jsx';
import { CreateAttachmentCategory as CreateNotesAttachmentCategory } from './system-configuration/tenants-administraion/operations-administration/notes-attachment/attachment-category/create/CreateAttachmentCategory';
import { AttachmentCategoriesList as AttachmentNotesCategoriesList } from './system-configuration/tenants-administraion/operations-administration/notes-attachment/attachment-category/AttachmentCategoriesList';
import AliasList from './system-configuration/tenants-administraion/crm-administration/locations/alias/list';
import AliasEdit from './system-configuration/tenants-administraion/crm-administration/locations/alias/edit';
import ListLocationAttachmentCategories from './system-configuration/tenants-administraion/crm-administration/location-attachment-categories/ListCategories';
import CreateTask from './system-configuration/tenants-administraion/operations-administration/task-management/CreateTask';
import EditTask from './system-configuration/tenants-administraion/operations-administration/task-management/EditTask';
import ViewTask from './system-configuration/tenants-administraion/operations-administration/task-management/ViewTask';
import ListTask from './system-configuration/tenants-administraion/operations-administration/task-management/ListTask';

import LocationNoteCategoryAdd from './system-configuration/tenants-administraion/crm-administration/locations/note-category/add/LocationNoteCategoryAdd';
import LocationNoteCategoryEdit from './system-configuration/tenants-administraion/crm-administration/locations/note-category/edit/LocationNoteCategoryEdit';
import LocationNoteCategoryList from './system-configuration/tenants-administraion/crm-administration/locations/note-category/LocationNoteCategoryList';
import LocationNoteCategoryView from './system-configuration/tenants-administraion/crm-administration/locations/note-category/view/LocationNoteCategoryView';
import ContactsNoteCategoriesList from './system-configuration/tenants-administraion/crm-admin/contacts/note-category/ContactsNoteCategoriesList';
import ContactsNoteCategoryAdd from './system-configuration/tenants-administraion/crm-admin/contacts/note-category/add/ContactsNoteCategoryAdd';
import ContactsNoteCategoryEdit from './system-configuration/tenants-administraion/crm-admin/contacts/note-category/edit/ContactsNoteCategoryEdit';
import ContactsNoteCategoryView from './system-configuration/tenants-administraion/crm-admin/contacts/note-category/view/ContactsNoteCategoryView';
import ContactsNoteSubCategoriesList from './system-configuration/tenants-administraion/crm-admin/contacts/note-subcategory/ContactsNoteSubCategoriesList';
import ContactsNoteSubCategoryView from './system-configuration/tenants-administraion/crm-admin/contacts/note-subcategory/view/ContactsNoteSubCategoryView';
import ContactsNoteSubCategoryEdit from './system-configuration/tenants-administraion/crm-admin/contacts/note-subcategory/edit/ContactsNoteSubCategoryEdit';
import ContactsNoteSubCategoryAdd from './system-configuration/tenants-administraion/crm-admin/contacts/note-subcategory/add/ContactsNoteSubCategoryAdd';
import CreateUpdateStaffSetup from './system-configuration/tenants-administraion/staffing-administration/staff-setup/CreateUpdateStaffSetup';
import ListStaffSetup from './system-configuration/tenants-administraion/staffing-administration/staff-setup/ListStaffSetup';
import ViewDetailOfStafSetup from './system-configuration/tenants-administraion/staffing-administration/staff-setup/ViewDetailOfStafSetup';
import ViewAttachment from './system-configuration/tenants-administraion/crm-administration/location-attachment-categories/ViewCategory';
import AccountsCreateAttachmentSubCategory from './system-configuration/tenants-administraion/crm-administration/account/attachment-subcategories/CreateAttachmentSubCategory';
import AccountsListAttachmentSubCategory from './system-configuration/tenants-administraion/crm-administration/account/attachment-subcategories/ListAttachmentSubCategory';
import AccountsViewAttachmentSubCategory from './system-configuration/tenants-administraion/crm-administration/account/attachment-subcategories/ViewAttachmentSubCategory';
import { ViewAttachmentSubcategory as ViewNotesAttachmentSubCategory } from './system-configuration/tenants-administraion/operations-administration/notes-attachment/subAttachment-category/view/ViewAttachmentSubcategory.jsx';
import { CreateAttachmentSubcategory as CreateNotesAttachmentSubCategory } from './system-configuration/tenants-administraion/operations-administration/notes-attachment/subAttachment-category/create/CreateAttachmentSubcategory.jsx';
import { AttachmentSubcategoriesList as AttachmentNotesSubCategoriesList } from './system-configuration/tenants-administraion/operations-administration/notes-attachment/subAttachment-category/AttachmentSubcategoriesList';
import ListAssignMembers from './system-configuration/tenants-administraion/staffing-administration/teams/assign-members/view/ListAssignMembers';
import AssignMembersCreate from './system-configuration/tenants-administraion/staffing-administration/teams/assign-members/assign/AssignMembers';
import CategoryUpsert from '../components/system-configuration/tenants-administration/organizational-administration/resources/location-attachment-categories/CategoryUpsert';
import CreatePromotionalItem from './system-configuration/tenants-administraion/operations-administration/marketing-equipment/promotional-item/create/CreatePromotionalItem';
import LocationNoteSubCategoryAdd from './system-configuration/tenants-administraion/crm-administration/locations/note-subcategory/add/LocationNoteSubCategoryAdd';
import ViewPromotionItems from './system-configuration/tenants-administraion/operations-administration/marketing-equipment/promotional-item/view/PromotionalItemView';
import ListPromotionalItems from './system-configuration/tenants-administraion/operations-administration/marketing-equipment/promotional-item/index';
import EditPromotionalItems from './system-configuration/tenants-administraion/operations-administration/marketing-equipment/promotional-item/edit/EditPromotionalItem';
import ListLocationsAttachmentCategories from './system-configuration/tenants-administraion/crm-administration/locations/attachment-categories/ListAttachmentCategories';
import ViewLocationsAttachmentCategories from './system-configuration/tenants-administraion/crm-administration/locations/attachment-categories/view/ViewAttachmentCategories';
import CreateLocationsAttachmentCategories from './system-configuration/tenants-administraion/crm-administration/locations/attachment-categories/create/CreateAttachmentCategories';
import EditLocationsAttachmentCategories from './system-configuration/tenants-administraion/crm-administration/locations/attachment-categories/edit/EditAttachmentCategories';
import ViewLocationsAttachmentSubCategories from './system-configuration/tenants-administraion/crm-administration/locations/attachment-subcategories/view/ViewAttachmentSubCategories';
import EditLocationsAttachmentSubCategories from './system-configuration/tenants-administraion/crm-administration/locations/attachment-subcategories/edit/EditAttachmentSubCategories';
import CreateLocationsAttachmentSubCategories from './system-configuration/tenants-administraion/crm-administration/locations/attachment-subcategories/create/CreateAttachmentSubCategories';
import ListLocationsAttachmentSubCategories from './system-configuration/tenants-administraion/crm-administration/locations/attachment-subcategories/ListAttachmentSubCategories';
import Approvals from './system-configuration/tenants-administraion/operations-administration/marketing-equipment/approvals';
import ApprovalsEdit from './system-configuration/tenants-administraion/operations-administration/marketing-equipment/approvals/ApprovalsEdit';
import LocationNoteSubCategoryEdit from './system-configuration/tenants-administraion/crm-administration/locations/note-subcategory/edit/LocationNoteSubCategoryEdit';
import LocationNoteSubCategoryView from './system-configuration/tenants-administraion/crm-administration/locations/note-subcategory/view/LocationNoteSubCategoryView';
import ListAccounts from './crm/accounts/ListAccounts';
import CreateAccount from './crm/accounts/CreateAccount';
import EditAccount from './crm/accounts/EditAccount';
import ViewAccount from './crm/accounts/ViewAccount';
import ListVolunteers from './crm/contacts/volunteers/ListVolunteers';
import CreateVolunteer from './crm/contacts/volunteers/CreateVolunteer';
import ViewVolunteer from './crm/contacts/volunteers/ViewVolunteer';
import VolunteerListDuplicates from './crm/contacts/volunteers/duplicates/VolunteerListDuplicates';
import ViewActivityLog from './crm/contacts/volunteers/activity-log/ActivityLogView.jsx';

import ListDonors from './crm/contacts/donor/ListDonors';
import CreateDonor from './crm/contacts/donor/CreateDonor';
import ViewDonor from './crm/contacts/donor/ViewDonor';

import ViewStaff from './crm/contacts/staffs/ViewStaff';
import ListStaff from './crm/contacts/staff/ListStaff';
import CreateStaff from './crm/contacts/staff/CreateStaff';

import LocationNoteSubCategoriesList from './system-configuration/tenants-administraion/crm-administration/locations/note-subcategory/LocationNoteSubCategoriesList';
import CreateNotes from './crm/accounts/documents/notes/CreateNotes';
import EditNotes from './crm/accounts/documents/notes/EditNotes';
import AccountAliasList from './system-configuration/tenants-administraion/crm-administration/account/alias/list';
import AccountAliasEdit from './system-configuration/tenants-administraion/crm-administration/account/alias/edit';
import ContactAliasList from './system-configuration/tenants-administraion/crm-administration/contact/alias/list';
import ContactAliasEdit from './system-configuration/tenants-administraion/crm-administration/contact/alias/edit';
import AddStaffLeave from './crm/contacts/staff/leave/AddLeave';
import ListStaffLeave from './crm/contacts/staff/leave/ListLeave';
import ViewStaffLeave from './crm/contacts/staff/leave/ViewLeave';
import EditStaffLeave from './crm/contacts/staff/leave/EditLeave';
import ListStaffDuplicates from './crm/contacts/staff/duplicates/ListDuplicates';
import EditAttachmentCategory from './system-configuration/tenants-administraion/crm-administration/contact/attachment-categories/EditAttachmentCategory';
import { EditNotesAttachmentCategory } from './system-configuration/tenants-administraion/operations-administration/notes-attachment/attachment-category/edit/EditAttachmentCategory';
import { EditNotesAttachmentSubcategory } from './system-configuration/tenants-administraion/operations-administration/notes-attachment/subAttachment-category/edit/EditAttachmentSubcategory';
import DailyHour from './system-configuration/tenants-administraion/operations-administration/booking-drives/daily-hour/DailyCapacity';
import CreateDailyHour from './system-configuration/tenants-administraion/operations-administration/booking-drives/daily-hour/CreateDailyHour';
import EditDailyHourPage from './system-configuration/tenants-administraion/operations-administration/booking-drives/daily-hour/EditDailyCapacity';
import EditAttachmentSubCategory from './system-configuration/tenants-administraion/crm-administration/contact/attachment-subcategories/EditAttachmentSubCategory';
import AccountsEditAttachmentSubCategory from './system-configuration/tenants-administraion/crm-administration/account/attachment-subcategories/EditAttachmentSubCategory';
import CreateAttachments from './crm/accounts/documents/attachments/CreateAttachments';
import ListDonorCenters from './crm/donors_centers/ListDonorCenters';
import ListDonorCentersSessionHistory from './crm/donors_centers/session-history/ListDonorCentersSessionHistory.jsx';
import EditAttachments from './crm/accounts/documents/attachments/EditAttachments';

import TasksList from './tasks/TasksList';
import TasksCreate from './tasks/TasksCreate';
import TasksView from './tasks/TasksView';
import TasksEdit from './tasks/TasksEdit';
import LocationListNotes from './crm/locations/view/document/notes/LocationListNotes';
import LocationCreateNotes from './crm/locations/view/document/notes/LocationCreateNote';
import LocationEditNote from './crm/locations/view/document/notes/LocationEditNote';
import LocationViewNotes from './crm/locations/view/document/notes/LocationViewNotes';
import AccountTasksCreate from './crm/accounts/tasks/AccountTasksCreate';
import AccountTasksEdit from './crm/accounts/tasks/AccountTasksEdit';
import AccountTasksView from './crm/accounts/tasks/AccountTasksView';
import LocationsTasksList from './crm/locations/tasks/LocationsTasksList';
import LocationsTasksCreate from './crm/locations/tasks/LocationsTasksCreate';
import LocationsTasksView from './crm/locations/tasks/LocationsTasksView';
import LocationsTasksEdit from './crm/locations/tasks/LocationsTasksEdit';
import DonorCentersTasksCreate from './crm/donors_centers/tasks/DonorCentersTasksCreate';
import DonorCentersTasksEdit from './crm/donors_centers/tasks/DonorCentersTasksEdit';
import DonorCentersTasksView from './crm/donors_centers/tasks/DonorCentersTasksView';
import DonorCentersTasksList from './crm/donors_centers/tasks/DonorCentersTasksList';
import AboutView from './crm/non-collection-profiles/about/AboutView';
import DonorsCreateNotes from './crm/contacts/donors/documents/notes/DonorsCreateNote';
import DonorsListNotes from './crm/contacts/donors/documents/notes/DonorsListNotes';
import DonorsViewNotes from './crm/contacts/donors/documents/notes/DonorsViewNotes';
import DonorsEditNote from './crm/contacts/donors/documents/notes/DonorsEditNote';
import DonorsCreateAttachments from './crm/contacts/donors/documents/attachments/DonorsCreateAttachments';
import DonorsListAttachments from './crm/contacts/donors/documents/attachments/DonorsListAttachments';
import DonorsViewAttachments from './crm/contacts/donors/documents/attachments/DonorsViewAttachments';
import DonorsEditAttachments from './crm/contacts/donors/documents/attachments/DonorsEditAttachments';
import VolunteerCreateNotes from './crm/contacts/volunteers/documents/notes/VolunteerCreateNote';
import VolunteerListNotes from './crm/contacts/volunteers/documents/notes/VolunteerListNotes';
import VolunteerViewNotes from './crm/contacts/volunteers/documents/notes/VolunteerViewNotes';
import VolunteerEditNote from './crm/contacts/volunteers/documents/notes/VolunteerEditNote';
import StaffCreateNotes from './crm/contacts/staff/documents/notes/StaffCreateNote';
import StaffListNotes from './crm/contacts/staff/documents/notes/StaffListNotes';
import StaffViewNotes from './crm/contacts/staff/documents/notes/StaffViewNotes';
import StaffEditNote from './crm/contacts/staff/documents/notes/StaffEditNote';
import NCPCreateNotes from './crm/non-collection-profiles/document/notes/NCPCreateNote';
import NCPListNotes from './crm/non-collection-profiles/document/notes/NCPListNotes';
import NCPViewNotes from './crm/non-collection-profiles/document/notes/NCPViewNotes';
import NCPEditNote from './crm/non-collection-profiles/document/notes/NCPEditNote';
import DonorTasksList from './crm/contacts/donor/tasks/DonorTasksList';
import DonorTasksCreate from './crm/contacts/donor/tasks/DonorTasksCreate';
import DonorTasksEdit from './crm/contacts/donor/tasks/DonorTasksEdit';
import DonorTasksView from './crm/contacts/donor/tasks/DonorTasksView';
import StaffTasksList from './crm/contacts/staff/tasks/StaffTasksList';
import StaffTasksCreate from './crm/contacts/staff/tasks/StaffTasksCreate';
import StaffTasksEdit from './crm/contacts/staff/tasks/StaffTasksEdit';
import StaffTasksView from './crm/contacts/staff/tasks/StaffTasksView';
import VolunteerTasksList from './crm/contacts/volunteer/tasks/VolunteerTasksList';
import VolunteerTasksCreate from './crm/contacts/volunteer/tasks/VolunteerTasksCreate';
import VolunteerTasksEdit from './crm/contacts/volunteer/tasks/VolunteerTasksEdit';
import VolunteerTasksView from './crm/contacts/volunteer/tasks/VolunteerTasksView';
import NonCollectionProfilesTasksCreate from './crm/non-collection-profiles/tasks/NonCollectionProfilesTasksCreate';
import NonCollectionProfilesTasksList from './crm/non-collection-profiles/tasks/NonCollectionProfilesTasksList';
import NonCollectionProfilesTasksEdit from './crm/non-collection-profiles/tasks/NonCollectionProfilesTasksEdit';
import NonCollectionProfilesTasksView from './crm/non-collection-profiles/tasks/NonCollectionProfilesTasksView';
import DrivesTasksCreate from './operations-center/operations/drives/tasks/DrivesTasksCreate';
import DrivesTasksList from './operations-center/operations/drives/tasks/DrivesTasksList';
import DrivesTasksEdit from './operations-center/operations/drives/tasks/DrivesTasksEdit';
import DrivesTasksView from './operations-center/operations/drives/tasks/DrivesTasksView';
import ViewDonorCenters from './crm/donors_centers/ViewDonorCenters';
import DonorCenterCreateNotes from './crm/donors_centers/view/document/notes/DonorCenterCreateNote';
import DonorCenterListNotes from './crm/donors_centers/view/document/notes/DonorCenterListNotes';
import DonorCenterViewNotes from './crm/donors_centers/view/document/notes/DonorCenterViewNotes';
import DonorCenterEditNote from './crm/donors_centers/view/document/notes/DonorCenterEditNote';
import LocationAttachmentsAdd from './crm/locations/view/document/attachments/LocationAttachmentsAdd';
import LocationAttachmentsEdit from './crm/locations/view/document/attachments/LocationAttachmentsEdit';
import LocationAttachmentsList from './crm/locations/view/document/attachments/LocationAttachmentsList';
import LocationAttachmentsView from './crm/locations/view/document/attachments/LocationAttachmentsView';
import VolunteerAttachmentsAdd from './crm/contacts/volunteers/documents/attachments/VolunteerCreateAttachments';
import VolunteerAttachmentsView from './crm/contacts/volunteers/documents/attachments/VolunteerViewAttachments';
import VolunteerAttachmentsEdit from './crm/contacts/volunteers/documents/attachments/VolunteerEditAttachments';
import VolunteerAttachmentsList from './crm/contacts/volunteers/documents/attachments/VolunteerListAttachments.jsx';
import StaffAttachmentsAdd from './crm/contacts/staff/documents/attachments/StaffCreateAttachments';
import StaffAttachmentsView from './crm/contacts/staff/documents/attachments/StaffViewAttachments';
import StaffAttachmentsList from './crm/contacts/staff/documents/attachments/StaffListAttachments.jsx';
import StaffAttachmentsEdit from './crm/contacts/staff/documents/attachments/StaffEditAttachments';
import NCPAttachmentsAdd from './crm/non-collection-profiles/document/attachments/NCPAttachmentsAdd';
import NCPAttachmentsList from './crm/non-collection-profiles/document/attachments/NCPAttachmentsList';
import NCPAttachmentsView from './crm/non-collection-profiles/document/attachments/NCPAttachmentsView';
import NCPAttachmentsEdit from './crm/non-collection-profiles/document/attachments/NCPAttachmentsEdit';
import DonorCenterAttachmentsAdd from './crm/donors_centers/view/document/attachments/DonorCenterAttachmentsAdd';
import DonorCenterAttachmentsEdit from './crm/donors_centers/view/document/attachments/DonorCenterAttachmentsEdit';
import DonorCenterAttachmentsList from './crm/donors_centers/view/document/attachments/DonorCenterAttachmentsList';
import DonorCenterAttachmentsView from './crm/donors_centers/view/document/attachments/DonorCenterAttachmentsView';
import DonorDuplicatesList from './crm/contacts/donor/duplicates/DonorDuplicatesList';
import EditProfile from './crm/non-collection-profiles/profiles/EditProfile';
import LocationsCreate from './crm/locations/createCrmLocations';
import ListCrmLocations from './crm/locations/listCrmLocations';
import ViewCrmLocartion from './crm/locations/CrmViewLocation';
import LocationCreateDirection from './crm/locations/view/directions/LocationCreateDirection';
import LocationListDirections from './crm/locations/view/directions/LocationListDirections';
import LocationViewDirections from './crm/locations/view/directions/LocationViewDirection';
import LocationEditDirection from './crm/locations/view/directions/LocationEditDirection';
import CreateDrive from './operations-center/operations/drives/CreateDrive';
import ListDonorCommunication from './crm/contacts/donor/communication/ListCommunication';
import ViewDonorCommunication from './crm/contacts/donor/communication/ViewCommunication';
import ListVolunteerCommunication from './crm/contacts/volunteers/communication/ListCommunication';
import ViewVolunteerCommunication from './crm/contacts/volunteers/communication/ViewCommunication';
import EditCrmLocations from './crm/locations/editCrmLocations';
import ListDrive from './operations-center/operations/drives/ListDrive';
import ViewDrive from './operations-center/operations/drives/ViewDrive';
import DriveShiftDetails from './operations-center/operations/drives/DriveShiftDetails.jsx';

import CustomFieldsList from './system-configuration/tenants-administraion/organizational-administration/custom-fields/CustomFieldsList';
import CreateCustomFields from './system-configuration/tenants-administraion/organizational-administration/custom-fields/CreateCustomFields';
import EditCustomFields from './system-configuration/tenants-administraion/organizational-administration/custom-fields/EditCustomFields';
import NonCollectionProfilesBlueprintsCreate from './crm/non-collection-profiles/blueprints/NonCollectionProfilesBlueprintsCreate';
import ViewCustomFields from './system-configuration/tenants-administraion/organizational-administration/custom-fields/ViewCustomFields';
import DuplicateListLocation from './crm/locations/duplicate/DuplicateListLocation';
import NonCollectionProfilesBlueprintsList from './crm/non-collection-profiles/blueprints/NonCollectionProfilesBlueprintsList';
import NonCollectionProfilesBlueprintsView from './crm/non-collection-profiles/blueprints/NonCollectionProfilesBlueprintsView';
import NonCollectionProfilesBlueprintsDetailsShift from './crm/non-collection-profiles/blueprints/NonCollectionProfilesBlueprintsDetailsShift';
import NonCollectionProfilesBlueprintsEdit from './crm/non-collection-profiles/blueprints/NonCollectionProfilesBlueprintsEdit';
import DrivesAttachmentsAdd from './operations-center/operations/drives/document/attachments/DrivesAttachmentsAdd';
import DrivesAttachmentsList from './operations-center/operations/drives/document/attachments/DrivesAttachmentsList';
import DrivesAttachmentsView from './operations-center/operations/drives/document/attachments/DrivesAttachmentsView';
import DrivesAttachmentsEdit from './operations-center/operations/drives/document/attachments/DrivesAttachmentsEdit';
import DrivesCreateNotes from './operations-center/operations/drives/document/notes/DrivesCreateNote';
import DrivesListNotes from './operations-center/operations/drives/document/notes/DrivesListNotes';
import DrivesViewNotes from './operations-center/operations/drives/document/notes/DrivesViewNotes';
import DrivesEditNote from './operations-center/operations/drives/document/notes/DrivesEditNote';
import SessionsAttachmentsAdd from './operations-center/operations/sessions/document/attachments/SessionsAttachmentsAdd';
import SessionsAttachmentsList from './operations-center/operations/sessions/document/attachments/SessionsAttachmentsList';
import SessionsAttachmentsView from './operations-center/operations/sessions/document/attachments/SessionsAttachmentsView';
import SessionsAttachmentsEdit from './operations-center/operations/sessions/document/attachments/SessionsAttachmentsEdit';
import SessionsCreateNotes from './operations-center/operations/sessions/document/notes/SessionsCreateNote';
import SessionsListNotes from './operations-center/operations/sessions/document/notes/SessionsListNotes';
import SessionsViewNotes from './operations-center/operations/sessions/document/notes/SessionsViewNotes';
import SessionsEditNote from './operations-center/operations/sessions/document/notes/SessionsEditNote';
import NCEAttachmentsAdd from './operations-center/operations/NEC/document/attachments/NCEAttachmentsAdd';
import NCEAttachmentsList from './operations-center/operations/NEC/document/attachments/NCEAttachmentsList';
import NCEAttachmentsView from './operations-center/operations/NEC/document/attachments/NCEAttachmentsView';
import NCEAttachmentsEdit from './operations-center/operations/NEC/document/attachments/NCEAttachmentsEdit';
import NCECreateNotes from './operations-center/operations/NEC/document/notes/NCECreateNote';
import NCEListNotes from './operations-center/operations/NEC/document/notes/NCEListNotes';
import NCEViewNotes from './operations-center/operations/NEC/document/notes/NCEViewNotes';
import NCEEditNote from './operations-center/operations/NEC/document/notes/NCEEditNote';
import NonCollectionEventsTasksCreate from './operations-center/operations/NEC/tasks/NonCollectionEventsTasksCreate';
import NonCollectionEventsTasksList from './operations-center/operations/NEC/tasks/NonCollectionEventsTasksList';
import NonCollectionEventsTasksEdit from './operations-center/operations/NEC/tasks/NonCollectionEventsTasksEdit';
import NonCollectionEventsTasksView from './operations-center/operations/NEC/tasks/NonCollectionEventsTasksView';
import NonCollectionEventsChangeAuditView from './operations-center/operations/NEC/change-audit/NonCollectionEventsChangeAuditView';
import SessionsTasksCreate from './operations-center/operations/sessions/tasks/SessionsTasksCreate';
import SessionsTasksList from './operations-center/operations/sessions/tasks/SessionsTasksList';
import SessionsTasksEdit from './operations-center/operations/sessions/tasks/SessionsTasksEdit';
import SessionsTasksView from './operations-center/operations/sessions/tasks/SessionsTasksView';
import ListSession from './operations-center/operations/sessions/ListSession';
import CreateSession from './operations-center/operations/sessions/CreateSession';
import ViewSession from './operations-center/operations/sessions/ViewSession';
import CreateFavorite from './operations-center/manage-favorites/create/CreateFavorite';
import ListFavorite from './operations-center/manage-favorites/ListFavorite';
import DummyCalendarPage from '../components/operations-center/manage-favorites/DummyCalendarPage';
import EditDuplicateFavorite from './operations-center/manage-favorites/EditDuplicateFavorite/EditDuplicateFavorite';
import ViewFavorite from './operations-center/manage-favorites/view/ViewFavorite';
import OperationsCenterDashboard from './dashboard/OperationsCenterDashboard';
import VolunteerLayout from './crm/contacts/volunteers/VolunteerLayout.jsx';
import DonorsLayout from './crm/contacts/donor/DonorLayout.jsx';
import StaffLayout from './crm/contacts/staff/StaffLayout.jsx';
import ViewRecentActivity from './crm/contacts/donor/recent-activity/ViewRecentActivity.jsx';
import EventHistory from './crm/non-collection-profiles/eventHistory/EventHistory.jsx';
import ListDonorCenterBluePrints from './crm/donors_centers/view/bluePrints/listing';
import ShiftDetailsDonorCenterBluePrints from './crm/donors_centers/view/bluePrints/view/ViewShiftDetails.jsx';
import DonorSchedulesDonorCenterBluePrints from './crm/donors_centers/view/bluePrints/view/ViewDonorSchedules.jsx';
import DonorDonationHistoryList from './crm/contacts/donor/donation-history/DonorDonationHistoryList';
import StaffScheduleList from './crm/contacts/staff/schedule/StaffScheduleList';
import DonorScheduleList from './crm/contacts/donor/schedule/DonorScheduleList';
import VolunteerService from './crm/contacts/volunteers/service/serviceHistory.jsx';
import ListStaffCommunication from './crm/contacts/staff/communication/ListCommunication';
import ViewStaffCommunication from './crm/contacts/staff/communication/ViewCommunication';
import LocationHistoryList from './crm/locations/drive-history/LocationHistoryList';
import ViewAvailability from './crm/contacts/staff/availability/ViewAvailability.jsx';
import SessionsChangeAuditView from './operations-center/operations/sessions/change-audit/SessionsChangeAuditView.jsx';
import CreateDonorCenterBluePrints from './crm/donors_centers/view/bluePrints/creating';
import ViewDonorCenterBluePrints from './crm/donors_centers/view/bluePrints/view/ViewBluePrint.jsx';
import EditDonorBluePrints from './crm/donors_centers/view/bluePrints/edit/editDonorBluePrint.js';
import StaffScheduleView from './crm/contacts/staff/schedule/StaffScheduleView';
import ApprovalsBeginApproval from './operations-center/approvals/beginApprovals';
import DrivesStaffingList from './operations-center/operations/drives/staffing/DrivesStaffingList';
import SessionsStaffingList from './operations-center/operations/sessions/staffing/SessionsStaffingList';
import CreateProspects from './operations-center/prospects/create/CreateProspects.jsx';
import BuildSegmentsProspects from './operations-center/prospects/create/BuildSegmentsProspects.jsx';
import ListProspects from './operations-center/prospects/ListProspects.jsx';
import CreateMessageProspects from './operations-center/prospects/create/CreateMessageProspects.jsx';
import NonCollectionEventsStaffingList from './operations-center/operations/NEC/staffing/NonCollectionEventsStaffingList';
import DrivesChangeAuditList from './operations-center/operations/drives/change-audit/DrivesChangeAuditList.jsx';
import ViewDonorSchedule from './crm/contacts/donor/schedule/ViewDonorSchedule.jsx';
import ViewDonorSchedules from './operations-center/operations/drives/donorSchedules/ViewDonorSchedules.jsx';
import CalendarView from './operations-center/calendar/calendarView';
import EditDrive from './operations-center/operations/drives/CreateDrive';
import ViewMarketingDetailsBlueprintAccount from './crm/accounts/blueprint/view/ViewMarketingDetails.jsx';
import DonorScheduleCreate from './crm/contacts/donor/schedule/DonorScheduleCreate.jsx';
import DonorScheduleCreateForm from './crm/contacts/donor/schedule/DonorScheduleCreateForm.jsx';
import DonorScheduleEditForm from './crm/contacts/donor/schedule/DonorScheduleEditForm.jsx';
import ListStaffs from './staffing-management/staff-list/ListStaff';
import ResourceSharingCreate from './operations-center/resource-sharing/ResourceSharingCreate.jsx';
import ResourceSharingEdit from './operations-center/resource-sharing/ResourceSharingEdit.jsx';
import ResourceSharingList from './operations-center/resource-sharing/ResourceSharingList.jsx';
import ResourceSharingView from './operations-center/resource-sharing/ResourceSharingView.jsx';
import ScheduleView from './staffing-management/view-schedule/ScheduleView';
import BuildSchedule from './staffing-management/build-schedule/BuildSchedule.jsx';
import CreateSchedule from './staffing-management/build-schedule/create-schedule/CreateSchedule.jsx';
import TenantUserAssignedRole from './system-configuration/tenants-administraion/users-administration/user-roles/TenantUserAssignedRole.jsx';
import SystemConfigurationDashBoard from './dashboard/SystemConfigurationDashboard.jsx';
import AboutProspects from './operations-center/prospects/AboutProspects.jsx';
import ContactProspects from './operations-center/prospects/ContactProspects.jsx';

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  environment: process.env.REACT_APP_ENVIRONMENT ?? 'development',
  integrations: [
    new Sentry.BrowserTracing({
      routingInstrumentation: Sentry.reactRouterV6Instrumentation(
        React.useEffect,
        useLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes
      ),
    }),
  ],
  tracesSampleRate: 1.0,
});

const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes);

function App() {
  // const navigate = useNavigate()
  useEffect(() => {
    require('bootstrap/dist/js/bootstrap.bundle');
  }, []);
  // const [currentUrl, setCurrentUrl] = useState('');

  // console.log({ currentUrl })
  return (
    <>
      <ToastContainer position="bottom-right" />
      <BrowserRouter>
        <Routes>
          <Route element={<DonorsLayout />}>
            <Route
              exact
              path="/crm/contacts/donor/:donorId/view/documents/notes"
              element={<DonorsListNotes />}
            />
            <Route
              exact
              path="/crm/contacts/donor/:donorId/view/documents/notes/:noteId/view"
              element={<DonorsViewNotes />}
            />
            <Route
              exact
              path="/crm/contacts/donor/:donorId/view/documents/attachments"
              element={<DonorsListAttachments />}
            />
            <Route
              exact
              path="/crm/contacts/donor/:donorId/view/documents/attachments/:attachId/view"
              element={<DonorsViewAttachments />}
            />
            <Route
              exact
              path="/crm/contacts/donor/:donorId/view/communication"
              element={<ListDonorCommunication />}
            />
            <Route
              exact
              path="/crm/contacts/donor/:donorId/view/communication/:id/view"
              element={<ViewDonorCommunication />}
            />
            <Route
              exact
              path="/crm/contacts/donor/:donorId/view"
              element={<ViewDonor />}
            />
            <Route
              exact
              path={DONOR_TASKS_PATH.LIST}
              element={<DonorTasksList />}
            />
            <Route
              exact
              path={DONOR_TASKS_PATH.VIEW}
              element={<DonorTasksView />}
            />
            <Route
              exact
              path="/crm/contacts/donor/:donorId/view/recent-activity"
              element={<ViewRecentActivity />}
            />

            <Route
              exact
              path={CRM_DONOR_SCHEDULE_PATH.LIST}
              element={<DonorScheduleList />}
            />

            <Route
              exact
              path={CRM_DONOR_SCHEDULE_PATH.VIEW}
              element={<ViewDonorSchedule />}
            />
            <Route
              exact
              path="/crm/contacts/donor/:donorId/view/duplicates"
              element={<DonorDuplicatesList />}
            />
            <Route
              exact
              path={DONOR_DONATION_HISTORY_PATH.LIST}
              element={<DonorDonationHistoryList />}
            />
          </Route>
        </Routes>

        <Routes>
          <Route element={<VolunteerLayout />}>
            <Route
              exact
              path="/crm/contacts/volunteer/:volunteerId/view/documents/notes"
              element={<VolunteerListNotes />}
            />
            <Route
              exact
              path="/crm/contacts/volunteer/:volunteerId/view/documents/notes/:noteId/view"
              element={<VolunteerViewNotes />}
            />
            <Route
              exact
              path="/crm/contacts/volunteer/:volunteerId/view/documents/attachments"
              element={<VolunteerAttachmentsList />}
            />
            <Route
              exact
              path="/crm/contacts/volunteer/:volunteerId/view/documents/attachments/:attachId/view"
              element={<VolunteerAttachmentsView />}
            />
            <Route
              exact
              path="/crm/contacts/volunteers/:volunteerId/view/duplicates"
              element={<VolunteerListDuplicates />}
            />
            <Route
              exact
              path="/crm/contacts/volunteers/:volunteerId/view"
              element={<ViewVolunteer />}
            />
            <Route
              exact
              path="/crm/contacts/volunteers/:volunteerId/view/communication"
              element={<ListVolunteerCommunication />}
            />
            <Route
              exact
              path="/crm/contacts/volunteers/:volunteerId/view/communication/:id/view"
              element={<ViewVolunteerCommunication />}
            />
            <Route
              exact
              path={CRM_VOLUNTEER_TASKS_PATH.LIST}
              element={<VolunteerTasksList />}
            />
            <Route
              exact
              path={CRM_VOLUNTEER_TASKS_PATH.VIEW}
              element={<VolunteerTasksView />}
            />
            <Route
              exact
              path="/crm/contacts/volunteers/:volunteerId/view/activity"
              element={<ViewActivityLog />}
            />
            <Route
              exact
              path="/crm/contacts/volunteers/:volunteerId/view/service"
              element={<VolunteerService />}
            />
          </Route>
        </Routes>

        <Routes>
          <Route element={<StaffLayout />}>
            <Route
              exact
              path={STAFF_TASKS_PATH.LIST}
              element={<StaffTasksList />}
            />
            <Route
              exact
              path={STAFF_TASKS_PATH.VIEW}
              element={<StaffTasksView />}
            />
            <Route
              exact
              path="/crm/contacts/staff/:id/view/documents/notes"
              element={<StaffListNotes />}
            />
            <Route
              exact
              path="/crm/contacts/staff/:id/view/documents/notes/:noteId/view"
              element={<StaffViewNotes />}
            />
            <Route
              exact
              path="/crm/contacts/staff/:id/view/documents/attachments"
              element={<StaffAttachmentsList />}
            />
            <Route
              exact
              path="/crm/contacts/staff/:id/view/documents/attachments/:attachId/view"
              element={<StaffAttachmentsView />}
            />
            <Route
              exact
              path="/crm/contacts/staff/:staffId/view"
              element={<ViewStaff />}
            />
            <Route
              exact
              path="/crm/contacts/staff/:staffId/view/leave"
              element={<ListStaffLeave />}
            />
            <Route
              exact
              path="/crm/contacts/staff/:staffId/view/leave/:id/view"
              element={<ViewStaffLeave />}
            />
            <Route
              exact
              path="/crm/contacts/staff/:staffId/view/duplicates"
              element={<ListStaffDuplicates />}
            />
            <Route
              exact
              path="/crm/contacts/staff/:id/view/availability"
              element={<ViewAvailability />}
            />
            <Route
              exact
              path="/crm/contacts/staff/:id/view/communication"
              element={<ListStaffCommunication />}
            />
            <Route
              exact
              path="/crm/contacts/staff/:id/view/communication/:secondID/view"
              element={<ViewStaffCommunication />}
            />

            <Route
              exact
              path={CRM_STAFF_SCHEDULE_PATH.LIST}
              element={<StaffScheduleList />}
            />

            <Route
              exact
              path={CRM_STAFF_SCHEDULE_PATH.VIEW}
              element={<StaffScheduleView />}
            />
          </Route>
        </Routes>

        <SentryRoutes>
          <Route path={'/'} element={<PrivateRoute />}>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route exact path="/" element={<Dashboard />} />
            {/* <Route index element={<Home />} /> */}
            <Route exact path="/dashboard" element={<Dashboard />} />
            <Route exact path="/crm/dashboard" element={<CrmDashboard />} />
            <Route
              exact
              path="/tenant-dashboard"
              element={<TenantDashboard />}
            />
            {/* loactions - alias - routes start*/}
            <Route
              exact
              path="/crm/accounts/:id/blueprint/:blueprintId/shifts/view"
              element={<ViewShiftDetailsAccount />}
            />
            <Route
              exact
              path={CRM_ACCOUNT_BLUEPRINT_PATH.ABOUT}
              element={<ViewAboutBlueprintAccount />}
            />
            <Route
              exact
              path={CRM_ACCOUNT_BLUEPRINT_PATH.MARKETING_DETAILS}
              element={<ViewMarketingDetailsBlueprintAccount />}
            />
            <Route
              exact
              path="/crm/donor-centers/:id/blueprints"
              element={<ListDonorCenterBluePrints />}
            />
            <Route
              exact
              path="/crm/donor-centers/:id/blueprints/:blueprintId/view"
              element={<ViewDonorCenterBluePrints />}
            />
            <Route
              exact
              path="/crm/donor-centers/:id/blueprints/:blueprintId/edit"
              element={<EditDonorBluePrints />}
            />
            <Route
              exact
              path="/crm/donor-centers/:id/blueprints/:blueprintId/donorSchedules"
              element={<DonorSchedulesDonorCenterBluePrints />}
            />
            {/* <Route
              exact
              path="/crm/donor-centers/:id/blueprints/:blueprintId/shiftDetails"
              element={<ShiftDetailsDonorCenterBluePrints />}
            /> */}
            <Route
              exact
              path="/crm/donor-centers/:id/blueprints/create"
              element={<CreateDonorCenterBluePrints />}
            />
            <Route
              exact
              path="/crm/donor-centers/:id/blueprints/:blueprintId/view"
              element={<ViewDonorCenterBluePrints />}
            />
            <Route
              exact
              path="/crm/donor-centers/:id/blueprints/:blueprintId/edit"
              element={<EditDonorBluePrints />}
            />
            <Route
              exact
              path="/crm/donor-centers/:id/blueprints/:blueprintId/donorSchedules"
              element={<DonorSchedulesDonorCenterBluePrints />}
            />
            <Route
              exact
              path="/crm/donor-centers/:id/blueprints/:blueprintId/shiftDetails"
              element={<ShiftDetailsDonorCenterBluePrints />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/crm-admin/locations/alias"
              element={<AliasList />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/crm-admin/locations/alias/edit"
              element={<AliasEdit />}
            />
            {/* loactions - alias - routes enf*/}
            {/* loactions - room - sizes - routes start*/}
            <Route
              exact
              path="/system-configuration/tenant-admin/crm-admin/locations/room-size"
              element={<ListAllRooms />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/crm-admin/locations/room-size/:id"
              element={<ViewRoomDetail />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/crm-admin/locations/room-size/create"
              element={<CreateUpdateRoomSize />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/crm-admin/locations/:id/edit"
              element={<CreateUpdateRoomSize />}
            />
            {/* loactions - room - sizes - routes end*/}{' '}
            <Route
              exact
              path="/system-configuration/platform-admin/email-template"
              element={<ListEmail />}
            />
            <Route
              exact
              path="/system-configuration/platform-admin/email-template/view/:id"
              element={<ViewEmail />}
            />
            <Route
              exact
              path="/system-configuration/platform-admin/email-template/edit/:id"
              element={<EditEmail />}
            />
            <Route
              exact
              path="/system-configuration/platform-admin/email-template/create"
              element={<AddEmail />}
            />
            {/* TENANTS PATHS */}
            <Route
              exact
              path="/system-configuration/platform-admin/tenant-management/create"
              element={<CreateTenant />}
            />
            <Route
              exact
              path="/system-configuration/platform-admin/tenant-management"
              element={<ListTenants />}
            />
            <Route
              exact
              path="/system-configuration/platform-admin/tenant-management/:id/edit"
              element={<TenantEdit />}
            />
            <Route
              exact
              path="/system-configuration/platform-admin/tenant-management/:tid/configuration"
              element={<CreateTenantConfigurations />}
            />
            <Route
              exact
              path="/system-configuration/platform-admin/tenant-management/:id/view"
              element={<ViewTenant />}
            />
            {/* TENANTS PATHS END */}
            <Route
              exact
              path="/system-configuration/platform-admin/roles-admin"
              element={<ListRole />}
            />
            <Route
              exact
              path="/system-configuration/platform-admin/roles-admin/:id/view"
              element={<ViewRoleDetail />}
            />
            {/* TENANTS PATHS */}
            {/* USERS ADMINISTRATION STARTS PATHS */}
            <Route
              exact
              path="/system-configuration/tenant-admin/roles"
              element={<ListUsersRoles />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/roles/create"
              element={<CreateUserRoles />}
            />
            {/* GEO ADMINISTRATION STARTS PATHS */}
            <Route
              exact
              path="/system-configuration/tenant-admin/geo-admin/territories/list"
              element={<ListTerritoryManagement />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/geo-admin/territories/create"
              element={<CreateTerritory />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/geo-admin/territories/:id/view"
              element={<TerritoryView />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/geo-admin/territories/:id/edit"
              element={<TerritoryEdit />}
            />
            {/* GEO ADMINISTRATION PATHS ENDS */}
            {/* RESOURCES PATHS */}
            <Route
              exact
              path={FACILITIES_PATH.CREATE}
              element={<CreateFacility />}
            />
            <Route
              exact
              path={FACILITIES_PATH.EDIT}
              element={<FacilityEdit />}
            />
            <Route
              exact
              path={FACILITIES_PATH.VIEW}
              element={<FacilityView />}
            />
            <Route
              exact
              path={FACILITIES_PATH.LIST}
              element={<ListFacility />}
            />
            {/* USERS ADMINISTRATION END PATHS */}
            <Route
              exact
              path="/system-configuration/platform-admin/user-administration/users/create"
              element={<CreateUser />}
            />
            <Route
              exact
              path="/system-configuration/platform-admin/user-administration/users"
              element={<ListUsers />}
            />
            <Route
              exact
              path="/system-configuration/platform-admin/user-administration/users/:id/edit"
              element={<UserEdit />}
            />
            <Route
              exact
              path="/system-configuration/platform-admin/user-administration/users/:id/reset-password"
              element={<PasswordReset />}
            />
            <Route
              exact
              path="/system-configuration/platform-admin/user-administration/users/:id"
              element={<ViewUser />}
            />
            {/* USERS ADMINISTRATION PATHS */}
            {/* DOCUMENTS PATHS*/}
            <Route
              exact
              path="/crm/accounts/:id/view/documents/notes/create"
              element={<CreateNotes />}
            />
            <Route
              exact
              path="/crm/accounts/:id/view/documents/notes/:noteId/edit"
              element={<EditNotes />}
            />
            {/*Location DOCUMENTS notes PATHS*/}
            <Route
              exact
              path="/crm/locations/:id/view/documents/notes/create"
              element={<LocationCreateNotes />}
            />
            <Route
              exact
              path="/crm/locations/:id/view/documents/notes"
              element={<LocationListNotes />}
            />
            <Route
              exact
              path="/crm/locations/:id/view/documents/notes/:noteId/view"
              element={<LocationViewNotes />}
            />
            <Route
              exact
              path="/crm/locations/:id/view/documents/notes/:noteId/edit"
              element={<LocationEditNote />}
            />
            {/* End Location Notes */}
            {/*Location DOCUMENTS attachments PATHS*/}
            <Route
              exact
              path="/crm/locations/:id/view/documents/attachments/create"
              element={<LocationAttachmentsAdd />}
            />
            <Route
              exact
              path="/crm/locations/:id/view/documents/attachments"
              element={<LocationAttachmentsList />}
            />
            <Route
              exact
              path="/crm/locations/:id/view/documents/attachments/:attachId/view"
              element={<LocationAttachmentsView />}
            />
            <Route
              exact
              path="/crm/locations/:id/view/documents/attachments/:attachId/edit"
              element={<LocationAttachmentsEdit />}
            />
            {/* End Location attachments */}
            {/* Location Direction Path Start*/}
            <Route
              exact
              path="/crm/locations/:locationId/directions/create"
              element={<LocationCreateDirection />}
            />
            <Route
              exact
              path="/crm/locations/:locationId/directions"
              element={<LocationListDirections />}
            />
            <Route
              exact
              path="/crm/locations/:locationId/directions/:directionId/view"
              element={<LocationViewDirections />}
            />
            <Route
              exact
              path="/crm/locations/:locationId/directions/:directionId/edit"
              element={<LocationEditDirection />}
            />
            {/*Location Direction Path End */}
            {/*Contact Donor Notes PATHS*/}
            <Route
              exact
              path="/crm/contacts/donor/:donorId/view/documents/notes/create"
              element={<DonorsCreateNotes />}
            />
            {/* <Route
              exact
              path="/crm/contacts/donor/:donorId/view/documents/notes"
              element={<DonorsListNotes />}
            />
            <Route
              exact
              path="/crm/contacts/donor/:donorId/view/documents/notes/:noteId/view"
              element={<DonorsViewNotes />}
            /> */}
            <Route
              exact
              path="/crm/contacts/donor/:donorId/view/documents/notes/:noteId/edit"
              element={<DonorsEditNote />}
            />
            {/* End Contact Donor Notes PATHS*/}
            {/*Contact Donor Attachments PATHS*/}
            <Route
              exact
              path="/crm/contacts/donor/:donorId/view/documents/attachments/create"
              element={<DonorsCreateAttachments />}
            />
            {/* <Route
              exact
              path="/crm/contacts/donor/:donorId/view/documents/attachments"
              element={<DonorsListAttachments />}
            />
            <Route
              exact
              path="/crm/contacts/donor/:donorId/view/documents/attachments/:attachId/view"
              element={<DonorsViewAttachments />}
            /> */}
            <Route
              exact
              path="/crm/contacts/donor/:donorId/view/documents/attachments/:attachId/edit"
              element={<DonorsEditAttachments />}
            />
            {/* End Contact Donor Attachments PATHS*/}
            {/*Contact Volunteer Notes PATHS*/}
            <Route
              exact
              path="/crm/contacts/volunteer/:volunteerId/view/documents/notes/create"
              element={<VolunteerCreateNotes />}
            />
            {/* <Route
              exact
              path="/crm/contacts/volunteer/:volunteerId/view/documents/notes"
              element={<VolunteerListNotes />}
            />
            <Route
              exact
              path="/crm/contacts/volunteer/:volunteerId/view/documents/notes/:noteId/view"
              element={<VolunteerViewNotes />}
            />
             */}
            <Route
              exact
              path="/crm/contacts/volunteer/:volunteerId/view/documents/notes/:noteId/edit"
              element={<VolunteerEditNote />}
            />
            {/* End Contact Volunteer Notes PATHS*/}
            {/*Contact Volunteer Attachments PATHS*/}
            <Route
              exact
              path="/crm/contacts/volunteer/:volunteerId/view/documents/attachments/create"
              element={<VolunteerAttachmentsAdd />}
            />
            {/* <Route
              exact
              path="/crm/contacts/volunteer/:volunteerId/view/documents/attachments"
              element={<VolunteerAttachmentsList />}
            />
            <Route
              exact
              path="/crm/contacts/volunteer/:volunteerId/view/documents/attachments/:attachId/view"
              element={<VolunteerAttachmentsView />}
            /> */}
            <Route
              exact
              path="/crm/contacts/volunteer/:volunteerId/view/documents/attachments/:attachId/edit"
              element={<VolunteerAttachmentsEdit />}
            />
            {/* End Contact Volunteer Attachments PATHS*/}
            {/* Contact Volunteer Duplicates Start */}
            {/* <Route
              exact
              path="/crm/contacts/volunteers/:volunteerId/view/duplicates"
              element={<VolunteerListDuplicates />}
            />
            */}
            {/* Contact Volunteer Duplicates End */}
            {/*Contact Staff Notes PATHS*/}
            <Route
              exact
              path="/crm/contacts/staff/:id/view/documents/notes/create"
              element={<StaffCreateNotes />}
            />
            {/* <Route
              exact
              path="/crm/contacts/staff/:id/view/documents/notes"
              element={<StaffListNotes />}
            />
            <Route
              exact
              path="/crm/contacts/staff/:id/view/documents/notes/:noteId/view"
              element={<StaffViewNotes />}
            /> */}
            <Route
              exact
              path="/crm/contacts/staff/:id/view/documents/notes/:noteId/edit"
              element={<StaffEditNote />}
            />
            {/* End Contact Staff Notes PATHS*/}
            {/*Contact Staff Attachments PATHS*/}
            <Route
              exact
              path="/crm/contacts/staff/:id/view/documents/attachments/create"
              element={<StaffAttachmentsAdd />}
            />
            {/* <Route
              exact
              path="/crm/contacts/staff/:id/view/documents/attachments"
              element={<StaffAttachmentsList />}
            />
            <Route
              exact
              path="/crm/contacts/staff/:id/view/documents/attachments/:attachId/view"
              element={<StaffAttachmentsView />}
            /> */}
            <Route
              exact
              path="/crm/contacts/staff/:id/view/documents/attachments/:attachId/edit"
              element={<StaffAttachmentsEdit />}
            />
            {/* End Contact Staff Attachments PATHS*/}
            {/*NCP Notes PATHS*/}
            <Route
              exact
              path="crm/non-collection-profiles/:id/documents/notes/create"
              element={<NCPCreateNotes />}
            />
            <Route
              exact
              path="crm/non-collection-profiles/:id/documents/notes"
              element={<NCPListNotes />}
            />
            <Route
              exact
              path="crm/non-collection-profiles/:id/documents/notes/:noteId/view"
              element={<NCPViewNotes />}
            />
            <Route
              exact
              path="crm/non-collection-profiles/:id/documents/notes/:noteId/edit"
              element={<NCPEditNote />}
            />
            {/* End NCP Notes PATHS*/}
            {/*NCP Attachment PATHS*/}
            <Route
              exact
              path="crm/non-collection-profiles/:id/documents/attachments/create"
              element={<NCPAttachmentsAdd />}
            />
            <Route
              exact
              path="crm/non-collection-profiles/:id/documents/attachments"
              element={<NCPAttachmentsList />}
            />
            <Route
              exact
              path="crm/non-collection-profiles/:id/documents/attachments/:attachId/view"
              element={<NCPAttachmentsView />}
            />
            <Route
              exact
              path="crm/non-collection-profiles/:id/documents/attachments/:attachId/edit"
              element={<NCPAttachmentsEdit />}
            />
            {/* End NCP Attachments PATHS*/}
            {/*Donor-center Notes PATHS*/}
            <Route
              exact
              path="/crm/donor-center/:id/view/documents/notes/create"
              element={<DonorCenterCreateNotes />}
            />
            <Route
              exact
              path="/crm/donor-center/:id/view/documents/notes"
              element={<DonorCenterListNotes />}
            />
            <Route
              exact
              path="/crm/donor-center/:id/view/documents/notes/:noteId/view"
              element={<DonorCenterViewNotes />}
            />
            <Route
              exact
              path="/crm/donor-center/:id/view/documents/notes/:noteId/edit"
              element={<DonorCenterEditNote />}
            />
            {/* End Donor center Notes PATHS*/}
            {/*Donor-center Attachments PATHS*/}
            <Route
              exact
              path="/crm/donor-center/:id/view/documents/attachments/create"
              element={<DonorCenterAttachmentsAdd />}
            />
            <Route
              exact
              path="/crm/donor-center/:id/view/documents/attachments"
              element={<DonorCenterAttachmentsList />}
            />
            <Route
              exact
              path="/crm/donor-center/:id/view/documents/attachments/:attachId/view"
              element={<DonorCenterAttachmentsView />}
            />
            <Route
              exact
              path="/crm/donor-center/:id/view/documents/attachments/:attachId/edit"
              element={<DonorCenterAttachmentsEdit />}
            />
            {/* End Donor center Attachments PATHS*/}
            {/* Start Donor center Session History PATHS*/}
            <Route
              exact
              path={DONOR_CENTERS_SESSION_HISTORY_PATH.LIST}
              element={<ListDonorCentersSessionHistory />}
            />
            {/* End Donor center Session History PATHS*/}
            <Route
              exact
              path="/crm/accounts/:id/view/documents/attachments/create"
              element={<CreateAttachments />}
            />
            <Route
              exact
              path="/crm/accounts/:id/view/documents/attachments/:attachId/edit"
              element={<EditAttachments />}
            />
            <Route
              exact
              path="/crm/locations/create"
              element={<LocationsCreate />}
            />
            <Route
              exact
              path="/crm/locations/:id/view"
              element={<ViewCrmLocartion />}
            />
            <Route
              exact
              path="/crm/locations/:id/edit"
              element={<EditCrmLocations />}
            />
            <Route
              exact
              path="/crm/locations/:id/view/duplicates"
              element={<DuplicateListLocation />}
            />
            <Route
              exact
              path="/crm/locations/:id/view/drive-history"
              element={<LocationHistoryList />}
            />
            <Route exact path="/crm/locations" element={<ListCrmLocations />} />
            {/* PLATFORM ADMIN PATHS START */}
            <Route
              exact
              path="/system-configuration/platform-admin/roles/create"
              element={<AddPlatformAdminRoles />}
            />
            <Route
              exact
              path="/system-configuration/platform-admin/roles/:id/edit"
              element={<EditPlatformAdminRoles />}
            />
            {/* PLATFORM ADMIN PATHS END */}
            {/* PRODUCTS & PROCEDURES PATH START */}
            <Route
              exact
              path="/system-configuration/tenant-admin/organization-admin/procedures/create"
              element={<CreateProcedures />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/organization-admin/procedures"
              element={<ListProcedures />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/organization-admin/procedures/:id/view"
              element={<ViewProcedure />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/organization-admin/procedures-types"
              element={<ListProcedureTypes />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/organization-admin/procedures-types/create"
              element={<CreateProcedureTypes />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/organization-admin/procedures-types/:id/edit"
              element={<EditProcedureTypes />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/organization-admin/procedures-types/:id/view"
              element={<ViewProcedureTypes />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/organization-admin/procedures/:id/view"
              element={<ViewProcedure />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/organization-admin/procedures/:id/edit"
              element={<EditProcedures />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/organization-admin/products"
              element={<ListProducts />}
            />
            {/* PRODUCTS & PROCEDURES PATH END */}
            {/* Device Type Routes*/}
            <Route
              exact
              path="/system-configuration/tenant-admin/organization-admin/resource/device-type"
              element={<DeviceTypeList />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/organization-admin/resource/device-type/create"
              element={<CreateDeviceType />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/organization-admin/resource/device-type/:id/view"
              element={<DeviceTypeView />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/organization-admin/resource/device-type/:id/edit"
              element={<UpdateDeviceType />}
            />
            {/* Device type Routes End*/}
            {/* CRM Administration Contacts Attachment Category Start */}
            <Route
              exact
              path="/system-configuration/tenant-admin/crm-admin/contacts/attachment-categories/create"
              element={<CreateAttachmentCategory />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/crm-admin/contacts/attachment-categories"
              element={<ListAttachmentCategory />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/crm-admin/contacts/attachment-categories/:id/view"
              element={<ViewAttachmentCategory />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/crm-admin/contacts/attachment-categories/:id/edit"
              element={<EditAttachmentCategory />}
            />
            {/* Contacts Attachment Category End */}
            {/* CRM Administration accounts Attachment Category Start */}
            <Route
              exact
              path="/system-configuration/tenant-admin/crm-admin/accounts/attachment-categories/create"
              element={<AccountsCreateAttachmentCategory />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/crm-admin/accounts/attachment-categories"
              element={<AccountsListAttachmentCategory />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/crm-admin/accounts/attachment-categories/:id/view"
              element={<AccountsViewAttachmentCategory />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/crm-admin/accounts/attachment-categories/:id/edit"
              element={<AccountsEditAttachmentCategory />}
            />
            {/* Accounts Attachment Category End */}
            {/* CRM Administration accounts Attachment SubCategory Start */}
            <Route
              exact
              path="/system-configuration/tenant-admin/crm-admin/accounts/attachment-subcategories/create"
              element={<AccountsCreateAttachmentSubCategory />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/crm-admin/accounts/attachment-subcategories"
              element={<AccountsListAttachmentSubCategory />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/crm-admin/accounts/attachment-subcategories/:id/view"
              element={<AccountsViewAttachmentSubCategory />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/crm-admin/accounts/attachment-subcategories/:id/edit"
              element={<AccountsEditAttachmentSubCategory />}
            />
            {/* accounts Attachment SubCategory End */}
            {/* CRM Administration Contacts Attachment SubCategory Start */}
            <Route
              exact
              path="/system-configuration/tenant-admin/crm-admin/contacts/attachment-subcategories/create"
              element={<CreateAttachmentSubCategory />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/crm-admin/contacts/attachment-subcategories"
              element={<ListAttachmentSubCategory />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/crm-admin/contacts/attachment-subcategories/:id/view"
              element={<ViewAttachmentSubCategory />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/crm-admin/contacts/attachment-subcategories/:id/edit"
              element={<EditAttachmentSubCategory />}
            />
            {/* Contacts Attachment SubCategory End */}
            {/*Dail Goals Calender Start*/}
            <Route
              exact
              path={`${DAILY_GOALS_CALENDAR.VIEW}`}
              element={<DailyGoalsCalenderView />}
            />
            <Route
              exact
              path={`${DAILY_GOALS_CALENDAR.EDIT}`}
              element={<DailyGoalsCalenderEdit />}
            />
            {/*Dail Goals Calender End*/}
            {/* ORGANIZATIONAL LEVEL PATH START */}
            <Route
              exact
              path="/system-configuration/organizational-levels"
              element={<ListOrganizationalLevels />}
            />
            <Route
              exact
              path="/system-configuration/organizational-levels/create"
              element={<CreateOrganizationalLevels />}
            />
            <Route
              exact
              path="/system-configuration/organizational-levels/:id/edit"
              element={<EditOrganizationalLevels />}
            />
            <Route
              exact
              path="/system-configuration/organizational-levels/:id"
              element={<ViewOrganizationalLevels />}
            />
            {/* ORGANIZATIONAL LEVEL PATH END */}
            {/* BUSINESS UNIT PATH START */}
            <Route
              exact
              path={BUSINESS_UNIT_PATH.LIST}
              element={<ListBusinessUnits />}
            />
            <Route
              exact
              path={BUSINESS_UNIT_PATH.VIEW}
              element={<ViewBusinessUnit />}
            />
            <Route
              exact
              path={BUSINESS_UNIT_PATH.CREATE}
              element={<CreateBusinessUnit />}
            />
            <Route
              exact
              path={BUSINESS_UNIT_PATH.EDIT}
              element={<EditBusinessUnit />}
            />
            {/* BUSINESS UNIT PATH END */}
            {/* RESOURCES - DEVICE PATH START */}
            <Route
              exact
              path="/system-configuration/tenant-admin/organization-admin/resources/devices"
              element={<ListDevices />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/organization-admin/resources/devices/create"
              element={<CreateDevice />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/organization-admin/resources/devices/:id/view"
              element={<ViewDevice />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/organization-admin/resources/devices/:id/edit"
              element={<EditDevice />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/organization-admin/resources/devices/:id/maintenance"
              element={<ListDeviceMaintenance />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/organization-admin/resources/devices/:id/schedule-maintenance"
              element={<ScheduleDeviceMaintenance />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/organization-admin/resources/devices/:id/schedule-retirement"
              element={<ScheduleDeviceReitrement />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/organization-admin/resources/devices/:id/share"
              element={<ShareDevice />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/organization-admin/resources/devices/:id/sharing"
              element={<ListDeviceShare />}
            />
            {/* RESOURCES - DEVICE PATH END */}
            {/* RESOURCES - VEHICLE TYPE PATH START */}
            <Route
              exact
              path="/system-configuration/tenant-admin/organization-admin/resources/vehicle-types"
              element={<ListVehicleTypes />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/organization-admin/resources/vehicle-types/create"
              element={<CreateVehicleType />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/organization-admin/resources/vehicle-types/:id/view"
              element={<ViewVehicleType />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/organization-admin/resources/vehicle-types/:id/edit"
              element={<EditVehicleType />}
            />
            {/* RESOURCES - VEHICLE TYPE PATH END */}
            {/* RESOURCES - VEHICLES PATH START */}
            <Route
              exact
              path="/system-configuration/tenant-admin/organization-admin/resources/vehicles"
              element={<ListVehicle />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/organization-admin/resources/vehicles/create"
              element={<CreateVehicle />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/organization-admin/resources/vehicles/:id/view"
              element={<ViewVehicle />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/organization-admin/resources/vehicles/:id/edit"
              element={<EditVehicle />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/organization-admin/resources/vehicles/:id/maintenance"
              element={<ListVehicleMaintenance />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/organization-admin/resources/vehicles/:id/schedule-maintenance"
              element={<ScheduleVehicleMaintenance />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/organization-admin/resources/vehicles/:id/schedule-maintenance/:maintenanceId"
              element={<ScheduleVehicleMaintenance />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/organization-admin/resources/vehicles/:id/sharing"
              element={<ListVehicleShare />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/organization-admin/resources/vehicles/:id/share"
              element={<ShareVehicle />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/organization-admin/resources/vehicles/:id/share/:shareId"
              element={<ShareVehicle />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/organization-admin/resources/vehicles/:id/schedule-retirement"
              element={<ScheduleVehicleRetirement />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/crm-admin/accounts/note-categories/create"
              element={<AccountAddNoteCategory />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/crm-admin/accounts/note-categories/:id"
              element={<AccountViewNoteCategory />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/crm-admin/accounts/note-categories/:id/edit"
              element={<AccountEditNoteCategory />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/crm-admin/accounts/note-categories/list"
              element={<AccountNoteCategoryList />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/crm-admin/accounts/note-subcategories/create"
              element={<AccountCreateNoteSubCategory />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/crm-admin/accounts/note-subcategories/list"
              element={<AccountNoteSubCategoryList />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/crm-admin/accounts/note-subcategories/:id"
              element={<AccountViewNoteSubCategory />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/crm-admin/accounts/note-subcategories/:id/edit"
              element={<AccountEditNoteSubCategory />}
            />
            {/* RESOURCES - VEHICLES PATH END */}
            {/* CRM ADMINISTRATION Affiliation PATHS */}
            <Route
              exact
              path="/system-configuration/tenant-admin/crm-admin/accounts/affiliations/create"
              element={<CreateAffiliation />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/crm-admin/accounts/affiliations"
              element={<ListAffiliations />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/crm-admin/accounts/affiliations/:id/edit"
              element={<AffiiliationEdit />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/crm-admin/accounts/affiliations/:id"
              element={<ViewAffiliations />}
            />
            {/* CRM ADMINISTRATION Affiliation PATHS END*/}
            {/* STAFFING ADMINISTRATION CLASSIFICATIONS PATHS START*/}
            <Route
              exact
              path={CLASSIFICATIONS_PATH.CREATE}
              element={<CreateClassification />}
            />
            <Route
              exact
              path={CLASSIFICATIONS_PATH.LIST}
              element={<ListClassifications />}
            />
            <Route
              exact
              path={CLASSIFICATIONS_PATH.VIEW}
              element={<ViewClassification />}
            />
            <Route
              exact
              path={CLASSIFICATIONS_PATH.EDIT}
              element={<EditClassification />}
            />
            {/* STAFFING ADMINISTRATION CLASSIFICATIONS PATHS END*/}
            {/* STAFFING ADMINISTRATION CLASSIFICATIONS SETTINGS PATHS START*/}
            <Route
              exact
              path={SETTINGS_CLASSIFICATIONS_PATH.VIEW}
              element={<ViewSetting />}
            />
            {/* STAFFING ADMINISTRATION CLASSIFICATIONS SETTINGS PATHS END*/}
            <Route
              exact
              path={SETTINGS_CLASSIFICATIONS_PATH.CREATE}
              element={<CreateSettings />}
            />
            <Route
              exact
              path={SETTINGS_CLASSIFICATIONS_PATH.LIST}
              element={<ListSetting />}
            />
            <Route
              exact
              path={SETTINGS_CLASSIFICATIONS_PATH.EDIT}
              element={<SettingEdit />}
            />
            {/* STAFFING ADMINISTRATION TEAMS PATHS START*/}
            <Route exact path={TEAMS_PATH.LIST} element={<ListTeams />} />
            <Route exact path={TEAMS_PATH.VIEW} element={<ViewTeam />} />
            <Route exact path={TEAMS_PATH.EDIT} element={<TeamEdit />} />
            <Route exact path={TEAMS_PATH.CREATE} element={<CreateTeam />} />
            {/* STAFFING ADMINISTRATION TEAMS PATHS END*/}
            {/* CALENDAR - BANNERS PATH START */}
            <Route
              exact
              path="/system-configuration/tenant-admin/operations-admin/calendar/banners"
              element={<ListBanners />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/operations-admin/calendar/banners/create"
              element={<CreateBanner />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/operations-admin/calendar/banners/:id/view"
              element={<ViewBanner />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/operations-admin/calendar/banners/:id/edit"
              element={<EditBanner />}
            />
            {/* CALENDAR - BANNERS PATH END */}
            {/* CALENDAR - LOCK DATES PATH START */}
            <Route
              exact
              path="/system-configuration/tenant-admin/operations-admin/calendar/lock-dates"
              element={<ListLockDates />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/operations-admin/calendar/lock-dates/create"
              element={<CreateLockDate />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/operations-admin/calendar/lock-dates/:id/view"
              element={<ViewLockDate />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/operations-admin/calendar/lock-dates/:id/edit"
              element={<EditLockDate />}
            />
            {/* CALENDAR - LOCK DATES PATH END */}
            {/* CALENDAR - CLOSED DATES PATH START */}
            <Route
              exact
              path="/system-configuration/tenant-admin/operations-admin/calendar/close-dates"
              element={<ListCloseDates />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/operations-admin/calendar/close-dates/create"
              element={<CreateCloseDate />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/operations-admin/calendar/close-dates/:id/view"
              element={<ViewCloseDate />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/operations-admin/calendar/close-dates/:id/edit"
              element={<EditCloseDate />}
            />
            {/* CALENDAR - CLOSED DATES PATH END */}
            {/* Marketing Equipment - Marketing MATERIAL PATH START */}
            <Route
              exact
              path="/system-configuration/tenant-admin/operations-admin/marketing-equipment/marketing-material/create"
              element={<CreateMarketingMaterial />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/operations-admin/marketing-equipment/marketing-material/list"
              element={<ListMarketingMaterial />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/operations-admin/marketing-equipment/marketing-material/:id/edit"
              element={<EditMarketingMaterial />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/operations-admin/marketing-equipment/marketing-material/:id/view"
              element={<ViewMarketingMaterial />}
            />
            {/* Marketing Equipment - Marketing MATERIAL PATH END */}
            {/* Monthly Goals Routes*/}
            <Route
              exact
              path={MONTHLY_GOALS_PATH.LIST}
              element={<MonthlyGoalsList />}
            />
            <Route
              exact
              path={MONTHLY_GOALS_PATH.CREATE}
              element={<CreateMonthlyGoal />}
            />
            <Route
              exact
              path={MONTHLY_GOALS_PATH.VIEW}
              element={<ViewMonthlyGoal />}
            />
            <Route
              exact
              path={MONTHLY_GOALS_PATH.EDIT}
              element={<EditMonthlyGoal />}
            />
            {/* Monthly Goals Routes End*/}
            <Route
              exact
              path={GOALS_PERFORMANCE_RULES.VIEW}
              element={<ViewGoalsPerformanceRules />}
            />
            <Route
              exact
              path={GOALS_PERFORMANCE_RULES.EDIT}
              element={<EditGoalsPerformanceRules />}
            />
            {/* Goals Performance Rules Routes End*/}
            {/* Daily Goals Allocation Routes*/}
            <Route
              exact
              path={DAILY_GOALS_ALLOCATION_PATH.LIST}
              element={<DailyGoalsAllocationList />}
            />
            <Route
              exact
              path={DAILY_GOALS_ALLOCATION_PATH.CREATE}
              element={<CreateDailyGoalsAllocation />}
            />
            <Route
              exact
              path={DAILY_GOALS_ALLOCATION_PATH.EDIT}
              element={<EditDailyGoalsAllocation />}
            />
            <Route
              exact
              path={DAILY_GOALS_ALLOCATION_PATH.VIEW}
              element={<ViewDailyGoalsAllocation />}
            />
            {/* Daily Goals Allocation Routes End*/}
            {/* ADS PATH START */}
            <Route
              exact
              path="/system-configuration/tenant-admin/organizational-admin/content-management-system/ads/create"
              element={<CreateAds />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/organizational-admin/content-management-system/ads/list"
              element={<ListAds />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/organizational-admin/content-management-system/ads/:id/edit"
              element={<EditAds />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/organizational-admin/content-management-system/ads/:id/view"
              element={<ViewAds />}
            />
            {/* ADS PATH END */}
            {/* CUSTOM FIELD START */}
            <Route
              exact
              path="/system-configuration/tenant-admin/organizational-admin/custom-fields/list"
              element={<CustomFieldsList />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/organizational-admin/custom-fields/create"
              element={<CreateCustomFields />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/organizational-admin/custom-fields/:id/edit"
              element={<EditCustomFields />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/organizational-admin/custom-fields/:id/view"
              element={<ViewCustomFields />}
            />
            {/* CUSTOM FIELD END */}
            {/* INDUSTRY CATEGORIES PATH START*/}
            <Route
              exact
              path="/system-configuration/tenant-admin/crm-admin/accounts/industry-categories"
              element={<ListIndustryCategories />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/crm-admin/accounts/industry-categories/create"
              element={<CreateIndustryCategories />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/crm-admin/accounts/industry-categories/:id/view"
              element={<ViewIndustryCategories />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/crm-admin/accounts/industry-categories/:id/edit"
              element={<EditIndustryCategories />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/crm-admin/accounts/industry-subcategories"
              element={<ListIndustrySubCategories />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/crm-admin/accounts/industry-subcategories/create"
              element={<CreateIndustrySubCategories />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/crm-admin/accounts/industry-subcategories/:id/view"
              element={<ViewIndustrySubCategories />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/crm-admin/accounts/industry-subcategories/:id/edit"
              element={<EditIndustrySubCategories />}
            />
            {/* INDUSTRY CATEGORIES PATH END*/}
            {/* Contact Role Start */}
            <Route
              exact
              path="/system-configuration/tenant-admin/crm-admin/contacts/roles/create"
              element={<ContactRoleCreate />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/crm-admin/contacts/roles/list"
              element={<ContactRoleList />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/crm-admin/contacts/roles/:id"
              element={<ContactRoleUpdate />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/crm-admin/contacts/roles/:id/view"
              element={<ContactRoleView />}
            />
            {/* Contact Role End */}
            {/* RESOURCES - VEHICLES PATH END */}
            {/* Note Categories PATH START */}
            <Route
              exact
              path="/system-configuration/tenant-admin/crm-admin/contacts/note-categories/list"
              element={<ContactsNoteCategoriesList />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/crm-admin/contacts/note-categories/create"
              element={<ContactsNoteCategoryAdd />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/crm-admin/contacts/note-categories/view/:id"
              element={<ContactsNoteCategoryView />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/crm-admin/contacts/note-categories/edit/:id"
              element={<ContactsNoteCategoryEdit />}
            />
            {/* Note Categories PATH End */}
            {/* Note Sub Categories PATH START */}
            <Route
              exact
              path="/system-configuration/tenant-admin/crm-admin/contacts/note-subcategories/list"
              element={<ContactsNoteSubCategoriesList />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/crm-admin/contacts/note-subcategories/create"
              element={<ContactsNoteSubCategoryAdd />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/crm-admin/contacts/note-subcategories/view/:id"
              element={<ContactsNoteSubCategoryView />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/crm-admin/contacts/note-subcategories/edit/:id"
              element={<ContactsNoteSubCategoryEdit />}
            />
            {/* Note Sub Categories PATH End */}
            <Route
              exact
              path="/system-configuration/reports"
              element={<Reports />}
            />
            {/* Booking Drives */}
            {/* Booking Rules */}
            <Route
              exact
              path="/system-configuration/operations-admin/booking-drives/booking-rule"
              element={<BookingRules />}
            />
            <Route
              exact
              path="/system-configuration/operations-admin/booking-drives/booking-rule/create"
              element={<CreateBookingRules />}
            />
            {/* Daliy Capacity */}
            {/* Create  Daliy Capacity */}
            <Route
              exact
              path="/system-configuration/operations-admin/booking-drives/daily-capacities"
              element={<DailyCapacity />}
            />
            <Route
              exact
              path="/system-configuration/operations-admin/booking-drives/daily-capacities/create"
              element={<CreateDailyCapacity />}
            />
            <Route
              exact
              path="/system-configuration/operations-admin/booking-drives/daily-capacities/:id"
              element={<EditDailyCapacity />}
            />
            <Route
              exact
              path="/system-configuration/operations-admin/booking-drives/daily-capacities/:schedule/:id"
              element={<EditDailyCapacity />}
            />
            <Route
              exact
              path="/system-configuration/operations-admin/booking-drives/daily-hours"
              element={<DailyHour />}
            />
            <Route
              exact
              path="/system-configuration/operations-admin/booking-drives/daily-hours/create"
              element={<CreateDailyHour />}
            />
            <Route
              exact
              path="/system-configuration/operations-admin/booking-drives/daily-hours/:id"
              element={<EditDailyHourPage />}
            />
            <Route
              exact
              path="/system-configuration/operations-admin/booking-drives/daily-hours/:schedule/:id"
              element={<EditDailyHourPage />}
            />
            {/* Booking Rules End */}
            {/* Task Management Start */}
            <Route
              exact
              path="/system-configuration/tenant-admin/operations-admin/booking-drives/task-management/create"
              element={<CreateTask />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/operations-admin/booking-drives/task-management/:id"
              element={<EditTask />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/operations-admin/booking-drives/task-management/view/:id"
              element={<ViewTask />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/operations-admin/booking-drives/task-management/list"
              element={<ListTask />}
            />
            {/* Task Management End */}
            {/* Start Tasks */}
            <Route
              exact
              path="/system-configuration/tasks"
              element={<TasksList />}
            />
            <Route
              exact
              path="/system-configuration/tasks/create"
              element={<TasksCreate />}
            />
            <Route
              exact
              path="/system-configuration/tasks/:id/view"
              element={<TasksView />}
            />
            <Route
              exact
              path="/system-configuration/tasks/:id/edit"
              element={<TasksEdit />}
            />
            {/* End Tasks */}
            {/* Start Account Tasks */}
            <Route
              exact
              path={ACCOUNT_TASKS_PATH.CREATE}
              element={<AccountTasksCreate />}
            />
            <Route
              exact
              path={ACCOUNT_TASKS_PATH.EDIT}
              element={<AccountTasksEdit />}
            />
            <Route
              exact
              path={ACCOUNT_TASKS_PATH.VIEW}
              element={<AccountTasksView />}
            />
            {/* End Account Tasks */}
            {/* Start Location Tasks */}
            <Route
              exact
              path={LOCATIONS_TASKS_PATH.LIST}
              element={<LocationsTasksList />}
            />
            <Route
              exact
              path={LOCATIONS_TASKS_PATH.CREATE}
              element={<LocationsTasksCreate />}
            />
            <Route
              exact
              path={LOCATIONS_TASKS_PATH.EDIT}
              element={<LocationsTasksEdit />}
            />
            <Route
              exact
              path={LOCATIONS_TASKS_PATH.VIEW}
              element={<LocationsTasksView />}
            />
            {/* End Location Tasks */}
            {/* Start Donor Tasks */}
            <Route
              exact
              path={DONOR_TASKS_PATH.CREATE}
              element={<DonorTasksCreate />}
            />
            <Route
              exact
              path={DONOR_TASKS_PATH.EDIT}
              element={<DonorTasksEdit />}
            />
            {/* End Donor Tasks */}
            {/* Start Donor Donation History */}
            {/* End Donor Donation Histor */}
            {/* Start staff Tasks */}
            <Route
              exact
              path={STAFF_TASKS_PATH.CREATE}
              element={<StaffTasksCreate />}
            />
            <Route
              exact
              path={STAFF_TASKS_PATH.EDIT}
              element={<StaffTasksEdit />}
            />
            {/* End staff Tasks */}
            {/* Start Sessions Tasks */}
            <Route
              exact
              path={SESSION_TASKS_PATH.CREATE}
              element={<SessionsTasksCreate />}
            />
            <Route
              exact
              path={SESSION_TASKS_PATH.LIST}
              element={<SessionsTasksList />}
            />
            <Route
              exact
              path={SESSION_TASKS_PATH.EDIT}
              element={<SessionsTasksEdit />}
            />
            <Route
              exact
              path={SESSION_TASKS_PATH.VIEW}
              element={<SessionsTasksView />}
            />
            {/* End Sessions Tasks */}
            {/* Start Sessions Staffing */}
            <Route
              exact
              path={SESSION_STAFFING_PATH.LIST}
              element={<SessionsStaffingList />}
            />
            {/* End Sessions Staffing */}
            {/* Start Non-Collection Events Tasks */}
            <Route
              exact
              path={OPERATIONS_CENTER_NON_COLLECTION_EVENTS_TASKS.CREATE}
              element={<NonCollectionEventsTasksCreate />}
            />
            <Route
              exact
              path={OPERATIONS_CENTER_NON_COLLECTION_EVENTS_TASKS.LIST}
              element={<NonCollectionEventsTasksList />}
            />
            <Route
              exact
              path={OPERATIONS_CENTER_NON_COLLECTION_EVENTS_TASKS.EDIT}
              element={<NonCollectionEventsTasksEdit />}
            />
            <Route
              exact
              path={OPERATIONS_CENTER_NON_COLLECTION_EVENTS_TASKS.VIEW}
              element={<NonCollectionEventsTasksView />}
            />
            {/* End Non-Collection Events Tasks */}
            <Route
              exact
              path={OPERATIONS_CENTER_NON_COLLECTION_EVENTS_STAFFING.LIST}
              element={<NonCollectionEventsStaffingList />}
            />
            {/* Start Volunteer Tasks */}
            <Route
              exact
              path={CRM_VOLUNTEER_TASKS_PATH.CREATE}
              element={<VolunteerTasksCreate />}
            />
            <Route
              exact
              path={CRM_VOLUNTEER_TASKS_PATH.EDIT}
              element={<VolunteerTasksEdit />}
            />
            {/* End Volunteer Tasks */}
            {/* Start Donor Cneters Tasks */}
            <Route
              exact
              path={DONOR_CENTERS_TASKS_PATH.LIST}
              element={<DonorCentersTasksList />}
            />
            <Route
              exact
              path={DONOR_CENTERS_TASKS_PATH.CREATE}
              element={<DonorCentersTasksCreate />}
            />
            <Route
              exact
              path={DONOR_CENTERS_TASKS_PATH.EDIT}
              element={<DonorCentersTasksEdit />}
            />
            <Route
              exact
              path={DONOR_CENTERS_TASKS_PATH.VIEW}
              element={<DonorCentersTasksView />}
            />
            {/* End  Donor Cneters Tasks */}
            {/* Start Non Collection Profiles Tasks */}
            <Route
              exact
              path={CRM_NON_COLLECTION_PROFILES_TASKS_PATH.LIST}
              element={<NonCollectionProfilesTasksList />}
            />
            <Route
              exact
              path={CRM_NON_COLLECTION_PROFILES_TASKS_PATH.CREATE}
              element={<NonCollectionProfilesTasksCreate />}
            />
            <Route
              exact
              path={CRM_NON_COLLECTION_PROFILES_TASKS_PATH.EDIT}
              element={<NonCollectionProfilesTasksEdit />}
            />
            <Route
              exact
              path={CRM_NON_COLLECTION_PROFILES_TASKS_PATH.VIEW}
              element={<NonCollectionProfilesTasksView />}
            />
            {/* End Non Collection Profiles Tasks */}
            {/* Start Drives Tasks */}
            <Route
              exact
              path={DRIVES_TASKS_PATH.LIST}
              element={<DrivesTasksList />}
            />
            <Route
              exact
              path={DRIVES_TASKS_PATH.CREATE}
              element={<DrivesTasksCreate />}
            />
            <Route
              exact
              path={OPERATIONS_CENTER_APPROVALS_PATH.BEGINAPPROVAL}
              element={<ApprovalsBeginApproval />}
            />
            <Route
              exact
              path={OPERATIONS_CENTER_CALENDAR_PATH.VIEWCALENDAR}
              element={<CalendarView />}
            />
            <Route
              exact
              path={DRIVES_TASKS_PATH.EDIT}
              element={<DrivesTasksEdit />}
            />
            <Route
              exact
              path={DRIVES_TASKS_PATH.VIEW}
              element={<DrivesTasksView />}
            />
            {/* End Non Collection Profiles Tasks */}
            {/* Start Drives Staffing */}
            <Route
              exact
              path={DRIVES_STAFFING_PATH.LIST}
              element={<DrivesStaffingList />}
            />
            {/* End Drives Staffing */}
            {/* Operation Status */}
            <Route
              exact
              path="/system-configuration/operations-admin/booking-drives/operation-status/create"
              element={<CreateOperationsStatus />}
            />
            <Route
              exact
              path="/system-configuration/operations-admin/booking-drives/operation-status"
              element={<ListOperationStatus />}
            />
            <Route
              exact
              path="/system-configuration/operations-admin/booking-drives/operation-status/:id"
              element={<ViewOperationStatus />}
            />
            <Route
              exact
              path="/system-configuration/operations-admin/booking-drives/operation-status/:id/edit"
              element={<EditOperationStatus />}
            />
            {/* Operation Note Attachment Note Category start */}
            <Route
              exact
              path="/system-configuration/tenant-admin/operations-admin/notes-attachments/note-categories/create"
              element={<NotesAttachmentCreateNoteCategory />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/operations-admin/notes-attachments/note-categories/list"
              element={<NotesAttachmentNoteCategoryList />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/operations-admin/notes-attachments/note-categories/:id"
              element={<NotesAttachmentViewNoteCategory />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/operations-admin/notes-attachments/note-categories/:id/edit"
              element={<NotesAttachmentEditNoteCategory />}
            />
            <Route
              exact
              path={CRM_NON_COLLECTION_PROFILES_EVENT_HISTORY_PATH.LIST}
              element={<EventHistory />}
            />
            {/* Operation Note Attachment Note Category end */}
            {/* Operation Note Attachment Note Sub Category start */}
            <Route
              exact
              path="/system-configuration/tenant-admin/operations-admin/notes-attachments/note-subcategories/create"
              element={<NotesAttachmentCreateNoteSubCategory />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/operations-admin/notes-attachments/note-subcategories/list"
              element={<NotesAttachmentNoteSubCategoryList />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/operations-admin/notes-attachments/note-subcategories/:id"
              element={<NotesAttachmentViewNoteSubCategory />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/operations-admin/notes-attachments/note-subcategories/:id/edit"
              element={<NotesAttachmentEditNoteSubCategory />}
            />
            {/* Operation Note Attachment Note Sub Category end */}
            {/* Operation NCE Category start */}
            <Route
              exact
              path="/system-configuration/tenant-admin/operations-admin/nce-categories/create"
              element={<CreateNceCategory />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/operations-admin/nce-categories/list"
              element={<NceCategoryList />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/operations-admin/nce-categories/:id"
              element={<NceCategory />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/operations-admin/nce-categories/:id/edit"
              element={<EditNceCategory />}
            />
            {/* Operation NCE Category end */}
            {/* Operation NCE SubCategory start */}
            <Route
              exact
              path="/system-configuration/tenant-admin/operations-admin/nce-subcategories/create"
              element={<CreateNceSubCategory />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/operations-admin/nce-subcategories/list"
              element={<NceSubCategoryList />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/operations-admin/nce-subcategories/:id"
              element={<ViewNceSubCategory />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/operations-admin/nce-subcategories/:id/edit"
              element={<EditNceSubCategory />}
            />
            {/* Operation NCE SubCategory end */}
            {/* Operation End */}
            {/* Booking Drives End */}
            {/* Stage Start */}
            <Route
              exact
              path="/system-configuration/tenant-admin/crm-admin/accounts/stages"
              element={<StagingList />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/crm-admin/accounts/stages/create"
              element={<CreateStage />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/crm-admin/accounts/stages/:id/edit"
              element={<CreateStage />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/crm-admin/accounts/stages/:id"
              element={<View />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/crm-admin/accounts/stages/edit"
              element={<CreateStage />}
            />
            {/* SOURCES PATH START */}
            <Route
              exact
              path="/system-configuration/tenant-admin/crm-admin/accounts/sources"
              element={<ListSource />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/crm-admin/accounts/sources/create"
              element={<AddSource />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/crm-admin/accounts/sources/:id/view"
              element={<ViewSource />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/crm-admin/accounts/sources/:id/edit"
              element={<EditSource />}
            />
            {/* SOURCES PATH END */}
            {/* staff-setup-start */}
            <Route
              exact
              path={STAFF_SETUP.CREATE}
              element={<CreateUpdateStaffSetup />}
            />
            <Route
              exact
              path={STAFF_SETUP.EDIT}
              element={<CreateUpdateStaffSetup />}
            />
            <Route exact path={STAFF_SETUP.LIST} element={<ListStaffSetup />} />
            <Route
              exact
              path={STAFF_SETUP.VIEW}
              element={<ViewDetailOfStafSetup />}
            />
            {/* staff-setup-end */}
            {/* Stage End */}
            {/* PROMOTIONS PATH START */}
            <Route
              exact
              path="/system-configuration/tenant-admin/operations-admin/marketing-equipment/promotions"
              element={<ListPromotions />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/operations-admin/marketing-equipment/promotions/create"
              element={<CreatePromotion />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/operations-admin/marketing-equipment/promotions/:id/edit"
              element={<EditPromotion />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/operations-admin/marketing-equipment/promotions/:id/view"
              element={<ViewPromotion />}
            />
            {/* PROMOTIONS PATH END */}
            {/* PROMOTIONS ITEMS PATH START */}
            <Route
              exact
              path="/system-configuration/tenant-admin/operations-admin/marketing-equipment/promotional-items/create"
              element={<CreatePromotionalItem />}
            />
            {/* PROMOTIONS ITEMS PATH END */}
            <Route
              exact
              path="/system-configuration/tenant-admin/staffing-admin/leave-types/list"
              element={<LeaveType />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/staffing-admin/leave-types/create"
              element={<EditOrCreateLeave />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/staffing-admin/leave-types/:id/edit"
              element={<EditOrCreateLeave />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/staffing-admin/leave-types/:id"
              element={<ViewLeave />}
            />
            {/* CALENDAR - GOAL VARIANCE PATH Start */}
            <Route
              exact
              path="/system-configuration/tenant-admin/operations-admin/calendar/goal-variance"
              element={<ViewGoalVariance />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/operations-admin/calendar/goal-variance/create"
              element={<CreateGoalVariance />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/operations-admin/calendar/goal-variance/edit"
              element={<EditGoalVariance />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/user-admin/users/create"
              element={<CreateUsers />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/user-admin/users/:id/edit"
              element={<EditUsers />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/user-admin/users"
              element={<UsersLists />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/user-admin/users/:id/view"
              element={<ViewSingleUser />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/user-admin/users/:id/reset-password"
              element={<ResetUserPassword />}
            />
            {/* CALENDAR - GOAL VARIANCE PATH END */}
            {/* LOCATION - ATTACHMENT CATEGORY PATH START */}
            <Route
              exact
              path="/system-configuration/tenant-admin/crm-admin/location/attachment-categories/list"
              element={<ListLocationAttachmentCategories />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/crm-admin/location/attachment-categories/create"
              element={<CreateAttachment />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/crm-admin/location/attachment-categories/:id"
              element={<ViewAttachment />}
            />
            <Route
              exact
              path="/system-configuration/tenant-admin/crm-admin/location/attachment-categories/:id/edit"
              element={<CategoryUpsert />}
            />
            {/* LOCATION - ATTACHMENT CATEGORY PATH END */}
            {/* CRM - ACCOUNT SECTION PATHS START */}
            <Route exact path="/crm/accounts" element={<ListAccounts />} />
            <Route
              exact
              path="/crm/accounts/create"
              element={<CreateAccount />}
            />
            <Route
              exact
              path="/crm/accounts/:account_id/edit"
              element={<EditAccount />}
            />
            <Route
              exact
              path="/crm/accounts/:account_id/*"
              element={<ViewAccount />}
            />
            {/* CRM - ACCOUNT SECTION PATHS END */}
            {/* CRM - CONTACTS SECTION PATHS START */}
            <Route
              exact
              path="/crm/contacts/volunteers"
              element={<ListVolunteers />}
            />
            <Route
              exact
              path="/crm/contacts/volunteers/create"
              element={<CreateVolunteer />}
            />
            <Route
              exact
              path="/crm/contacts/volunteers/:volunteerId/edit"
              element={<CreateVolunteer />}
            />
            {/* <Route
              exact
              path="/crm/contacts/volunteers/:volunteerId/view"
              element={<ViewVolunteer />}
            />
            <Route
              exact
              path="/crm/contacts/volunteers/:volunteerId/view/communication"
              element={<ListVolunteerCommunication />}
            />
            <Route
              exact
              path="/crm/contacts/volunteers/:volunteerId/view/communication/:id/view"
              element={<ViewVolunteerCommunication />}
            /> */}
            {/* CRM - CONTACTS SECTION PATHS END */}
            {/* CRM - DONOR SECTION PATHS START */}
            <Route exact path="/crm/contacts/donor" element={<ListDonors />} />
            {/*<Route
              exact
              path="/crm/contacts/donor/:donorId/view"
              element={<ViewDonor />}
            /> */}
            <Route
              exact
              path="/crm/contacts/donor/create"
              element={<CreateDonor />}
            />
            <Route
              exact
              path="/crm/contacts/donor/:donorId/edit"
              element={<CreateDonor />}
            />
            {/* <Route
              exact
              path="/crm/contacts/donor/:donorId/view/duplicates"
              element={<DonorDuplicatesList />}
            />*/}
            {/* CRM - DONOR SECTION PATHS END */}
            {/* CRM - NCP PROFILE SECTION PATHS START */}
            <Route
              exact
              path={CRM_NON_COLLECTION_PROFILES_PATH.VIEW}
              element={<AboutView />}
            />
            <Route
              exact
              path={CRM_NON_COLLECTION_PROFILES_PATH.CREATE}
              element={<CreateProfile />}
            />
            <Route
              exact
              path={CRM_NON_COLLECTION_PROFILES_PATH.LIST}
              element={<ListProfile />}
            />
            <Route
              exact
              path={CRM_NON_COLLECTION_PROFILES_PATH.EDIT}
              element={<EditProfile />}
            />
            {/* CRM - NCP PROFILE SECTION PATHS END */}
            {/* CRM - NCP BLUEPRINTS SECTION PATHS START */}
            <Route
              exact
              path={CRM_NON_COLLECTION_PROFILES_BLUEPRINTS_PATH.CREATE}
              element={<NonCollectionProfilesBlueprintsCreate />}
            />
            <Route
              exact
              path={CRM_NON_COLLECTION_PROFILES_BLUEPRINTS_PATH.EDIT}
              element={<NonCollectionProfilesBlueprintsEdit />}
            />
            <Route
              exact
              path={CRM_NON_COLLECTION_PROFILES_BLUEPRINTS_PATH.LIST}
              element={<NonCollectionProfilesBlueprintsList />}
            />
            <Route
              exact
              path={CRM_NON_COLLECTION_PROFILES_BLUEPRINTS_PATH.VIEW}
              element={<NonCollectionProfilesBlueprintsView />}
            />
            <Route
              exact
              path={CRM_NON_COLLECTION_PROFILES_BLUEPRINTS_PATH.SHIFT_DETAILS}
              element={<NonCollectionProfilesBlueprintsDetailsShift />}
            />
            {/* CRM - NCP BLUEPRINTS SECTION PATHS END */}
            {/* CRM - STAFF SECTION PATHS START */}
            <Route exact path="/crm/contacts/staff" element={<ListStaff />} />
            <Route
              exact
              path="/crm/contacts/staff/create"
              element={<CreateStaff />}
            />
            {/* <Route
              exact
              path="/crm/contacts/staff/:staffId/view"
              element={<ViewStaff />}
            /> */}
            <Route
              exact
              path="/crm/contacts/staff/:id/edit"
              element={<CreateStaff />}
            />
            {/* CRM - STAFF SECTION PATHS END */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/impersonate-login" element={<Login />} />
          <Route exact path="/signup" element={<Signup />} />
          {/* //  Catch all other routes */}
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/not-found" element={<NotFoundPage />} />
          {/* USERS ADMINISTRATION STARTS PATHS */}
          <Route
            exact
            path={USER_ROLES.LIST}
            element={<TenantUserRolesList />}
          />
          <Route exact path={USER_ROLES.CREATE} element={<UserRoleCreate />} />
          <Route
            exact
            path={USER_ROLES.VIEW}
            element={<TenantUserRolesView />}
          />
          <Route
            exact
            path={USER_ROLES.EDIT}
            element={<TenantUserRolesEdit />}
          />
          <Route
            exact
            path={USER_ROLES.ASSIGN}
            element={<TenantUserAssignedRole />}
          />
          {/* GEO ADMINISTRATION STARTS PATHS */}
          {/* Staffing Administration Certification Start */}
          <Route
            exact
            path="/system-configuration/tenant-admin/staffing-admin/certifications/create"
            element={<CreateCertification />}
          />
          <Route
            exact
            path="/system-configuration/tenant-admin/staffing-admin/certifications"
            element={<ListCertification />}
          />
          <Route
            exact
            path="/system-configuration/tenant-admin/staffing-admin/certifications/:id/view"
            element={<ViewCertification />}
          />
          <Route
            exact
            path="/system-configuration/tenant-admin/staffing-admin/certifications/:id/edit"
            element={<EditCertification />}
          />
          <Route
            exact
            path="/system-configuration/tenant-admin/staffing-admin/certifications/assigned-certification"
            element={<AssignedCertification />}
          />
          <Route
            exact
            path="/system-configuration/tenant-admin/staffing-admin/certifications/assigned-certification/assign"
            element={<AssignCertification />}
          />
          {/* Staffing Administration Certification End */}
          {/* Approvals PATH START */}
          <Route
            exact
            path="/system-configuration/tenant-admin/operations-admin/marketing-equipment/approvals"
            element={<Approvals />}
          />
          <Route
            exact
            path="/system-configuration/tenant-admin/operations-admin/marketing-equipment/approvals/edit"
            element={<ApprovalsEdit />}
          />
          {/* Approvals PATH End */}
          {/* Equipment PATH START */}
          <Route
            exact
            path="/system-configuration/tenant-admin/operations-admin/marketing-equipment/equipments/create"
            element={<CreateEquipment />}
          />
          <Route
            exact
            path="/system-configuration/tenant-admin/operations-admin/marketing-equipment/equipments/list"
            element={<ListEquipments />}
          />
          <Route
            exact
            path="/system-configuration/tenant-admin/operations-admin/marketing-equipment/equipments/view/:id"
            element={<ViewEquipment />}
          />
          <Route
            exact
            path="/system-configuration/tenant-admin/operations-admin/marketing-equipment/equipments/edit/:id"
            element={<EditEquipment />}
          />
          {/* Equipment PATH End */}
          {/* Attachment Category path */}
          {/*Note Attachment Category path */}
          <Route
            exact
            path="/system-configuration/tenant-admin/operations-admin/notes-attachments/attachment-categories"
            element={<AttachmentNotesCategoriesList />}
          />
          <Route
            exact
            path="/system-configuration/tenant-admin/operations-admin/notes-attachments/attachment-categories/:id/view"
            element={<ViewNotesAttachmentCategory />}
          />
          <Route
            exact
            path="/system-configuration/tenant-admin/operations-admin/notes-attachments/attachment-categories/:id/edit"
            element={<EditNotesAttachmentCategory />}
          />
          <Route
            exact
            path="/system-configuration/tenant-admin/operations-admin/notes-attachments/attachment-categories/create"
            element={<CreateNotesAttachmentCategory />}
          />
          {/* Locations Note Categories PATH START */}
          <Route
            exact
            path="/system-configuration/tenant-admin/crm-admin/locations/note-categories/"
            element={<LocationNoteCategoryList />}
          />
          <Route
            exact
            path="/system-configuration/tenant-admin/crm-admin/locations/note-categories/create"
            element={<LocationNoteCategoryAdd />}
          />
          <Route
            exact
            path="/system-configuration/tenant-admin/crm-admin/locations/note-categories/view/:id"
            element={<LocationNoteCategoryView />}
          />
          <Route
            exact
            path="/system-configuration/tenant-admin/crm-admin/locations/note-categories/edit/:id"
            element={<LocationNoteCategoryEdit />}
          />
          {/* Locations Note Categories PATH End */}
          {/* Locations Note Sub Categories PATH START */}
          <Route
            exact
            path="/system-configuration/tenant-admin/crm-admin/locations/note-subcategories/list"
            element={<LocationNoteSubCategoriesList />}
          />
          <Route
            exact
            path="/system-configuration/tenant-admin/crm-admin/locations/note-subcategories/create"
            element={<LocationNoteSubCategoryAdd />}
          />
          <Route
            exact
            path="/system-configuration/tenant-admin/crm-admin/locations/note-subcategories/edit/:id"
            element={<LocationNoteSubCategoryEdit />}
          />
          <Route
            exact
            path="/system-configuration/tenant-admin/crm-admin/locations/note-subcategories/view/:id"
            element={<LocationNoteSubCategoryView />}
          />
          {/* Locations Note Sub Categories PATH End */}
          {/* PROMOTIONAL ITEMS PATH START */}
          <Route
            exact
            path="/system-configuration/tenant-admin/operations-admin/marketing-equipment/promotional-items"
            element={<ListPromotionalItems />}
          />
          <Route
            exact
            path="/system-configuration/tenant-admin/operations-admin/marketing-equipment/promotional-items/:id/view"
            element={<ViewPromotionItems />}
          />
          <Route
            exact
            path="/system-configuration/tenant-admin/operations-admin/marketing-equipment/promotional-items/:id/edit"
            element={<EditPromotionalItems />}
          />
          {/* PROMOTIONS PATH END */}
          {/* PROMOTIONAL ITEMS PATH END */}
          {/* ASSIGN TEAM MEMBERS PATH START */}
          <Route
            exact
            path={TEAMS_ASSIGN_MEMBERS.LIST}
            element={<ListAssignMembers />}
          />
          <Route
            exact
            path={TEAMS_ASSIGN_MEMBERS.ASSIGN}
            element={<AssignMembersCreate />}
          />
          {/* ASSIGN TEAM MEMBERS PATH END */}
          {/* Note Attachment Subcategory path */}
          <Route
            exact
            path="/system-configuration/tenant-admin/operations-admin/notes-attachments/attachment-subcategories"
            element={<AttachmentNotesSubCategoriesList />}
          />
          <Route
            exact
            path="/system-configuration/tenant-admin/operations-admin/notes-attachments/attachment-subcategories/:id/view"
            element={<ViewNotesAttachmentSubCategory />}
          />
          <Route
            exact
            path="/system-configuration/tenant-admin/operations-admin/notes-attachments/attachment-subcategories/:id/edit"
            element={<EditNotesAttachmentSubcategory />}
          />
          <Route
            exact
            path="/system-configuration/tenant-admin/operations-admin/notes-attachments/attachment-subcategories/create"
            element={<CreateNotesAttachmentSubCategory />}
          />
          {/* End Note Attachment SubCategory */}
          {/* Location Attachment Category path */}
          <Route
            exact
            path="/system-configuration/tenant-admin/crm-admin/locations/attachment-categories"
            element={<ListLocationsAttachmentCategories />}
          />
          <Route
            exact
            path="/system-configuration/tenant-admin/crm-admin/locations/attachment-categories/:id/view"
            element={<ViewLocationsAttachmentCategories />}
          />
          <Route
            exact
            path="/system-configuration/tenant-admin/crm-admin/locations/attachment-categories/:id/edit"
            element={<EditLocationsAttachmentCategories />}
          />
          <Route
            exact
            path="/system-configuration/tenant-admin/crm-admin/locations/attachment-categories/create"
            element={<CreateLocationsAttachmentCategories />}
          />
          {/* End Location Attachment Category path */}
          {/* Location Attachment SubCategory path */}
          <Route
            exact
            path="/system-configuration/tenant-admin/crm-admin/locations/attachment-subcategories"
            element={<ListLocationsAttachmentSubCategories />}
          />
          <Route
            exact
            path="/system-configuration/tenant-admin/crm-admin/locations/attachment-subcategories/:id/view"
            element={<ViewLocationsAttachmentSubCategories />}
          />
          <Route
            exact
            path="/system-configuration/tenant-admin/crm-admin/locations/attachment-subcategories/:id/edit"
            element={<EditLocationsAttachmentSubCategories />}
          />
          <Route
            exact
            path="/system-configuration/tenant-admin/crm-admin/locations/attachment-subcategories/create"
            element={<CreateLocationsAttachmentSubCategories />}
          />
          {/* End Location Attachment SubCategory path */}
          {/* Accounts - alias - routes start*/}
          <Route
            exact
            path="/system-configuration/tenant-admin/crm-admin/accounts/alias"
            element={<AccountAliasList />}
          />
          <Route
            exact
            path="/system-configuration/tenant-admin/crm-admin/accounts/alias/edit"
            element={<AccountAliasEdit />}
          />
          {/* Accounts - alias - routes end*/}
          {/* Contact - alias - routes start*/}
          <Route
            exact
            path="/system-configuration/tenant-admin/crm-admin/contacts/alias"
            element={<ContactAliasList />}
          />
          <Route
            exact
            path="/system-configuration/tenant-admin/crm-admin/contacts/alias/edit"
            element={<ContactAliasEdit />}
          />
          {/* Contact - alias - routes end*/}
          {/* CRM App - Donors Centers - routes start*/}
          <Route
            exact
            path={CRM_DONORS_CENTERS.LIST}
            element={<ListDonorCenters />}
          />
          <Route
            exact
            path={CRM_DONORS_CENTERS.VIEW}
            element={<ViewDonorCenters />}
          />
          {/* CRM App - Donors Centers - routes end*/}
          {/* CRM - Contacts - Staff - Leave start */}
          <Route
            exact
            path="/crm/contacts/staff/:staffId/view/leave/create"
            element={<AddStaffLeave />}
          />
          {/* <Route
            exact
            path="/crm/contacts/staff/:staffId/view/leave"
            element={<ListStaffLeave />}
          />
          <Route
            exact
            path="/crm/contacts/staff/:staffId/view/leave/:id/view"
            element={<ViewStaffLeave />}
          /> */}
          <Route
            exact
            path="/crm/contacts/staff/:staffId/view/leave/:id/edit"
            element={<EditStaffLeave />}
          />
          {/* CRM - Contacts - Staff - Leave end */}
          {/* CRM - Contacts - Staff - Duplicates start */}
          {/* <Route
            exact
            path="/crm/contacts/staff/:staffId/view/duplicates"
            element={<ListStaffDuplicates />}
          /> */}
          {/* CRM - Contacts - Staff - Duplicates end */}
          {/* Operations Center - Operations - Drive start */}
          <Route
            exact
            path={OPERATIONS_CENTER_DRIVES_PATH.CREATE}
            element={<CreateDrive />}
          />
          <Route
            exact
            path={OPERATIONS_CENTER_DRIVES_PATH.EDIT}
            element={<EditDrive />}
          />

          <Route
            exact
            path={OPERATIONS_CENTER_DRIVES_PATH.LIST}
            element={<ListDrive />}
          />
          <Route
            exact
            path={OPERATIONS_CENTER_DRIVES_PATH.VIEW}
            element={<ViewDrive />}
          />
          <Route
            exact
            path={OPERATIONS_CENTER_DRIVES_PATH.SHIFT_DETAILS}
            element={<DriveShiftDetails />}
          />
          {/* Operations Center - Operations - Drive end */}
          {/* Operations Center - Operations - Drive - DonorSchedule start */}
          <Route
            exact
            path={OPERATIONS_CENTER_DRIVES_DONOR_SCHEDULES.LIST}
            element={<ViewDonorSchedules />}
          />
          {/* Operations Center - Operations - Drive - DonorSchedule end */}
          {/* Operations Center - Operations - Drive - Document - Attachment start */}
          <Route
            exact
            path={OPERATIONS_CENTER_DRIVES_DOCUMENT_ATTACHMENT_PATH.CREATE}
            element={<DrivesAttachmentsAdd />}
          />
          <Route
            exact
            path={OPERATIONS_CENTER_DRIVES_DOCUMENT_ATTACHMENT_PATH.LIST}
            element={<DrivesAttachmentsList />}
          />
          <Route
            exact
            path={OPERATIONS_CENTER_DRIVES_DOCUMENT_ATTACHMENT_PATH.VIEW}
            element={<DrivesAttachmentsView />}
          />
          <Route
            exact
            path={OPERATIONS_CENTER_DRIVES_DOCUMENT_ATTACHMENT_PATH.EDIT}
            element={<DrivesAttachmentsEdit />}
          />
          {/* Operations Center - Operations - Drive - Document - Attachment end */}
          {/* Operations Center - Operations - Drive - Document - Notes start */}
          <Route
            exact
            path={OPERATIONS_CENTER_DRIVES_DOCUMENT_NOTE_PATH.CREATE}
            element={<DrivesCreateNotes />}
          />
          <Route
            exact
            path={OPERATIONS_CENTER_DRIVES_DOCUMENT_NOTE_PATH.LIST}
            element={<DrivesListNotes />}
          />
          <Route
            exact
            path={OPERATIONS_CENTER_DRIVES_DOCUMENT_NOTE_PATH.VIEW}
            element={<DrivesViewNotes />}
          />
          <Route
            exact
            path={OPERATIONS_CENTER_DRIVES_DOCUMENT_NOTE_PATH.EDIT}
            element={<DrivesEditNote />}
          />
          {/* Operations Center - Operations - Drive - Document - Notes end */}
          {/* Operations Center - Operations - Sessions - start */}
          <Route
            exact
            path={OPERATIONS_CENTER_SESSIONS_PATH.LIST}
            element={<ListSession />}
          />
          <Route
            exact
            path={OPERATIONS_CENTER_SESSIONS_PATH.SHIFT_DETAILS}
            element={<SessionShiftDetails />}
          />
          <Route
            exact
            path={OPERATIONS_CENTER_SESSIONS_PATH.CREATE}
            element={<CreateSession />}
          />
          <Route
            exact
            path={OPERATIONS_CENTER_SESSIONS_PATH.VIEW}
            element={<ViewSession />}
          />
          {/* Operations Center - Operations - Sessions - end */}
          {/* Operations Center - Operations - Sessions - Document - Attachment start */}
          <Route
            exact
            path={OPERATIONS_CENTER_SESSIONS_DOCUMENT_ATTACHMENT_PATH.CREATE}
            element={<SessionsAttachmentsAdd />}
          />
          <Route
            exact
            path={OPERATIONS_CENTER_SESSIONS_DOCUMENT_ATTACHMENT_PATH.LIST}
            element={<SessionsAttachmentsList />}
          />
          <Route
            exact
            path={OPERATIONS_CENTER_SESSIONS_DOCUMENT_ATTACHMENT_PATH.VIEW}
            element={<SessionsAttachmentsView />}
          />
          <Route
            exact
            path={OPERATIONS_CENTER_SESSIONS_DOCUMENT_ATTACHMENT_PATH.EDIT}
            element={<SessionsAttachmentsEdit />}
          />
          {/* Operations Center - Operations - Sessions - Document - Attachment end */}
          {/* Operations Center - Operations - Sessions - Document - Notes start */}
          <Route
            exact
            path={OPERATIONS_CENTER_SESSIONS_DOCUMENT_NOTE_PATH.CREATE}
            element={<SessionsCreateNotes />}
          />
          <Route
            exact
            path={OPERATIONS_CENTER_SESSIONS_DOCUMENT_NOTE_PATH.LIST}
            element={<SessionsListNotes />}
          />
          <Route
            exact
            path={OPERATIONS_CENTER_SESSIONS_DOCUMENT_NOTE_PATH.VIEW}
            element={<SessionsViewNotes />}
          />
          <Route
            exact
            path={OPERATIONS_CENTER_SESSIONS_DOCUMENT_NOTE_PATH.EDIT}
            element={<SessionsEditNote />}
          />
          {/* Operations Center - Operations - Sessions - Document - Notes end */}
          {/* Operations Center - Operations - NCE - Document - Attachment start */}
          <Route
            exact
            path={OPERATIONS_CENTER_NCE_DOCUMENT_ATTACHMENT_PATH.CREATE}
            element={<NCEAttachmentsAdd />}
          />
          <Route
            exact
            path={OPERATIONS_CENTER_NCE_DOCUMENT_ATTACHMENT_PATH.LIST}
            element={<NCEAttachmentsList />}
          />
          <Route
            exact
            path={OPERATIONS_CENTER_NCE_DOCUMENT_ATTACHMENT_PATH.VIEW}
            element={<NCEAttachmentsView />}
          />
          <Route
            exact
            path={OPERATIONS_CENTER_NCE_DOCUMENT_ATTACHMENT_PATH.EDIT}
            element={<NCEAttachmentsEdit />}
          />
          {/* Operations Center - Operations - NCE - Document - Attachment end */}
          {/* Operations Center - Operations - NCE - Document - Notes start */}
          <Route
            exact
            path={OPERATIONS_CENTER_NCE_DOCUMENT_NOTE_PATH.CREATE}
            element={<NCECreateNotes />}
          />
          <Route
            exact
            path={OPERATIONS_CENTER_NCE_DOCUMENT_NOTE_PATH.LIST}
            element={<NCEListNotes />}
          />
          <Route
            exact
            path={OPERATIONS_CENTER_NCE_DOCUMENT_NOTE_PATH.VIEW}
            element={<NCEViewNotes />}
          />
          <Route
            exact
            path={OPERATIONS_CENTER_NCE_DOCUMENT_NOTE_PATH.EDIT}
            element={<NCEEditNote />}
          />
          {/* Operations Center - Operations - NCE*/}
          <Route
            exact
            path={OPERATIONS_CENTER_NCE.CREATE}
            element={<NonCollectionEventCreate />}
          />
          <Route
            exact
            path={OPERATIONS_CENTER_NCE.EDIT}
            element={<NonCollectionEventEdit />}
          />
          <Route
            exact
            path={OPERATIONS_CENTER_NCE.LIST}
            element={<NonCollectionEventList />}
          />
          <Route
            exact
            path={OPERATIONS_CENTER_NCE.VIEW}
            element={<NonCollectionEventView />}
          />
          <Route
            exact
            path={OPERATIONS_CENTER_NCE.SHIFT_DETAILS}
            element={<NonCollectionEventShiftDetails />}
          />
          {/* Operations Center - Operations - NCE - Document - Notes end */}
          {/* Operations Center - Manage Favorites - start*/}
          <Route
            exact
            path={OPERATIONS_CENTER_MANAGE_FAVORITES_PATH.CREATE}
            element={<CreateFavorite />}
          />
          <Route
            exact
            path={OPERATIONS_CENTER_MANAGE_FAVORITES_PATH.LIST}
            element={<ListFavorite />}
          />
          {/* Operations Center - Manage Favorites - end*/}
          <Route
            exact
            path={OPERATIONS_CENTER_MANAGE_FAVORITES_PATH.EDIT}
            element={<EditDuplicateFavorite />}
          />
          <Route
            exact
            path={OPERATIONS_CENTER_MANAGE_FAVORITES_PATH.DUPLICATE}
            element={<EditDuplicateFavorite />}
          />
          <Route
            exact
            path={OPERATIONS_CENTER_MANAGE_FAVORITES_PATH.VIEW}
            element={<ViewFavorite />}
          />
          {/* Operations Center - Manage Favorites - end*/}
          <Route
            exact
            path={'/operations-center/calendar-view'}
            element={<DummyCalendarPage />}
          />
          {/* Operations Center - Manage Favorites - ends*/}
          {/* Staff - Schedule Path - start */}
          {/* Staff - Schedule Path - end */}
          {/* Donor - Schedule Path - start */}
          {/* Donor - Schedule Path - end */}
          {/* Drives - Change Audit Path - start */}
          <Route
            exact
            path={DRIVES_CHANGE_AUDIT_PATH.LIST}
            element={<DrivesChangeAuditList />}
          />
          {/* Drives - Change Audit - end */}
          {/* resource sharing - start */}

          <Route
            exact
            path={OPERATIONS_CENTER_RESOURCE_SHARING.CREATE}
            element={<ResourceSharingCreate />}
          />
          <Route
            exact
            path={OPERATIONS_CENTER_RESOURCE_SHARING.EDIT}
            element={<ResourceSharingEdit />}
          />
          <Route
            exact
            path={OPERATIONS_CENTER_RESOURCE_SHARING.LIST}
            element={<ResourceSharingList />}
          />
          <Route
            exact
            path={OPERATIONS_CENTER_RESOURCE_SHARING.VIEW}
            element={<ResourceSharingView />}
          />
          {/* resource sharing - end */}

          {/* Prospects - Path - start */}
          <Route
            exact
            path={OS_PROSPECTS_PATH.CREATE}
            element={<CreateProspects />}
          />
          <Route
            exact
            path={OS_PROSPECTS_PATH.BUILD_SEGMENTS}
            element={<BuildSegmentsProspects />}
          />
          <Route
            exact
            path={OS_PROSPECTS_PATH.LIST}
            element={<ListProspects />}
          />
          <Route
            exact
            path={OS_PROSPECTS_PATH.CREATE_MESSAGE}
            element={<CreateMessageProspects />}
          />
          <Route
            exact
            path={OS_PROSPECTS_PATH.ABOUT}
            element={<AboutProspects />}
          />
          <Route
            exact
            path={OS_PROSPECTS_PATH.CONTACTS}
            element={<ContactProspects />}
          />
          {/* Prospects -  Path - end */}
          {/* Operations Center - Operations - Nce-Event-List start */}
          <Route
            exact
            path={OPERATIONS_CENTER_NCE.CREATE}
            element={<NonCollectionEventCreate />}
          />
          <Route
            exact
            path={OPERATIONS_CENTER_NCE.LIST}
            element={<NonCollectionEventList />}
          />
          <Route
            exact
            path={OPERATIONS_CENTER_NCE.VIEW}
            element={<NonCollectionEventView />}
          />
          <Route
            exact
            path={OPERATIONS_CENTER_NCE.SHIFT_DETAILS}
            element={<NonCollectionEventShiftDetails />}
          />
          <Route
            exact
            path={CRM_DONOR_SCHEDULE_PATH.CREATE}
            element={<DonorScheduleCreate />}
          />
          <Route
            exact
            path={CRM_DONOR_SCHEDULE_PATH.CREATE_FORM}
            element={<DonorScheduleCreateForm />}
          />
          <Route
            exact
            path={CRM_DONOR_SCHEDULE_PATH.EDIT}
            element={<DonorScheduleEditForm />}
          />
          <Route
            exact
            path={OPERATIONS_CENTER.DASHBOARD}
            element={<OperationsCenterDashboard />}
          />

          <Route
            exact
            path={SYSTEM_CONFIGURATION.DASHBOARD}
            element={<SystemConfigurationDashBoard />}
          />
          {/* Operations Center - Operations - Nce-Event End */}
          {/* Operations Center - Operations - Nce-Change-Audit Start */}

          <Route
            exact
            path={OPERATIONS_CENTER_NCE_CHANGE_AUDIT_PATH.LIST}
            element={<NonCollectionEventsChangeAuditView />}
          />
          {/* Operations Center - Operations - Nce-Change-Audit End */}
          {/* Operations Center - Operations - Session-Audit Start */}

          <Route
            exact
            path={OPERATIONS_CENTER_SESSIONS_CHANGE_AUDIT_PATH.LIST}
            element={<SessionsChangeAuditView />}
          />
          {/* Operations Center - Operations - Session-Audit End */}

          {/* Operations Center - Manage Favorites - Create Favorite start*/}

          {/* Staffing Management - Staff List */}
          <Route
            exact
            path={STAFFING_MANAGEMENT_STAFF_LIST}
            element={<ListStaffs />}
          />
          <Route
            exact
            path={STAFFING_MANAGEMENT_BUILD_SCHEDULE.LIST}
            element={<BuildSchedule />}
          />
          <Route
            exact
            path={STAFFING_MANAGEMENT_BUILD_SCHEDULE.CREATE}
            element={<CreateSchedule />}
          />
          {/* Staffing Management - Staff List */}
          {/* Staffing Management - View Schedule */}
          <Route
            exact
            path={STAFFING_MANAGEMENT_VIEW_SCHEDULE}
            element={<ScheduleView />}
          />
          {/* Staffing Management - View Schedule */}
        </SentryRoutes>
      </BrowserRouter>
    </>
  );
}

export default App;
