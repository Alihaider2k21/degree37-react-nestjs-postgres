import React from 'react';
import ListUsersRoles from '../../../pages/system-configuration/platform-administration/roles-administration/ListUsersRoles';
import CreateUserRoles from '../../../pages/system-configuration/platform-administration/roles-administration/create/CreateUserRoles';
import ListProcedureTypes from '../../../pages/system-configuration/tenants-administraion/organizational-administration/products-procedures/procedure-types/ListProceduresTypes';
import CreateProcedureTypes from '../../../pages/system-configuration/tenants-administraion/organizational-administration/products-procedures/procedure-types/create/CreateProcedureTypes';
import ViewProcedureTypes from '../../../pages/system-configuration/tenants-administraion/organizational-administration/products-procedures/procedure-types/view/ViewProcedureTypes';
import ListProducts from '../../../pages/system-configuration/tenants-administraion/organizational-administration/products-procedures/products/ListProducts';

import NotFoundPage from '../../../pages/not-found/NotFoundPage';
import StagingList from '../../../pages/system-configuration/tenants-administraion/crm-admin/accounts/stage/StageList';
import CreateStage from '../../../pages/system-configuration/tenants-administraion/crm-admin/accounts/stage/create/CreateStage';
import CreateAffiliation from '../../../pages/system-configuration/tenants-administraion/crm-administration/account/affiliations/create/CreateAffiliation';
import AffiiliationEdit from '../../../pages/system-configuration/tenants-administraion/crm-administration/account/affiliations/edit/AffiliationEdit';
import ListAffiliations from '../../../pages/system-configuration/tenants-administraion/crm-administration/account/affiliations/view/ListAffiliations';
import ViewAffiliations from '../../../pages/system-configuration/tenants-administraion/crm-administration/account/affiliations/view/ViewAffiliations';
import ListIndustryCategories from '../../../pages/system-configuration/tenants-administraion/crm-administration/account/industry-categories/ListIndustryCategories';
import CreateIndustryCategories from '../../../pages/system-configuration/tenants-administraion/crm-administration/account/industry-categories/create/CreateIndustryCategories';
import EditIndustryCategories from '../../../pages/system-configuration/tenants-administraion/crm-administration/account/industry-categories/edit/EditIndustryCategories';
import ViewIndustryCategories from '../../../pages/system-configuration/tenants-administraion/crm-administration/account/industry-categories/view/ViewIndustryCategories';
import ListIndustrySubCategories from '../../../pages/system-configuration/tenants-administraion/crm-administration/account/industry-subcategories/ListIndustryCategories';
import CreateIndustrySubCategories from '../../../pages/system-configuration/tenants-administraion/crm-administration/account/industry-subcategories/create/CreateIndustryCategories';
import EditIndustrySubCategories from '../../../pages/system-configuration/tenants-administraion/crm-administration/account/industry-subcategories/edit/EditIndustryCategories';
import ViewIndustrySubCategories from '../../../pages/system-configuration/tenants-administraion/crm-administration/account/industry-subcategories/view/ViewIndustryCategories';
import AccountNoteCategoryList from '../../../pages/system-configuration/tenants-administraion/crm-administration/account/note-category/NoteCategoryList';
import AccountAddNoteCategory from '../../../pages/system-configuration/tenants-administraion/crm-administration/account/note-category/create/CreateNoteCategory';
import AccountEditNoteCategory from '../../../pages/system-configuration/tenants-administraion/crm-administration/account/note-category/edit/EditNoteCategory';
import AccountViewNoteCategory from '../../../pages/system-configuration/tenants-administraion/crm-administration/account/note-category/view/ViewNoteCategory';
import AccountNoteSubCategoryList from '../../../pages/system-configuration/tenants-administraion/crm-administration/account/note-subcategory/NoteSubCategoryList';
import AccountCreateNoteSubCategory from '../../../pages/system-configuration/tenants-administraion/crm-administration/account/note-subcategory/create/CreateNoteSubCategory';
import AccountEditNoteSubCategory from '../../../pages/system-configuration/tenants-administraion/crm-administration/account/note-subcategory/edit/EditNoteSubCategory';
import AccountViewNoteSubCategory from '../../../pages/system-configuration/tenants-administraion/crm-administration/account/note-subcategory/view/ViewNoteSubCategory';
import CreateAttachmentCategory from '../../../pages/system-configuration/tenants-administraion/crm-administration/contact/attachment-categories/CreateAttachmentCategory';
import ListAttachmentCategory from '../../../pages/system-configuration/tenants-administraion/crm-administration/contact/attachment-categories/ListAttachmentCategory';
import ViewAttachmentCategory from '../../../pages/system-configuration/tenants-administraion/crm-administration/contact/attachment-categories/ViewAttachmentCategory';
import CreateAttachmentSubCategory from '../../../pages/system-configuration/tenants-administraion/crm-administration/contact/attachment-subcategories/CreateAttachmentSubCategory';
import ListAttachmentSubCategory from '../../../pages/system-configuration/tenants-administraion/crm-administration/contact/attachment-subcategories/ListAttachmentSubCategory';
import ViewAttachmentSubCategory from '../../../pages/system-configuration/tenants-administraion/crm-administration/contact/attachment-subcategories/ViewAttachmentSubCategory';
import ListBanners from '../../../pages/system-configuration/tenants-administraion/operations-administration/calendar/banners/ListBanners';
import ViewBanner from '../../../pages/system-configuration/tenants-administraion/operations-administration/calendar/banners/ViewBanner';
import ListProcedures from '../../../pages/system-configuration/tenants-administraion/organizational-administration/products-procedures/procedures/ListProcedures';
import CreateProcedures from '../../../pages/system-configuration/tenants-administraion/organizational-administration/products-procedures/procedures/create/CreateProcedures';
import ViewProcedure from '../../../pages/system-configuration/tenants-administraion/organizational-administration/products-procedures/procedures/view/ViewProcedure';
import CreateDevice from '../../../pages/system-configuration/tenants-administraion/organizational-administration/resources/device/CreateDevice';
import EditDevice from '../../../pages/system-configuration/tenants-administraion/organizational-administration/resources/device/EditDevice';
import ListDevices from '../../../pages/system-configuration/tenants-administraion/organizational-administration/resources/device/ListDevices';
import ListVehicleTypes from '../../../pages/system-configuration/tenants-administraion/organizational-administration/resources/vehicle-type/ListVehicleTypes';
import ViewVehicleType from '../../../pages/system-configuration/tenants-administraion/organizational-administration/resources/vehicle-type/ViewVehicleType';
import ListVehicle from '../../../pages/system-configuration/tenants-administraion/organizational-administration/resources/vehicle/ListVehicle';
import ViewVehicle from '../../../pages/system-configuration/tenants-administraion/organizational-administration/resources/vehicle/ViewVehicle';

