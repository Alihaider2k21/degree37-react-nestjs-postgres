import { CRM_CONTACTS_PATH, CRM_PATH } from '../../../../routes/path';

export const DonorBreadCrumbsData = [
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
    label: 'Donor',
    class: 'disable-label',
    link: '/crm/contacts/donor',
  },
];