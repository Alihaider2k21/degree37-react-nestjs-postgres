import {
  BUSINESS_UNIT_PATH,
  SC_ORGANIZATIONAL_ADMINISTRATION_PATH,
  SYSTEM_CONFIGURATION_PATH,
} from '../../../../../routes/path';

export const BusinessBreadCrumbData = [
  {
    label: 'System Configurations',
    class: 'disable-label',
    link: SYSTEM_CONFIGURATION_PATH,
  },
  {
    label: 'Organizational Administration',
    class: 'disable-label',
    link: SC_ORGANIZATIONAL_ADMINISTRATION_PATH,
  },
  {
    label: 'Hierarchy',
    class: 'disable-label',
    link: '/system-configuration/organizational-levels',
  },
  {
    label: 'Business Units',
    class: 'active-label',
    link: BUSINESS_UNIT_PATH.LIST,
  },
];
