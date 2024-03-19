import { CRM_CONTACTS_PATH, CRM_PATH } from '../../../../routes/path';

export const VolunteersBreadCrumbsData = [
  {
    label: 'CRM',
    class: 'disable-label',
    link: CRM_PATH,
  },
  {
    label: 'Contacts',
    class: 'disable-label',
    link: CRM_CONTACTS_PATH,
  },
  {
    label: 'Volunteer',
    class: 'disable-label',
    link: '/crm/contacts/volunteers',
  },
];
