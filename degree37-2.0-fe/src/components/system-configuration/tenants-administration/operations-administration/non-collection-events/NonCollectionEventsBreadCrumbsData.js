import {
  SC_OPERATIONS_ADMINISTRATION_PATH,
  SYSTEM_CONFIGURATION_PATH,
} from '../../../../../routes/path';

export const NonCollectionEventsBreadCrumbsData = [
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
    label: 'Non Collection Events',
    class: 'disable-label',
    link: '/system-configuration/tenant-admin/operations-admin/nce-categories/list',
  },
];
