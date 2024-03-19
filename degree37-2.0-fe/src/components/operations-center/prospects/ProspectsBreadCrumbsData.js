import { OPERATIONS_CENTER, OS_PROSPECTS_PATH } from '../../../routes/path';

export const ProspectsBreadCrumbsData = [
  {
    label: 'Operations Center',
    class: 'disable-label',
    link: OPERATIONS_CENTER.DASHBOARD,
  },
  {
    label: 'Prospect',
    class: 'active-label',
    link: OS_PROSPECTS_PATH.CREATE,
  },
  {
    label: 'Create Prospect',
    class: 'active-label',
    link: OS_PROSPECTS_PATH.CREATE,
  },
];
