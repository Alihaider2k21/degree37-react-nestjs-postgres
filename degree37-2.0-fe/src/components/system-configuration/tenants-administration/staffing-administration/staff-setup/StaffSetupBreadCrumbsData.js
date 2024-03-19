import {
  SC_STAFF_ADMINISTRATION_PATH,
  STAFF_SETUP,
  SYSTEM_CONFIGURATION_PATH,
} from '../../../../../routes/path';

export const StaffSetupBreadCrumbsData = [
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
    label: 'Staff Setups',
    class: 'disable-label',
    link: STAFF_SETUP.LIST,
  },
];