import ContactRoleCreate from '../../../pages/system-configuration/tenants-administraion/crm-administration/contact/roles/ContactRoleCreate';
import ContactRoleList from '../../../pages/system-configuration/tenants-administraion/crm-administration/contact/roles/ContactRoleList';
import ContactRoleUpdate from '../../../pages/system-configuration/tenants-administraion/crm-administration/contact/roles/ContactRoleUpdate';
import ContactRoleView from '../../../pages/system-configuration/tenants-administraion/crm-administration/contact/roles/ContactRoleView';
import ListTerritoryManagement from '../../../pages/system-configuration/tenants-administraion/geo-administration/territory-management/ListTerritoryManagement';
import CreateTerritory from '../../../pages/system-configuration/tenants-administraion/geo-administration/territory-management/create/CreateTerritory';
import TerritoryEdit from '../../../pages/system-configuration/tenants-administraion/geo-administration/territory-management/edit/TerritoryEdit';
import TerritoryView from '../../../pages/system-configuration/tenants-administraion/geo-administration/territory-management/view/TerritoryView';
import CreateBanner from '../../../pages/system-configuration/tenants-administraion/operations-administration/calendar/banners/CreateBanner';
import EditBanner from '../../../pages/system-configuration/tenants-administraion/operations-administration/calendar/banners/EditBanner';
import CreateAds from '../../../pages/system-configuration/tenants-administraion/organizational-administration/content-management-system/ads/CreateAds';
import EditAds from '../../../pages/system-configuration/tenants-administraion/organizational-administration/content-management-system/ads/EditAds';
import ListAds from '../../../pages/system-configuration/tenants-administraion/organizational-administration/content-management-system/ads/ListAds';
import ViewAds from '../../../pages/system-configuration/tenants-administraion/organizational-administration/content-management-system/ads/ViewAds';
import EditProcedureTypes from '../../../pages/system-configuration/tenants-administraion/organizational-administration/products-procedures/procedure-types/edit/EditProcedureTypes';
import EditProcedures from '../../../pages/system-configuration/tenants-administraion/organizational-administration/products-procedures/procedures/Edit/EditProcedures';
import CreateDeviceType from '../../../pages/system-configuration/tenants-administraion/organizational-administration/resources/device-types/CreateDeviceType';
import { DeviceTypeList } from '../../../pages/system-configuration/tenants-administraion/organizational-administration/resources/device-types/DeviceTypeList';
import { DeviceTypeView } from '../../../pages/system-configuration/tenants-administraion/organizational-administration/resources/device-types/DeviceTypeView';
import UpdateDeviceType from '../../../pages/system-configuration/tenants-administraion/organizational-administration/resources/device-types/UpdateDeviceType';
import ListDeviceMaintenance from '../../../pages/system-configuration/tenants-administraion/organizational-administration/resources/device/ListDeviceMaintenance';
import ListDeviceShare from '../../../pages/system-configuration/tenants-administraion/organizational-administration/resources/device/ListDeviceShare';
import ScheduleDeviceMaintenance from '../../../pages/system-configuration/tenants-administraion/organizational-administration/resources/device/ScheduleDeviceMaintenance';
import ScheduleDeviceReitrement from '../../../pages/system-configuration/tenants-administraion/organizational-administration/resources/device/ScheduleDeviceRetirement';
import ShareDevice from '../../../pages/system-configuration/tenants-administraion/organizational-administration/resources/device/ShareDevice';
import ViewDevice from '../../../pages/system-configuration/tenants-administraion/organizational-administration/resources/device/ViewDevice';
import CreateVehicleType from '../../../pages/system-configuration/tenants-administraion/organizational-administration/resources/vehicle-type/CreateVehicleType';
import EditVehicleType from '../../../pages/system-configuration/tenants-administraion/organizational-administration/resources/vehicle-type/EditVehicleType';
import CreateVehicle from '../../../pages/system-configuration/tenants-administraion/organizational-administration/resources/vehicle/CreateVehicle';
import EditVehicle from '../../../pages/system-configuration/tenants-administraion/organizational-administration/resources/vehicle/EditVehicle';
import ListVehicleMaintenance from '../../../pages/system-configuration/tenants-administraion/organizational-administration/resources/vehicle/ListVehicleMaintenance';
import ListVehicleShare from '../../../pages/system-configuration/tenants-administraion/organizational-administration/resources/vehicle/ListVehicleShare';
import ScheduleVehicleMaintenance from '../../../pages/system-configuration/tenants-administraion/organizational-administration/resources/vehicle/ScheduleVehicleMaintenance';
import ScheduleVehicleRetirement from '../../../pages/system-configuration/tenants-administraion/organizational-administration/resources/vehicle/ScheduleVehicleRetirement';
import ShareVehicle from '../../../pages/system-configuration/tenants-administraion/organizational-administration/resources/vehicle/ShareVehicle';

