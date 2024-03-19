import {
  SC_OPERATIONS_ADMINISTRATION_PATH,
  SYSTEM_CONFIGURATION_PATH,
} from '../../../../../routes/path';

export const NotesAttachmentBreadCrumbsData = [
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
    label: 'Notes & Attachments',
    class: 'disable-label',
    link: '/system-configuration/tenant-admin/operations-admin/notes-attachments/attachment-categories',
  },
];
