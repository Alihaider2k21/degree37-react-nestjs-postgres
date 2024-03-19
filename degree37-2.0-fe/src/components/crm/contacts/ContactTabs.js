import CrmPermissions from '../../../enums/CrmPermissionsEnum';
import CheckPermission from '../../../helpers/CheckPermissions';

export const Tabs = [
  CheckPermission([
    CrmPermissions.CRM.CONTACTS.VOLUNTEERS.WRITE,
    CrmPermissions.CRM.CONTACTS.VOLUNTEERS.READ,
  ])
    ? {
        label: 'Volunteers',
        link: '/crm/contacts/volunteers',
      }
    : null,
  CheckPermission([
    CrmPermissions.CRM.CONTACTS.DONOR.WRITE,
    CrmPermissions.CRM.CONTACTS.DONOR.READ,
  ])
    ? {
        label: 'Donor',
        link: '/crm/contacts/donor',
      }
    : null,
  CheckPermission([
    CrmPermissions.CRM.CONTACTS.STAFF.WRITE,
    CrmPermissions.CRM.CONTACTS.STAFF.READ,
  ])
    ? {
        label: 'Staff',
        link: '/crm/contacts/staff',
      }
    : null,
];