import View from '../../../pages/system-configuration/tenants-administraion/crm-admin/view/View';
import AccountsCreateAttachmentCategory from '../../../pages/system-configuration/tenants-administraion/crm-administration/account/attachment-categories/CreateAttachmentCategory';
import AccountsEditAttachmentCategory from '../../../pages/system-configuration/tenants-administraion/crm-administration/account/attachment-categories/EditAttachmentCategory';
import AccountsListAttachmentCategory from '../../../pages/system-configuration/tenants-administraion/crm-administration/account/attachment-categories/ListAttachmentCategory';
import AccountsViewAttachmentCategory from '../../../pages/system-configuration/tenants-administraion/crm-administration/account/attachment-categories/ViewAttachmentCategory';
import AddSource from '../../../pages/system-configuration/tenants-administraion/crm-administration/account/sources/create/CreateSource';
import EditSource from '../../../pages/system-configuration/tenants-administraion/crm-administration/account/sources/edit/EditSource';
import ListSource from '../../../pages/system-configuration/tenants-administraion/crm-administration/account/sources/index';
import ViewSource from '../../../pages/system-configuration/tenants-administraion/crm-administration/account/sources/view/ViewSource';
import AliasEdit from '../../../pages/system-configuration/tenants-administraion/crm-administration/locations/alias/edit';
import AliasList from '../../../pages/system-configuration/tenants-administraion/crm-administration/locations/alias/list';
import CreateUpdateRoomSize from '../../../pages/system-configuration/tenants-administraion/crm-administration/locations/room-sizes/CreateUpdateRoomSize';
import ListAllRooms from '../../../pages/system-configuration/tenants-administraion/crm-administration/locations/room-sizes/ListAllRooms';
import ViewRoomDetail from '../../../pages/system-configuration/tenants-administraion/crm-administration/locations/room-sizes/ViewRoomDetail';
import CreateCloseDate from '../../../pages/system-configuration/tenants-administraion/operations-administration/calendar/close-dates/CreateCloseDate';
import EditCloseDate from '../../../pages/system-configuration/tenants-administraion/operations-administration/calendar/close-dates/EditCloseDate';
import ListCloseDates from '../../../pages/system-configuration/tenants-administraion/operations-administration/calendar/close-dates/ListCloseDate';
import ViewCloseDate from '../../../pages/system-configuration/tenants-administraion/operations-administration/calendar/close-dates/ViewCloseDate';
import CreateGoalVariance from '../../../pages/system-configuration/tenants-administraion/operations-administration/calendar/goal-variance/CreateGoalVariance';
import EditGoalVariance from '../../../pages/system-configuration/tenants-administraion/operations-administration/calendar/goal-variance/EditGoalVariance';
import ViewGoalVariance from '../../../pages/system-configuration/tenants-administraion/operations-administration/calendar/goal-variance/ViewGoalVariance';
import CreateLockDate from '../../../pages/system-configuration/tenants-administraion/operations-administration/calendar/lock-dates/CreateLockDate';
import EditLockDate from '../../../pages/system-configuration/tenants-administraion/operations-administration/calendar/lock-dates/EditLockDate';
import ListLockDates from '../../../pages/system-configuration/tenants-administraion/operations-administration/calendar/lock-dates/ListLockDate';
import ViewLockDate from '../../../pages/system-configuration/tenants-administraion/operations-administration/calendar/lock-dates/ViewLockDate';
import ListEquipments from '../../../pages/system-configuration/tenants-administraion/operations-administration/marketing-equipment/equipments/ListEquipments';
import CreateEquipment from '../../../pages/system-configuration/tenants-administraion/operations-administration/marketing-equipment/equipments/create/CreateEquipment';
import EditEquipment from '../../../pages/system-configuration/tenants-administraion/operations-administration/marketing-equipment/equipments/edit/EditEquipment';
import ViewEquipment from '../../../pages/system-configuration/tenants-administraion/operations-administration/marketing-equipment/equipments/view/ViewEquipment';
import CreateMarketingMaterial from '../../../pages/system-configuration/tenants-administraion/operations-administration/marketing-equipment/marketing-material/CreateMarketingMaterial';
import EditMarketingMaterial from '../../../pages/system-configuration/tenants-administraion/operations-administration/marketing-equipment/marketing-material/EditMarketingMaterial';
import ListMarketingMaterial from '../../../pages/system-configuration/tenants-administraion/operations-administration/marketing-equipment/marketing-material/ListMarketingMaterial';
import ViewMarketingMaterial from '../../../pages/system-configuration/tenants-administraion/operations-administration/marketing-equipment/marketing-material/ViewMarketingMaterial';
import CreatePromotion from '../../../pages/system-configuration/tenants-administraion/operations-administration/marketing-equipment/promotions/create/CreatePromotion';
import EditPromotion from '../../../pages/system-configuration/tenants-administraion/operations-administration/marketing-equipment/promotions/edit/EditPromotion';
import ListPromotions from '../../../pages/system-configuration/tenants-administraion/operations-administration/marketing-equipment/promotions/index';
import ViewPromotion from '../../../pages/system-configuration/tenants-administraion/operations-administration/marketing-equipment/promotions/view/ViewPromotion';
import NceCategoryList from '../../../pages/system-configuration/tenants-administraion/operations-administration/non-collection-events/nce-category/NceCategoryList';
import CreateNceCategory from '../../../pages/system-configuration/tenants-administraion/operations-administration/non-collection-events/nce-category/create/CreateNceCategory';
import EditNceCategory from '../../../pages/system-configuration/tenants-administraion/operations-administration/non-collection-events/nce-category/edit/EditNceCategory';
import NceCategory from '../../../pages/system-configuration/tenants-administraion/operations-administration/non-collection-events/nce-category/view/ViewNceCategory';
import NceSubCategoryList from '../../../pages/system-configuration/tenants-administraion/operations-administration/non-collection-events/nce-subcategory/NceSubCategoryList';
import CreateNceSubCategory from '../../../pages/system-configuration/tenants-administraion/operations-administration/non-collection-events/nce-subcategory/create/CreateNceSubCategory';
import EditNceSubCategory from '../../../pages/system-configuration/tenants-administraion/operations-administration/non-collection-events/nce-subcategory/edit/EditNceSubCategory';
import ViewNceSubCategory from '../../../pages/system-configuration/tenants-administraion/operations-administration/non-collection-events/nce-subcategory/view/ViewNceSubCategory';
import { AttachmentCategoriesList as AttachmentNotesCategoriesList } from '../../../pages/system-configuration/tenants-administraion/operations-administration/notes-attachment/attachment-category/AttachmentCategoriesList';
import { CreateAttachmentCategory as CreateNotesAttachmentCategory } from '../../../pages/system-configuration/tenants-administraion/operations-administration/notes-attachment/attachment-category/create/CreateAttachmentCategory';
import { ViewAttachmentCategory as ViewNotesAttachmentCategory } from '../../../pages/system-configuration/tenants-administraion/operations-administration/notes-attachment/attachment-category/view/ViewAttachmentCategory.jsx';
import NotesAttachmentNoteCategoryList from '../../../pages/system-configuration/tenants-administraion/operations-administration/notes-attachment/note-category/NoteCategoryList';
import NotesAttachmentCreateNoteCategory from '../../../pages/system-configuration/tenants-administraion/operations-administration/notes-attachment/note-category/create/CreateNoteCategory';
import NotesAttachmentEditNoteCategory from '../../../pages/system-configuration/tenants-administraion/operations-administration/notes-attachment/note-category/edit/EditNoteCategory';
import NotesAttachmentViewNoteCategory from '../../../pages/system-configuration/tenants-administraion/operations-administration/notes-attachment/note-category/view/ViewNoteCategory';
import NotesAttachmentNoteSubCategoryList from '../../../pages/system-configuration/tenants-administraion/operations-administration/notes-attachment/note-subcategory/NoteSubCategoryList';
import NotesAttachmentCreateNoteSubCategory from '../../../pages/system-configuration/tenants-administraion/operations-administration/notes-attachment/note-subcategory/create/CreateNoteSubCategory';
import NotesAttachmentEditNoteSubCategory from '../../../pages/system-configuration/tenants-administraion/operations-administration/notes-attachment/note-subcategory/edit/EditNoteSubCategory';
import NotesAttachmentViewNoteSubCategory from '../../../pages/system-configuration/tenants-administraion/operations-administration/notes-attachment/note-subcategory/view/ViewNoteSubCategory';
import CreateTask from '../../../pages/system-configuration/tenants-administraion/operations-administration/task-management/CreateTask';
import EditTask from '../../../pages/system-configuration/tenants-administraion/operations-administration/task-management/EditTask';
import ListTask from '../../../pages/system-configuration/tenants-administraion/operations-administration/task-management/ListTask';
import ViewTask from '../../../pages/system-configuration/tenants-administraion/operations-administration/task-management/ViewTask';
import AssignCertification from '../../../pages/system-configuration/tenants-administraion/staffing-administration/certifications/AssignCertification';
import AssignedCertification from '../../../pages/system-configuration/tenants-administraion/staffing-administration/certifications/AssignedCertification';
import CreateCertification from '../../../pages/system-configuration/tenants-administraion/staffing-administration/certifications/CreateCertification';
import EditCertification from '../../../pages/system-configuration/tenants-administraion/staffing-administration/certifications/EditCertification';
import ListCertification from '../../../pages/system-configuration/tenants-administraion/staffing-administration/certifications/ListCertification';
import ViewCertification from '../../../pages/system-configuration/tenants-administraion/staffing-administration/certifications/ViewCertification';
import ListClassifications from '../../../pages/system-configuration/tenants-administraion/staffing-administration/classifications/ListClassifications';
import CreateClassification from '../../../pages/system-configuration/tenants-administraion/staffing-administration/classifications/create/CreateClassification';
import ViewClassification from '../../../pages/system-configuration/tenants-administraion/staffing-administration/classifications/create/view/ViewClassification';
import EditClassification from '../../../pages/system-configuration/tenants-administraion/staffing-administration/classifications/edit/ClassificationEdit';
import CreateSettings from '../../../pages/system-configuration/tenants-administraion/staffing-administration/classifications/settings/Create/CreateSettings';
import ListSetting from '../../../pages/system-configuration/tenants-administraion/staffing-administration/classifications/settings/ListSetting';
import SettingEdit from '../../../pages/system-configuration/tenants-administraion/staffing-administration/classifications/settings/edit/SettingEdit';
import ViewSetting from '../../../pages/system-configuration/tenants-administraion/staffing-administration/classifications/settings/view/ViewSetting';
import EditOrCreateLeave from '../../../pages/system-configuration/tenants-administraion/staffing-administration/leave-types/EditOrCreateLeave';
import LeaveType from '../../../pages/system-configuration/tenants-administraion/staffing-administration/leave-types/LeaveType';
import ViewLeave from '../../../pages/system-configuration/tenants-administraion/staffing-administration/leave-types/ViewLeave.jsx';
import CreateUsers from '../../../pages/system-configuration/tenants-administraion/users-administration/users/CreateUser';
import EditUsers from '../../../pages/system-configuration/tenants-administraion/users-administration/users/EditUser';
import ResetUserPassword from '../../../pages/system-configuration/tenants-administraion/users-administration/users/ResetPassword';
import UsersLists from '../../../pages/system-configuration/tenants-administraion/users-administration/users/UsersList';
import ViewSingleUser from '../../../pages/system-configuration/tenants-administraion/users-administration/users/ViewSingleUser';

