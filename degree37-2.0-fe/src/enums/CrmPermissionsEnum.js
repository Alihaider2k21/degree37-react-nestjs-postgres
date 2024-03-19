const CrmPermissions = {
  CRM: {
    APPLICATION_CODE: 'CRM',
    DASHBOARD: {
      READ: '120601',
      MODULE_CODE: 'crm_dashboard',
    },
    ACCOUNTS: {
      READ: '120101',
      WRITE: '120102',
      SCHEDULE_DRIVE: '120103',
      ARCHIVE: '120104',
      MODULE_CODE: 'accounts',
    },
    CONTACTS: {
      MODULE_CODE: 'contacts',
      VOLUNTEERS: {
        READ: '12020101',
        WRITE: '12020102',
        SCHEDULE_DRIVE: '12020103',
        ARCHIVE: '12020104',
        MODULE_CODE: 'volunteers',
      },
      DONOR: {
        READ: '12020201',
        WRITE: '12020202',
        SEND_EMAIL_OR_SMS: '12020203',
        ARCHIVE: '12020204',
        MODULE_CODE: 'donor',
      },
      STAFF: {
        READ: '12020301',
        WRITE: '12020302',
        SEND_EMAIL_OR_SMS: '12020303',
        ARCHIVE: '12020304',
        MODULE_CODE: 'staff',
      },
    },
    LOCATIONS: {
      READ: '120301',
      WRITE: '120302',
      ARCHIVE: '120303',
      MODULE_CODE: 'locations',
    },
    DONOR_CENTERS: {
      READ: '120401',
      WRITE: '120402',
      ARCHIVE: '120403',
      MODULE_CODE: 'donor_centers',
    },
    NON_COLLECTION_PROFILES: {
      READ: '120501',
      WRITE: '120502',
      ARCHIVE: '120503',
      MODULE_CODE: 'non_collection_profiles',
    },
  },
};
export default CrmPermissions;
