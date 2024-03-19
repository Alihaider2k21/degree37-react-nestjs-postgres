const StaffingPermissions = {
  STAFFING_MANAGEMENT: {
    APPLICATION_CODE: 'STAFFING_MANAGEMENT',
    DASHBOARD: {
      READ: '060101',
      MODULE_CODE: 'staffing_management_dashboard',
    },
    STAFF_LIST: {
      READ: '060201',
      WRITE: '060202',
      CURRENT_SCHEDULE: '060203',
      COMMUNICATE: '060204',
      ARCHIVE: '060205',
      MODULE_CODE: 'staff_list',
    },
    BUILD_SCHEDULES: {
      READ: '060301',
      WRITE: '060302',
      ARCHIVE: '060303',
      MODULE_CODE: 'build_schedules',
    },
    CREATE_SCHEDULE: {
      READ: '060301',
      WRITE: '060302',
      MODULE_CODE: 'create_schedule',
    },
    QUICK_CHANGE: {
      READ: '060401',
      WRITE: '060402',
      LEAVE: '060403',
      REASSIGN: '060404',
      MODULE_CODE: 'quick_change',
    },
    VIEW_SCHEDULE: {
      STAFF_SCHEDULE: '060501',
      DEPART_SCHEDULE: '060502',
      MODULE_CODE: 'VIEW_SCHEDULE',
    },
  },
};
export default StaffingPermissions;