import ContactsNoteCategoriesList from '../../../pages/system-configuration/tenants-administraion/crm-admin/contacts/note-category/ContactsNoteCategoriesList';
import ContactsNoteCategoryAdd from '../../../pages/system-configuration/tenants-administraion/crm-admin/contacts/note-category/add/ContactsNoteCategoryAdd';
import ContactsNoteCategoryEdit from '../../../pages/system-configuration/tenants-administraion/crm-admin/contacts/note-category/edit/ContactsNoteCategoryEdit';
import ContactsNoteCategoryView from '../../../pages/system-configuration/tenants-administraion/crm-admin/contacts/note-category/view/ContactsNoteCategoryView';
import ContactsNoteSubCategoriesList from '../../../pages/system-configuration/tenants-administraion/crm-admin/contacts/note-subcategory/ContactsNoteSubCategoriesList';
import ContactsNoteSubCategoryAdd from '../../../pages/system-configuration/tenants-administraion/crm-admin/contacts/note-subcategory/add/ContactsNoteSubCategoryAdd';
import ContactsNoteSubCategoryEdit from '../../../pages/system-configuration/tenants-administraion/crm-admin/contacts/note-subcategory/edit/ContactsNoteSubCategoryEdit';
import ContactsNoteSubCategoryView from '../../../pages/system-configuration/tenants-administraion/crm-admin/contacts/note-subcategory/view/ContactsNoteSubCategoryView';
import AccountsCreateAttachmentSubCategory from '../../../pages/system-configuration/tenants-administraion/crm-administration/account/attachment-subcategories/CreateAttachmentSubCategory';
import AccountsListAttachmentSubCategory from '../../../pages/system-configuration/tenants-administraion/crm-administration/account/attachment-subcategories/ListAttachmentSubCategory';
import AccountsViewAttachmentSubCategory from '../../../pages/system-configuration/tenants-administraion/crm-administration/account/attachment-subcategories/ViewAttachmentSubCategory';
import ListLocationsAttachmentCategories from '../../../pages/system-configuration/tenants-administraion/crm-administration/locations/attachment-categories/ListAttachmentCategories';
import CreateLocationsAttachmentCategories from '../../../pages/system-configuration/tenants-administraion/crm-administration/locations/attachment-categories/create/CreateAttachmentCategories';
import EditLocationsAttachmentCategories from '../../../pages/system-configuration/tenants-administraion/crm-administration/locations/attachment-categories/edit/EditAttachmentCategories';
import ViewLocationsAttachmentCategories from '../../../pages/system-configuration/tenants-administraion/crm-administration/locations/attachment-categories/view/ViewAttachmentCategories';
import ListLocationsAttachmentSubCategories from '../../../pages/system-configuration/tenants-administraion/crm-administration/locations/attachment-subcategories/ListAttachmentSubCategories';
import CreateLocationsAttachmentSubCategories from '../../../pages/system-configuration/tenants-administraion/crm-administration/locations/attachment-subcategories/create/CreateAttachmentSubCategories';
import EditLocationsAttachmentSubCategories from '../../../pages/system-configuration/tenants-administraion/crm-administration/locations/attachment-subcategories/edit/EditAttachmentSubCategories';
import ViewLocationsAttachmentSubCategories from '../../../pages/system-configuration/tenants-administraion/crm-administration/locations/attachment-subcategories/view/ViewAttachmentSubCategories';
import LocationNoteCategoryList from '../../../pages/system-configuration/tenants-administraion/crm-administration/locations/note-category/LocationNoteCategoryList';
import LocationNoteCategoryAdd from '../../../pages/system-configuration/tenants-administraion/crm-administration/locations/note-category/add/LocationNoteCategoryAdd';
import LocationNoteCategoryEdit from '../../../pages/system-configuration/tenants-administraion/crm-administration/locations/note-category/edit/LocationNoteCategoryEdit';
import LocationNoteCategoryView from '../../../pages/system-configuration/tenants-administraion/crm-administration/locations/note-category/view/LocationNoteCategoryView';
import LocationNoteSubCategoryAdd from '../../../pages/system-configuration/tenants-administraion/crm-administration/locations/note-subcategory/add/LocationNoteSubCategoryAdd';
import LocationNoteSubCategoryEdit from '../../../pages/system-configuration/tenants-administraion/crm-administration/locations/note-subcategory/edit/LocationNoteSubCategoryEdit';
import LocationNoteSubCategoryView from '../../../pages/system-configuration/tenants-administraion/crm-administration/locations/note-subcategory/view/LocationNoteSubCategoryView';
import Approvals from '../../../pages/system-configuration/tenants-administraion/operations-administration/marketing-equipment/approvals';
import ApprovalsEdit from '../../../pages/system-configuration/tenants-administraion/operations-administration/marketing-equipment/approvals/ApprovalsEdit';
import CreatePromotionalItem from '../../../pages/system-configuration/tenants-administraion/operations-administration/marketing-equipment/promotional-item/create/CreatePromotionalItem';
import EditPromotionalItems from '../../../pages/system-configuration/tenants-administraion/operations-administration/marketing-equipment/promotional-item/edit/EditPromotionalItem';
import ListPromotionalItems from '../../../pages/system-configuration/tenants-administraion/operations-administration/marketing-equipment/promotional-item/index';
import ViewPromotionItems from '../../../pages/system-configuration/tenants-administraion/operations-administration/marketing-equipment/promotional-item/view/PromotionalItemView';
import { AttachmentSubcategoriesList as AttachmentNotesSubCategoriesList } from '../../../pages/system-configuration/tenants-administraion/operations-administration/notes-attachment/subAttachment-category/AttachmentSubcategoriesList';
import { CreateAttachmentSubcategory as CreateNotesAttachmentSubCategory } from '../../../pages/system-configuration/tenants-administraion/operations-administration/notes-attachment/subAttachment-category/create/CreateAttachmentSubcategory.jsx';
import { ViewAttachmentSubcategory as ViewNotesAttachmentSubCategory } from '../../../pages/system-configuration/tenants-administraion/operations-administration/notes-attachment/subAttachment-category/view/ViewAttachmentSubcategory.jsx';
import CreateUpdateStaffSetup from '../../../pages/system-configuration/tenants-administraion/staffing-administration/staff-setup/CreateUpdateStaffSetup';
import ListStaffSetup from '../../../pages/system-configuration/tenants-administraion/staffing-administration/staff-setup/ListStaffSetup';
import ViewDetailOfStafSetup from '../../../pages/system-configuration/tenants-administraion/staffing-administration/staff-setup/ViewDetailOfStafSetup';

