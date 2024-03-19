import {
  SC_USER_ADMINISTRATION_PATH,
  SYSTEM_CONFIGURATION_PATH,
} from '../../../../routes/path';

export const UsersBreadCrumbsData = [
  {
    label: 'System Configurations',
    class: 'disable-label',
    link: SYSTEM_CONFIGURATION_PATH,
  },
  {
    label: 'User Administration',
    class: 'disable-label',
    link: SC_USER_ADMINISTRATION_PATH,
  },
];
