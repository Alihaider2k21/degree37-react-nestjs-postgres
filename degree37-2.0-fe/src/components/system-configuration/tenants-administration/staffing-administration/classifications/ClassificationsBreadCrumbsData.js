import {
  CLASSIFICATIONS_PATH,
  SC_STAFF_ADMINISTRATION_PATH,
  SYSTEM_CONFIGURATION_PATH,
} from '../../../../../routes/path';

export const ClassificationsBreadCrumbsData = [
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
    label: 'Classifications',
    class: 'disable-label',
    link: CLASSIFICATIONS_PATH.LIST,
  },
];
