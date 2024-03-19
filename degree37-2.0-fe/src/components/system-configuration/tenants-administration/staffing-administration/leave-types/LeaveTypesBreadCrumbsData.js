import {
  SC_STAFF_ADMINISTRATION_PATH,
  SYSTEM_CONFIGURATION_PATH,
} from '../../../../../routes/path';

export const LeaveTypesBreadCrumbsData = [
  {
    label: 'System Configurations',
    class: 'disable-label',
    link: SYSTEM_CONFIGURATION_PATH,
  },
  {
    label: 'Staffing Administration',
    class: 'disable-label',
    link: SC_STAFF_ADMINISTRATION_PATH,
  },
  {
    label: 'Leave Types',
    class: 'disable-label',
    link: '/system-configuration/tenant-admin/staffing-admin/leave-types/list',
  },
];
