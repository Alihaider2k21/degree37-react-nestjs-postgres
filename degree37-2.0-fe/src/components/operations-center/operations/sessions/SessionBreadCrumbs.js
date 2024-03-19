import { OPERATIONS_CENTER_SESSIONS_PATH } from '../../../../routes/path';

export const SessionBreadCrumbs = [
  { label: 'Operations Center', class: 'disable-label', link: '/' },
  {
    label: 'Operations',
    class: 'disable-label',
    link: '#',
  },
  {
    label: 'Sessions',
    class: 'disable-label',
    link: OPERATIONS_CENTER_SESSIONS_PATH.LIST,
  },
  {
    label: 'View Session',
    class: 'disable-label',
    link: OPERATIONS_CENTER_SESSIONS_PATH.VIEW,
  },
  {
    label: 'About',
    class: 'disable-label',
    link: OPERATIONS_CENTER_SESSIONS_PATH.VIEW,
  },
  {
    label: 'Shift Details',
    class: 'disable-label',
    link: OPERATIONS_CENTER_SESSIONS_PATH.SHIFT_DETAILS,
  },
];
//adding for temporary until real data replaced
export const ShiftDetails = [
  {
    devices: ['Dive Joe'],
    vehicles: ['Device IOT 4'],
    staff: ['NewRole'],
    start_time: '09:15 AM',
    end_time: '09:17 AM',
    staff_break: {
      start_time: '09:16 AM',
      end_time: '09:17 AM',
    },
  },
  {
    devices: [
      'A Create Room Size, ',
      'Blood tester, ',
      'BP Checker , ',
      'Sugar tester , ',
      'Dive Joe',
    ],
    vehicles: ['Device IOT 4'],
    staff: ['Primary Chairperson'],
    start_time: '11:55 PM',
    end_time: '11:58 PM',
    staff_break: {
      start_time: '',
      end_time: '',
    },
  },
  {
    devices: [
      'A Create Room Size, ',
      'Blood tester, ',
      'BP Checker , ',
      'Sugar tester , ',
      'Dive Joe',
    ],
    vehicles: [
      'Van, ',
      'Mini Truck, ',
      'Bus, ',
      'Van 2, ',
      'Den, ',
      'Device IOT 4',
    ],
    staff: ['Primary Chairperson'],
    start_time: '11:58 PM',
    end_time: '11:59 PM',
    staff_break: {
      start_time: '',
      end_time: '',
    },
  },
  {
    devices: [
      'A Create Room Size, ',
      'Blood tester, ',
      'BP Checker , ',
      'Sugar tester , ',
      'Dive Joe',
    ],
    vehicles: [
      'Van, ',
      'Mini Truck, ',
      'Bus, ',
      'Van 2, ',
      'Den, ',
      'Device IOT 4',
    ],
    staff: ['Primary Chairperson'],
    start_time: '12:02 AM',
    end_time: '12:05 AM',
    staff_break: {
      start_time: '',
      end_time: '',
    },
  },
];
