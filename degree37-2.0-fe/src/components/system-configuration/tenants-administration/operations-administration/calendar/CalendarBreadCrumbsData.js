import {
  SC_OPERATIONS_ADMINISTRATION_PATH,
  SYSTEM_CONFIGURATION_PATH,
} from '../../../../../routes/path';

export const CalendarBreadCrumbsData = [
  {
    label: 'System Configurations',
    class: 'disable-label',
    link: SYSTEM_CONFIGURATION_PATH,
  },
  {
    label: 'Operations Administration',
    class: 'disable-label',
    link: SC_OPERATIONS_ADMINISTRATION_PATH,
  },
  {
    label: 'Calendar',
    class: 'disable-label',
    link: '/system-configuration/tenant-admin/operations-admin/calendar/banners',
  },
];
