import {
  SC_GEO_ADMINISTRATION_PATH,
  SYSTEM_CONFIGURATION_PATH,
} from '../../../../routes/path';

export const GeoAdministrationBreadCrumbsData = [
  {
    label: 'System Configurations',
    class: 'disable-label',
    link: SYSTEM_CONFIGURATION_PATH,
  },
  {
    label: 'Geo Administration',
    class: 'disable-label',
    link: SC_GEO_ADMINISTRATION_PATH,
  },
  {
    label: 'Territory Management',
    class: 'disable-label',
    link: '/system-configuration/tenant-admin/geo-admin/territories/list',
  },
];
