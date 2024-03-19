import {
  SC_OPERATIONS_ADMINISTRATION_PATH,
  SYSTEM_CONFIGURATION_PATH,
} from '../../../../../routes/path';

export const BookingDrivesBreadCrumbsData = [
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
    label: 'Booking Drives',
    class: 'disable-label',
    link: '/system-configuration/operations-admin/booking-drives/booking-rule',
  },
];