import AccountAliasEdit from '../../../pages/system-configuration/tenants-administraion/crm-administration/account/alias/edit';
import AccountAliasList from '../../../pages/system-configuration/tenants-administraion/crm-administration/account/alias/list';
import AccountsEditAttachmentSubCategory from '../../../pages/system-configuration/tenants-administraion/crm-administration/account/attachment-subcategories/EditAttachmentSubCategory';
import ContactAliasEdit from '../../../pages/system-configuration/tenants-administraion/crm-administration/contact/alias/edit';
import ContactAliasList from '../../../pages/system-configuration/tenants-administraion/crm-administration/contact/alias/list';
import EditAttachmentCategory from '../../../pages/system-configuration/tenants-administraion/crm-administration/contact/attachment-categories/EditAttachmentCategory';
import EditAttachmentSubCategory from '../../../pages/system-configuration/tenants-administraion/crm-administration/contact/attachment-subcategories/EditAttachmentSubCategory';
import LocationNoteSubCategoriesList from '../../../pages/system-configuration/tenants-administraion/crm-administration/locations/note-subcategory/LocationNoteSubCategoriesList';
import { EditNotesAttachmentCategory } from '../../../pages/system-configuration/tenants-administraion/operations-administration/notes-attachment/attachment-category/edit/EditAttachmentCategory';
import { EditNotesAttachmentSubcategory } from '../../../pages/system-configuration/tenants-administraion/operations-administration/notes-attachment/subAttachment-category/edit/EditAttachmentSubcategory';

import CreateCustomFields from '../../../pages/system-configuration/tenants-administraion/organizational-administration/custom-fields/CreateCustomFields';
import CustomFieldsList from '../../../pages/system-configuration/tenants-administraion/organizational-administration/custom-fields/CustomFieldsList';
import EditCustomFields from '../../../pages/system-configuration/tenants-administraion/organizational-administration/custom-fields/EditCustomFields';
import ViewCustomFields from '../../../pages/system-configuration/tenants-administraion/organizational-administration/custom-fields/ViewCustomFields';

