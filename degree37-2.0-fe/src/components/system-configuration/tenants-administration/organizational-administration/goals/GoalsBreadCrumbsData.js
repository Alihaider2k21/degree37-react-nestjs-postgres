import {
  MONTHLY_GOALS_PATH,
  SC_ORGANIZATIONAL_ADMINISTRATION_PATH,
  SYSTEM_CONFIGURATION_PATH,
} from '../../../../../routes/path';

export const GoalsBreadCrumbsData = [
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
    label: 'Goals',
    class: 'disable-label',
    link: MONTHLY_GOALS_PATH.LIST,
  },
];
