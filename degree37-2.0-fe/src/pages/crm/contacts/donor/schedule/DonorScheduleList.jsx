import React from 'react';
import NotAuthorizedPage from '../../../../not-authorized/NotAuthorizedPage';
import CrmPermissions from '../../../../../enums/CrmPermissionsEnum';
import CheckPermission from '../../../../../helpers/CheckPermissions';
import DonorListSchedule from '../../../../../components/crm/contacts/donors/schedule/DonorListSchedule';

const DonorScheduleList = () => {
  const hasPermission = CheckPermission([
    CrmPermissions.CRM.CONTACTS.DONOR.READ,
    CrmPermissions.CRM.CONTACTS.DONOR.WRITE,
  ]);
  if (hasPermission) {
    return <DonorListSchedule />;
  } else {
    return <NotAuthorizedPage />;
  }
};

export default DonorScheduleList;