export const SystemConfigurationTenantAdminRoutes = [
  {
    path: 'crm-admin',
    children: [
      {
        path: '',
        element: <NotFoundPage />,
      },
      // Locations
      {
        path: 'locations',
        children: [
          {
            path: '',
            element: <NotFoundPage />,
          },
          // TODO: strange route
          {
            path: ':id/edit',
            element: <CreateUpdateRoomSize />,
          },
          //   Alias
          {
            path: 'alias',
            children: [
              {
                path: '',
                element: <AliasList />,
              },
              {
                path: 'edit',
                element: <AliasEdit />,
              },
            ],
          },
          //   Room Size
          {
            path: 'room-size',
            children: [
              {
                path: '',
                element: <ListAllRooms />,
              },
              {
                path: 'create',
                element: <CreateUpdateRoomSize />,
              },
              {
                path: ':id',
                children: [
                  {
                    path: '',
                    element: <ViewRoomDetail />,
                  },
                  {
                    path: 'edit',
                    element: <CreateUpdateRoomSize />,
                  },
                ],
              },
            ],
          },
          //   Note Categories
          {
            path: 'note-categories',
            children: [
              {
                path: '',
                element: <LocationNoteCategoryList />,
              },
              {
                path: 'create',
                element: <LocationNoteCategoryAdd />,
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
                    element: <LocationNoteCategoryEdit />,
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
                    element: <LocationNoteCategoryView />,
                  },
                ],
              },
            ],
          },
          //   Note Sub Categories
          {
            path: 'note-subcategories',
            children: [
              {
                path: '',
                element: <NotFoundPage />,
              },
              {
                path: 'list',
                element: <LocationNoteSubCategoriesList />,
              },
              {
                path: 'create',
                element: <LocationNoteSubCategoryAdd />,
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
                    element: <LocationNoteSubCategoryEdit />,
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
                    element: <LocationNoteSubCategoryView />,
                  },
                ],
              },
            ],
          },
          //   Attachment Categories
          {
            path: 'attachment-categories',
            children: [
              {
                path: '',
                element: <ListLocationsAttachmentCategories />,
              },
              {
                path: 'create',
                element: <CreateLocationsAttachmentCategories />,
              },
              {
                path: ':id',
                children: [
                  {
                    path: '',
                    element: <NotFoundPage />,
                  },
                  {
                    path: 'edit',
                    element: <EditLocationsAttachmentCategories />,
                  },
                  {
                    path: 'view',
                    element: <ViewLocationsAttachmentCategories />,
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
                    element: <LocationNoteSubCategoryView />,
                  },
                ],
              },
            ],
          },
          //   Attachment Sub Categories
          {
            path: 'attachment-subcategories',
            children: [
              {
                path: '',
                element: <ListLocationsAttachmentSubCategories />,
              },
              {
                path: 'create',
                element: <CreateLocationsAttachmentSubCategories />,
              },
              {
                path: ':id',
                children: [
                  {
                    path: '',
                    element: <NotFoundPage />,
                  },
                  {
                    path: 'edit',
                    element: <EditLocationsAttachmentSubCategories />,
                  },
                  {
                    path: 'view',
                    element: <ViewLocationsAttachmentSubCategories />,
                  },
                ],
              },
            ],
          },
        ],
      },
      // Contacts
      {
        path: 'contacts',
        children: [
          {
            path: '',
            element: <NotFoundPage />,
          },
          {
            path: 'alias',
            element: <ContactAliasList />,
          },
          {
            path: 'alias/edit',
            element: <ContactAliasEdit />,
          },
          // Roles
          {
            path: 'roles',
            children: [
              {
                path: '',
                element: <NotFoundPage />,
              },
              {
                path: 'list',
                element: <ContactRoleList />,
              },
              {
                path: 'create',
                element: <ContactRoleCreate />,
              },
              {
                path: ':id',
                children: [
                  {
                    path: '',
                    element: <ContactRoleUpdate />,
                  },
                  {
                    path: 'view',
                    element: <ContactRoleView />,
                  },
                ],
              },
            ],
          },
          // Attachment Categories
          {
            path: 'attachment-categories',
            children: [
              {
                path: '',
                element: <ListAttachmentCategory />,
              },
              {
                path: 'create',
                element: <CreateAttachmentCategory />,
              },
              {
                path: ':id',
                children: [
                  {
                    path: '',
                    element: <NotFoundPage />,
                  },
                  {
                    path: 'edit',
                    element: <EditAttachmentCategory />,
                  },
                  {
                    path: 'view',
                    element: <ViewAttachmentCategory />,
                  },
                ],
              },
            ],
          },
          // Attachment Subcategories
          {
            path: 'attachment-subcategories',
            children: [
              {
                path: '',
                element: <ListAttachmentSubCategory />,
              },
              {
                path: 'create',
                element: <CreateAttachmentSubCategory />,
              },
              {
                path: ':id',
                children: [
                  {
                    path: '',
                    element: <NotFoundPage />,
                  },
                  {
                    path: 'edit',
                    element: <EditAttachmentSubCategory />,
                  },
                  {
                    path: 'view',
                    element: <ViewAttachmentSubCategory />,
                  },
                ],
              },
            ],
          },
          // Notes Categories
          {
            path: 'note-categories',
            children: [
              {
                path: '',
                element: <NotFoundPage />,
              },
              {
                path: 'list',
                element: <ContactsNoteCategoriesList />,
              },
              {
                path: 'create',
                element: <ContactsNoteCategoryAdd />,
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
                    element: <ContactsNoteCategoryView />,
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
                    element: <ContactsNoteCategoryEdit />,
                  },
                ],
              },
            ],
          },
          // Notes SubCategories
          {
            path: 'note-subcategories',
            children: [
              {
                path: '',
                element: <NotFoundPage />,
              },
              {
                path: 'list',
                element: <ContactsNoteSubCategoriesList />,
              },
              {
                path: 'create',
                element: <ContactsNoteSubCategoryAdd />,
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
                    element: <ContactsNoteSubCategoryView />,
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
                    element: <ContactsNoteSubCategoryEdit />,
                  },
                ],
              },
            ],
          },
        ],
      },
      // Accounts
      {
        path: 'accounts',
        children: [
          {
            path: '',
            element: <NotFoundPage />,
          },
          {
            path: 'alias',
            element: <AccountAliasList />,
          },
          {
            path: 'alias/edit',
            element: <AccountAliasEdit />,
          },

          //   Affiliations
          {
            path: 'affiliations',
            children: [
              {
                path: '',
                element: <ListAffiliations />,
              },
              {
                path: 'create',
                element: <CreateAffiliation />,
              },
              {
                path: ':id',
                children: [
                  {
                    path: '',
                    element: <ViewAffiliations />,
                  },
                  {
                    path: 'edit',
                    element: <AffiiliationEdit />,
                  },
                ],
              },
            ],
          },
          //   Sources
          {
            path: 'sources',
            children: [
              {
                path: '',
                element: <ListSource />,
              },
              {
                path: 'create',
                element: <AddSource />,
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
                    element: <ViewSource />,
                  },
                  {
                    path: 'edit',
                    element: <EditSource />,
                  },
                ],
              },
            ],
          },
          //   Stages
          {
            path: 'stages',
            children: [
              {
                path: '',
                element: <StagingList />,
              },
              {
                path: 'create',
                element: <CreateStage />,
              },
              {
                path: ':id',
                children: [
                  {
                    path: '',
                    element: <View />,
                  },
                  {
                    path: 'edit',
                    element: <CreateStage />,
                  },
                ],
              },
            ],
          },
          //   Industry Categories
          {
            path: 'industry-categories',
            children: [
              {
                path: '',
                element: <ListIndustryCategories />,
              },
              {
                path: 'create',
                element: <CreateIndustryCategories />,
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
                    element: <ViewIndustryCategories />,
                  },
                  {
                    path: 'edit',
                    element: <EditIndustryCategories />,
                  },
                ],
              },
            ],
          },
          //   Industry SubCategories
          {
            path: 'industry-subcategories',
            children: [
              {
                path: '',
                element: <ListIndustrySubCategories />,
              },
              {
                path: 'create',
                element: <CreateIndustrySubCategories />,
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
                    element: <ViewIndustrySubCategories />,
                  },
                  {
                    path: 'edit',
                    element: <EditIndustrySubCategories />,
                  },
                ],
              },
            ],
          },
          //   Attachments Categories
          {
            path: 'attachment-categories',
            children: [
              {
                path: '',
                element: <AccountsListAttachmentCategory />,
              },
              {
                path: 'create',
                element: <AccountsCreateAttachmentCategory />,
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
                    element: <AccountsViewAttachmentCategory />,
                  },
                  {
                    path: 'edit',
                    element: <AccountsEditAttachmentCategory />,
                  },
                ],
              },
            ],
          },
          //   Attachments Subcategories
          {
            path: 'attachment-subcategories',
            children: [
              {
                path: '',
                element: <AccountsListAttachmentSubCategory />,
              },
              {
                path: 'create',
                element: <AccountsCreateAttachmentSubCategory />,
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
                    element: <AccountsViewAttachmentSubCategory />,
                  },
                  {
                    path: 'edit',
                    element: <AccountsEditAttachmentSubCategory />,
                  },
                ],
              },
            ],
          },
          //   Notes Categories
          {
            path: 'note-categories',
            children: [
              {
                path: '',
                element: <NotFoundPage />,
              },
              {
                path: 'list',
                element: <AccountNoteCategoryList />,
              },
              {
                path: 'create',
                element: <AccountAddNoteCategory />,
              },
              {
                path: ':id',
                children: [
                  {
                    path: '',
                    element: <AccountViewNoteCategory />,
                  },
                  {
                    path: 'edit',
                    element: <AccountEditNoteCategory />,
                  },
                ],
              },
            ],
          },
          //   Notes Subcategories
          {
            path: 'note-subcategories',
            children: [
              {
                path: '',
                element: <NotFoundPage />,
              },
              {
                path: 'list',
                element: <AccountNoteSubCategoryList />,
              },
              {
                path: 'create',
                element: <AccountCreateNoteSubCategory />,
              },
              {
                path: ':id',
                children: [
                  {
                    path: '',
                    element: <AccountViewNoteSubCategory />,
                  },
                  {
                    path: 'edit',
                    element: <AccountEditNoteSubCategory />,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  // Organization admin
  {
    path: 'organization-admin',
    children: [
      {
        path: '',
        element: <NotFoundPage />,
      },
      // Products
      {
        path: 'products',
        element: <ListProducts />,
      },
      // Procedures
      {
        path: 'procedures',
        children: [
          {
            path: '',
            element: <ListProcedures />,
          },
          {
            path: 'create',
            element: <CreateProcedures />,
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
                element: <ViewProcedure />,
              },
              {
                path: 'edit',
                element: <EditProcedures />,
              },
            ],
          },
        ],
      },
      // Procedures-type
      {
        path: 'procedures-types',
        children: [
          {
            path: '',
            element: <ListProcedureTypes />,
          },
          {
            path: 'create',
            element: <CreateProcedureTypes />,
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
                element: <ViewProcedureTypes />,
              },
              {
                path: 'edit',
                element: <EditProcedureTypes />,
              },
            ],
          },
        ],
      },
      // Resource
      {
        path: 'resources',
        children: [
          // devices
          {
            path: 'devices',
            children: [
              {
                path: '',
                element: <ListDevices />,
              },
              {
                path: 'create',
                element: <CreateDevice />,
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
                    element: <ViewDevice />,
                  },
                  {
                    path: 'edit',
                    element: <EditDevice />,
                  },
                  {
                    path: 'maintenance',
                    element: <ListDeviceMaintenance />,
                  },
                  {
                    path: 'schedule-maintenance',
                    element: <ScheduleDeviceMaintenance />,
                  },
                  {
                    path: 'schedule-retirement',
                    element: <ScheduleDeviceReitrement />,
                  },
                  {
                    path: 'share',
                    element: <ShareDevice />,
                  },
                  {
                    path: 'sharing',
                    element: <ListDeviceShare />,
                  },
                ],
              },
            ],
          },
          // vehicles
          {
            path: 'vehicles',
            children: [
              {
                path: '',
                element: <ListVehicle />,
              },
              {
                path: 'create',
                element: <CreateVehicle />,
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
                    element: <ViewVehicle />,
                  },
                  {
                    path: 'edit',
                    element: <EditVehicle />,
                  },
                  {
                    path: 'maintenance',
                    element: <ListVehicleMaintenance />,
                  },
                  {
                    path: 'schedule-maintenance',
                    element: <ScheduleVehicleMaintenance />,
                  },
                  {
                    path: 'schedule-retirement',
                    element: <ScheduleVehicleRetirement />,
                  },
                  {
                    path: 'share',
                    element: <ShareVehicle />,
                  },
                  {
                    path: 'sharing',
                    element: <ListVehicleShare />,
                  },
                ],
              },
            ],
          },
          // vehicles-types
          {
            path: 'vehicle-types',
            children: [
              {
                path: '',
                element: <ListVehicleTypes />,
              },
              {
                path: 'create',
                element: <CreateVehicleType />,
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
                    element: <ViewVehicleType />,
                  },
                  {
                    path: 'edit',
                    element: <EditVehicleType />,
                  },
                ],
              },
            ],
          },
        ],
      },
      // Resources
      {
        path: 'resource',
        children: [
          // device-type
          {
            path: 'device-type',
            children: [
              {
                path: '',
                element: <DeviceTypeList />,
              },
              {
                path: 'create',
                element: <CreateDeviceType />,
              },
              {
                path: ':id',
                children: [
                  {
                    path: '',
                    element: <NotFoundPage />,
                  },
                  {
                    path: 'edit',
                    element: <UpdateDeviceType />,
                  },
                  {
                    path: 'view',
                    element: <DeviceTypeView />,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: 'organizational-admin',
    children: [
      // Content Management System
      {
        path: 'content-management-system',
        children: [
          {
            path: 'ads',
            children: [
              {
                path: 'list',
                element: <ListAds />,
              },
              {
                path: 'create',
                element: <CreateAds />,
              },
              {
                path: ':id',
                children: [
                  {
                    path: 'edit',
                    element: <EditAds />,
                  },
                  {
                    path: 'view',
                    element: <ViewAds />,
                  },
                ],
              },
            ],
          },
        ],
      },
      // Custom fields
      {
        path: 'custom-fields',
        children: [
          {
            path: 'list',
            element: <CustomFieldsList />,
          },
          {
            path: 'create',
            element: <CreateCustomFields />,
          },
          {
            path: ':id',
            children: [
              {
                path: 'edit',
                element: <EditCustomFields />,
              },
              {
                path: 'view',
                element: <ViewCustomFields />,
              },
            ],
          },
        ],
      },
    ],
  },
  // roles
  {
    path: 'roles',
    element: <ListUsersRoles />,
  },
  { path: 'roles/create', element: <CreateUserRoles /> },
  // Geo admin
  {
    path: 'geo-admin/territories/list',
    element: <ListTerritoryManagement />,
  },
  {
    path: 'geo-admin/territories/create',
    element: <CreateTerritory />,
  },
  {
    path: 'geo-admin/territories/:id/view',
    element: <TerritoryView />,
  },
  {
    path: 'geo-admin/territories/:id/edit',
    element: <TerritoryEdit />,
  },
  {
    path: 'operations-admin',
    children: [
      // task management
      {
        path: 'booking-drives/task-management/create',
        element: <CreateTask />,
      },
      {
        path: 'booking-drives/task-management/:id',
        element: <EditTask />,
      },
      {
        path: 'booking-drives/task-management/view/:id',
        element: <ViewTask />,
      },
      {
        path: 'booking-drives/task-management/list',
        element: <ListTask />,
      },
      { path: 'calendar/banners', element: <ListBanners /> },
      { path: 'calendar/banners/create', element: <CreateBanner /> },
      { path: 'calendar/banners/:id/view', element: <ViewBanner /> },
      { path: 'calendar/banners/:id/edit', element: <EditBanner /> },
      { path: 'calendar/lock-dates', element: <ListLockDates /> },
      {
        path: 'calendar/lock-dates/create',
        element: <CreateLockDate />,
      },
      {
        path: 'calendar/lock-dates/:id/view',
        element: <ViewLockDate />,
      },
      {
        path: 'calendar/lock-dates/:id/edit',
        element: <EditLockDate />,
      },
      { path: 'calendar/close-dates', element: <ListCloseDates /> },
      {
        path: 'calendar/close-dates/create',
        element: <CreateCloseDate />,
      },
      {
        path: 'calendar/close-dates/:id/view',
        element: <ViewCloseDate />,
      },
      {
        path: 'calendar/close-dates/:id/edit',
        element: <EditCloseDate />,
      },
      { path: 'calendar/goal-variance', element: <ViewGoalVariance /> },
      {
        path: 'calendar/goal-variance/create',
        element: <CreateGoalVariance />,
      },
      {
        path: 'calendar/goal-variance/edit',
        element: <EditGoalVariance />,
      },
      {
        path: 'marketing-equipment/promotions',
        element: <ListPromotions />,
      },
      {
        path: 'marketing-equipment/promotions/create',
        element: <CreatePromotion />,
      },
      {
        path: 'marketing-equipment/promotions/:id/edit',
        element: <EditPromotion />,
      },
      {
        path: 'marketing-equipment/promotions/:id/view',
        element: <ViewPromotion />,
      },
      {
        path: 'marketing-equipment/promotional-items/create',
        element: <CreatePromotionalItem />,
      },
      {
        path: 'marketing-equipment/promotional-items',
        element: <ListPromotionalItems />,
      },
      {
        path: 'marketing-equipment/promotional-items/:id/view',
        element: <ViewPromotionItems />,
      },
      {
        path: 'marketing-equipment/promotional-items/:id/edit',
        element: <EditPromotionalItems />,
      },
      {
        path: 'marketing-equipment/marketing-material/create',
        element: <CreateMarketingMaterial />,
      },
      {
        path: 'marketing-equipment/marketing-material/list',
        element: <ListMarketingMaterial />,
      },
      {
        path: 'marketing-equipment/marketing-material/:id/edit',
        element: <EditMarketingMaterial />,
      },
      {
        path: 'marketing-equipment/marketing-material/:id/view',
        element: <ViewMarketingMaterial />,
      },
      { path: 'marketing-equipment/approvals', element: <Approvals /> },
      {
        path: 'marketing-equipment/approvals/edit',
        element: <ApprovalsEdit />,
      },
      {
        path: 'marketing-equipment/equipments/create',
        element: <CreateEquipment />,
      },
      {
        path: 'marketing-equipment/equipments/view/:id',
        element: <ViewEquipment />,
      },
      {
        path: 'marketing-equipment/equipments/edit/:id',
        element: <EditEquipment />,
      },
      {
        path: 'marketing-equipment/equipments/list',
        element: <ListEquipments />,
      },
      {
        path: 'notes-attachments/attachment-categories',
        element: <AttachmentNotesCategoriesList />,
      },
      {
        path: 'notes-attachments/attachment-categories/:id/view',
        element: <ViewNotesAttachmentCategory />,
      },
      {
        path: 'notes-attachments/attachment-categories/:id/edit',
        element: <EditNotesAttachmentCategory />,
      },
      {
        path: 'notes-attachments/attachment-categories/create',
        element: <CreateNotesAttachmentCategory />,
      },
      {
        path: 'notes-attachments/attachment-subcategories',
        element: <AttachmentNotesSubCategoriesList />,
      },
      {
        path: 'notes-attachments/attachment-subcategories/:id/view',
        element: <ViewNotesAttachmentSubCategory />,
      },
      {
        path: 'notes-attachments/attachment-subcategories/:id/edit',
        element: <EditNotesAttachmentSubcategory />,
      },
      {
        path: 'notes-attachments/attachment-subcategories/create',
        element: <CreateNotesAttachmentSubCategory />,
      },
      {
        path: 'notes-attachments/note-categories/create',
        element: <NotesAttachmentCreateNoteCategory />,
      },
      {
        path: 'notes-attachments/note-categories/list',
        element: <NotesAttachmentNoteCategoryList />,
      },
      {
        path: 'notes-attachments/note-categories/:id',
        element: <NotesAttachmentViewNoteCategory />,
      },
      {
        path: 'notes-attachments/note-categories/:id/edit',
        element: <NotesAttachmentEditNoteCategory />,
      },
      {
        path: 'notes-attachments/note-subcategories/create',
        element: <NotesAttachmentCreateNoteSubCategory />,
      },
      {
        path: 'notes-attachments/note-subcategories/list',
        element: <NotesAttachmentNoteSubCategoryList />,
      },
      {
        path: 'notes-attachments/note-subcategories/:id',
        element: <NotesAttachmentViewNoteSubCategory />,
      },
      {
        path: 'notes-attachments/note-subcategories/:id/edit',
        element: <NotesAttachmentEditNoteSubCategory />,
      },
      { path: 'nce-categories/create', element: <CreateNceCategory /> },
      { path: 'nce-categories/list', element: <NceCategoryList /> },
      { path: 'nce-categories/:id', element: <NceCategory /> },
      { path: 'nce-categories/:id/edit', element: <EditNceCategory /> },
      {
        path: 'nce-subcategories/create',
        element: <CreateNceSubCategory />,
      },
      {
        path: 'nce-subcategories/list',
        element: <NceSubCategoryList />,
      },
      {
        path: 'nce-subcategories/:id',
        element: <ViewNceSubCategory />,
      },
      {
        path: 'nce-subcategories/:id/edit',
        element: <EditNceSubCategory />,
      },
    ],
  },
  {
    path: 'staffing-admin',
    children: [
      {
        path: 'staff-setup',
        element: <ListStaffSetup />,
      },
      {
        path: 'staff-setup/create',
        element: <CreateUpdateStaffSetup />,
      },
      {
        path: 'staff-setup/:id/edit',
        element: <CreateUpdateStaffSetup />,
      },
      {
        path: 'staff-setup/:id',
        element: <ViewDetailOfStafSetup />,
      },

      // Classification path
      {
        path: 'classifications/list',
        element: <ListClassifications />,
      },
      {
        path: 'classifications/create',
        element: <CreateClassification />,
      },
      {
        path: 'classifications/:id/edit',
        element: <EditClassification />,
      },
      {
        path: 'classifications/:id/view',
        element: <ViewClassification />,
      },
      {
        path: 'classifications/settings/list',
        element: <ListSetting />,
      },
      {
        path: 'classifications/settings/create',
        element: <CreateSettings />,
      },
      {
        path: 'classifications/settings/:id/edit',
        element: <SettingEdit />,
      },
      {
        path: 'classifications/settings/:id/view',
        element: <ViewSetting />,
      },
      // Leave type
      { path: 'leave-types/list', element: <LeaveType /> },
      { path: 'leave-types/create', element: <EditOrCreateLeave /> },
      { path: 'leave-types/:id/edit', element: <EditOrCreateLeave /> },
      { path: 'leave-types/:id', element: <ViewLeave /> },
      // certification
      {
        path: 'certifications/create',
        element: <CreateCertification />,
      },
      { path: 'certifications', element: <ListCertification /> },
      {
        path: 'certifications/:id/view',
        element: <ViewCertification />,
      },
      {
        path: 'certifications/:id/edit',
        element: <EditCertification />,
      },
      {
        path: 'certifications/assigned-certification',
        element: <AssignedCertification />,
      },
      {
        path: 'certifications/assigned-certification/assign',
        element: <AssignCertification />,
      },
    ],
  },
  { path: 'user-admin/users/create', element: <CreateUsers /> },
  { path: 'user-admin/users/:id/edit', element: <EditUsers /> },
  { path: 'user-admin/users', element: <UsersLists /> },
  { path: 'user-admin/users/:id/view', element: <ViewSingleUser /> },
  {
    path: 'user-admin/users/:id/reset-password',
    element: <ResetUserPassword />,
  },
];
