import {
  SC_CRM_ADMINISTRATION_PATH,
  SYSTEM_CONFIGURATION_PATH,
} from '../../../../../routes/path';

export const LocationBreadCrumbsData = [
  {
    label: 'System Configurations',
    class: 'disable-label',
    link: SYSTEM_CONFIGURATION_PATH,
  },
  {
    label: 'CRM Administration',
    class: 'disable-label',
    link: SC_CRM_ADMINISTRATION_PATH,
  },
  {
    label: 'Location',
    class: 'disable-label',
    link: '/system-configuration/tenant-admin/crm-admin/locations/room-size',
  },
];
