/* eslint-disable */

import {
  STAFFING_MANAGEMENT_BUILD_SCHEDULE,
  STAFFING_MANAGEMENT_STAFF_LIST,
} from '../../../routes/path';

export const BuildSchduleBreadCrumbData = [
  {
    label: 'Staffing Management',
    class: 'disable-label',
    link: STAFFING_MANAGEMENT_STAFF_LIST,
  },
  {
    label: 'Build Schedule',
    class: 'disable-label',
    link: STAFFING_MANAGEMENT_BUILD_SCHEDULE.LIST,
  },
];

export const CreateScheduleBreadCrumbData = [
  {
    label: 'Staffing Management',
    class: 'disable-label',
    link: STAFFING_MANAGEMENT_STAFF_LIST,
  },
  {
    label: 'Build Schedule',
    class: 'disable-label',
    link: STAFFING_MANAGEMENT_BUILD_SCHEDULE.LIST,
  },
  {
    label: 'Create Schedule',
    class: 'disable-label',
    link: STAFFING_MANAGEMENT_BUILD_SCHEDULE.CREATE,
  },
];
