import React from 'react';
import NotAuthorizedPage from '../../../../not-authorized/NotAuthorizedPage';
import CrmPermissions from '../../../../../enums/CrmPermissionsEnum';
import CheckPermission from '../../../../../helpers/CheckPermissions';
import DonorScheduleView from '../../../../../components/crm/contacts/donors/schedule/DonorScheduleView';

const ViewDonorSchedule = () => {
  const hasPermission = CheckPermission([
    CrmPermissions.CRM.CONTACTS.DONOR.READ,
    CrmPermissions.CRM.CONTACTS.DONOR.WRITE,
  ]);
  if (hasPermission) {
    return <DonorScheduleView />;
  } else {
    return <NotAuthorizedPage />;
  }
};

export default ViewDonorSchedule;
