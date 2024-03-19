const OcPermissions = {
  OPERATIONS_CENTER: {
    OPERATIONS: {
      DRIVES: {
        READ: '13040101',
        WRITE: '13040102',
        ARCHIVE: '13040103',
        STAFFING: '13040104',
        COPY_DRIVE: '13040105',
        LINK_DRIVE: '13040106',
        MODULE_CODE: 'operation_center_drives',
      },
      SESSIONS: {
        READ: '13040201',
        WRITE: '13040202',
        ARCHIVE: '13040203',
        STAFFING: '13040204',
        SESSIONS: '13040205',
        MODULE_CODE: 'operation_center_sessions',
      },
      NON_COLLECTION_EVENTS: {
        READ: '13040301',
        WRITE: '13040302',
        ARCHIVE: '13040303',
        STAFFING: '13040304',
        COPY_NCE: '13040305',
        MODULE_CODE: 'operation_center_NCE',
      },
      DRIVES_STAFFING: {
        READ: '1304010101',
        MODULE_CODE: 'operation_center_drives_staffing',
      },
      SESSIONS_STAFFING: {
        READ: '1304020101',
        MODULE_CODE: 'operation_center_sessions_staffing',
      },
      NCE_STAFFING: {
        READ: '1304030101',
        MODULE_CODE: 'operation_center_NCE_staffing',
      },
    },
    MANAGE_FAVORITE: {
      READ: '130201',
      WRITE: '130202',
      ARCHIVE: '130203',
      DUPLICATE: '130204',
      SET_AS_DEFAULT: '130205',
      MODULE_CODE: 'operation_center_favorite',
    },
  },
};

export default OcPermissions;
