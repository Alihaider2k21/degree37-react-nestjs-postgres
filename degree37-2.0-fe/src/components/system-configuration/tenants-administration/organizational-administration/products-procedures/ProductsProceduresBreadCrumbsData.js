import {
  SC_ORGANIZATIONAL_ADMINISTRATION_PATH,
  SYSTEM_CONFIGURATION_PATH,
} from '../../../../../routes/path';

export const ProductsProceduresBreadCrumbsData = [
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
    label: 'Products & Procedures',
    class: 'disable-label',
    link: '/system-configuration/tenant-admin/organization-admin/products',
  },
];
