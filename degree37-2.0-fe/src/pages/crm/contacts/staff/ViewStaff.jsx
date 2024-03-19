import React from 'react';
import DonorView from '../../../../components/crm/contacts/donor/DonorView';
import CheckPermission from '../../../../helpers/CheckPermissions';
import CrmPermissions from '../../../../enums/CrmPermissionsEnum';
import NotAuthorizedPage from '../../../not-authorized/NotAuthorizedPage';

const ViewDonor = () => {
  const hasPermission = CheckPermission([
    CrmPermissions.CRM.CONTACTS.STAFF.WRITE,
    CrmPermissions.CRM.CONTACTS.STAFF.READ,
  ]);
  if (hasPermission) {
    return <DonorView />;
  } else {
    return <NotAuthorizedPage />;
  }
};

export default ViewDonor;
