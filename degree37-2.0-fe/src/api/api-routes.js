import { nonCollectionProfiles } from './routes/nonCollectionProfiles.js';
import { auth } from './routes/auth.js';
import { attachmentApi } from './routes/crm/documents/attachment.js';
import { notesApi } from './routes/crm/documents/notes.js';
import { crmAccounts } from './routes/crm/accounts/accounts.js';
import { accounts } from './routes/systemConfigurations/crmAdministration/account.js';
import { contacts } from './routes/systemConfigurations/crmAdministration/contact.js';
import { locations } from './routes/systemConfigurations/crmAdministration/locations.js';
import { nonCollectionEvents } from './routes/systemConfigurations/operationsAdministrations/nonCollectionEvents.js';
import { notesAttachment } from './routes/systemConfigurations/operationsAdministrations/notesAttachment.js';
import { leaveTypes } from './routes/systemConfigurations/staffAdmininstration/leaveTypes.js';
import { staffApis } from './routes/crm/contacts/staff.js';
import { donorCenter } from './routes/crm/donorCenter/donorCenter.js';
import { directionsApi } from './routes/crm/location/directions/directions.js';
import { locationsApi } from './routes/crm/location/locations.js';
import { marketingEquipmentPromotions } from './routes/systemConfigurations/operationsAdministration/marketingEquipment/promotions.js';
import { Certifications } from './routes/systemConfigurations/staffAdmininstration/certifications.js';
import { marketingEquipmentMarketingMaterials } from './routes/systemConfigurations/operationsAdministration/marketingEquipment/marketing-materials.js';
import { promotionalItems } from './routes/systemConfigurations/operationsAdministration/marketingEquipment/promotional-item.js';
import { approvals } from './routes/systemConfigurations/operationsAdministration/marketingEquipment/approvals.js';
import { facilities } from './routes/systemConfigurations/organizationalAdministration/facilities.js';
import { ocNonCollectionEvents } from './routes/operation-center/operations/NCE/nce.js';
import { customFields } from './routes/systemConfigurations/organizationalAdministration/customFields.js';
import { closedDateCalendar } from './routes/systemConfigurations/operationsAdministration/calendar/closedDate.js';
import { operationStatusBookingDrive } from './routes/systemConfigurations/operationsAdministration/bookingDrives/operationStatus.js';
import { users } from './routes/systemConfigurations/userAdmininstration/user.js';
import { sessions } from './routes/operationCenter/sessions';
import { bookingRulesBookingDrive } from './routes/systemConfigurations/operationsAdministration/bookingDrives/bookingRules.js';
// import { donorCenter } from './routes/crm/donorCenter/donorCenter.js';
import { organization } from './routes/systemConfigurations/organizationalAdministration/organization.js';
import { procedureTypes } from './routes/systemConfigurations/organizationalAdministration/procedureTypes.js';
import { staffSetup } from './routes/systemConfigurations/staffAdmininstration/staffSetup.js';
import { devices } from './routes/systemConfigurations/organizationalAdministration/devices.js';
import { drives } from './routes/operationCenter/drives.js';
import { ocCalendar } from './routes/operation-center/Calendar/calender.js';
import { resourceSharingApis } from './routes/operation-center/resource-sharing/resourceSharing.js';

