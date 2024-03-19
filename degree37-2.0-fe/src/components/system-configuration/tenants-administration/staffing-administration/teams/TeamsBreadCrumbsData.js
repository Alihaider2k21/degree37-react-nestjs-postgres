import {
  SC_STAFF_ADMINISTRATION_PATH,
  SYSTEM_CONFIGURATION_PATH,
  TEAMS_ASSIGN_MEMBERS,
  TEAMS_PATH,
} from '../../../../../routes/path';

export const TeamsBreadCrumbsData = [
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
    label: 'Teams',
    class: 'active-label',
    link: TEAMS_PATH.LIST,
  },
];
export const TeamsAssignMembersBreadCrumbsData = [
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
    label: 'Assign Members',
    class: 'active-label',
    link: TEAMS_ASSIGN_MEMBERS.ASSIGN,
  },
];