export const API = {
  // Auth apis
  auth: {
    login: auth.login,
    refreshToken: auth.refreshToken,
  },

  // System Configuration apis
  systemConfiguration: {
    operationAdministrations: {
      notesAttachment: notesAttachment,
      nonCollectionEvents: nonCollectionEvents,
      marketingEquipment: {
        promotions: marketingEquipmentPromotions,
        marketingMaterials: marketingEquipmentMarketingMaterials,
        promotionalItems: promotionalItems,
        approvals: approvals,
      },
      calendar: {
        closedDate: closedDateCalendar,
      },
      bookingDrives: {
        operationStatus: operationStatusBookingDrive,
        bookingRules: bookingRulesBookingDrive,
      },
    },
    organizationalAdministrations: {
      facilities,
      customFields,
      organization,
      procedureTypes,
      devices,
    },
    crmAdministration: {
      contact: contacts,
      location: locations,
      account: accounts,
    },
    staffAdmininstration: {
      leaveTypes: leaveTypes,
      certifications: Certifications,
      staffSetup,
    },
    userAdministration: {
      users: users,
    },
  },

  // CRM Apis
  crm: {
    documents: {
      notes: notesApi,
      attachments: attachmentApi,
    },
    contacts: {
      staff: staffApis,
    },
    location: {
      ...locationsApi,
      directions: directionsApi,
    },
    donorCenter: {
      getdetails: donorCenter.blueprint.getdetails,
      getShiftDetails: donorCenter.blueprint.getShiftDetails,
      getDonorSchedule: donorCenter.blueprint.getDonorSchedule,
      blueprint: {
        archive: donorCenter.blueprint.archive,
        getOne: donorCenter.blueprint.getOne,
      },
    },
    crmAccounts,
  },

  operationCenter: {
    sessions: sessions,
    drives: drives,
    calender: ocCalendar,
    resourceSharing: resourceSharingApis,
  },

  nonCollectionProfiles: {
    collectionOperation: nonCollectionProfiles.collectionOperation,
    ownerId: nonCollectionProfiles.ownerId,
    eventCategory: nonCollectionProfiles.eventCategory,
    eventSubCategory: nonCollectionProfiles.eventSubCategory,
    create: nonCollectionProfiles.create,
    getNonCollectionProfile: nonCollectionProfiles.getNonCollectionProfile,
    update: nonCollectionProfiles.update,
    archive: nonCollectionProfiles.archive,
    list: nonCollectionProfiles.list,
    getAll: nonCollectionProfiles.list,
    getEventHistory: nonCollectionProfiles.eventHistory.getAll,
    getStatusAll: nonCollectionProfiles.eventHistory.getStatus,
    getAllBlueprint: nonCollectionProfiles.blueprint.getAll,
    getViewAboutBlueprint: nonCollectionProfiles.blueprint.getViewAbout,
    getViewShiftDetailsBlueprint:
      nonCollectionProfiles.blueprint.getViewShiftDetails,
    getCRMLocations: nonCollectionProfiles.blueprint.getLocations,
    getContactRoles: nonCollectionProfiles.blueprint.getStaffRoles,
    getVehiclesType: nonCollectionProfiles.blueprint.getVehicles,
    getNcpVehiclesType: nonCollectionProfiles.blueprint.getNcpVehicles,
    getNcpDevicesType: nonCollectionProfiles.blueprint.getNcpDevices,
    getNcpRole: nonCollectionProfiles.blueprint.getNcproles,
    getDevicesType: nonCollectionProfiles.blueprint.getDevices,
    patchArchive: nonCollectionProfiles.blueprint.archive,
    patchDefault: nonCollectionProfiles.blueprint.defaultBlueprint,
    putblueprint: nonCollectionProfiles.blueprint.edit,
    createBlueprint: nonCollectionProfiles.blueprint.create,
  },
  ocNonCollectionEvents: {
    create: ocNonCollectionEvents.create,
    getAlloperationstatus: ocNonCollectionEvents.operationstatus.getAll,
    getAllblueprints: ocNonCollectionEvents.blueprint.getAll,
    getAllShiftDetail: ocNonCollectionEvents.blueprint.shiftGetAll,
    list: ocNonCollectionEvents.list,
    getSingleData: ocNonCollectionEvents.singleGet,
    getSingleShiftData: ocNonCollectionEvents.shiftSingleGet,
    getNceCopyData: ocNonCollectionEvents.nceCopyDataGet,
    updateNceData: ocNonCollectionEvents.updateData,
    archiveNceData: ocNonCollectionEvents.archiveData,
    getNceLocation: ocNonCollectionEvents.getNceLocations,
    getCustomFieldData: ocNonCollectionEvents.getCustomFieldData,
  },
};
