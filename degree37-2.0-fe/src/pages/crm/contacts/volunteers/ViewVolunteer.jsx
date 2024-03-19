import React from 'react';
import VolunteerView from '../../../../components/crm/contacts/volunteers/VolunteerView';
import CrmPermissions from '../../../../enums/CrmPermissionsEnum';
import CheckPermission from '../../../../helpers/CheckPermissions';
import NotAuthorizedPage from '../../../not-authorized/NotAuthorizedPage';

const ViewVolunteer = () => {
  const hasPermission = CheckPermission([
    CrmPermissions.CRM.CONTACTS.VOLUNTEERS.READ,
    CrmPermissions.CRM.CONTACTS.VOLUNTEERS.WRITE,
  ]);
  if (hasPermission) {
    return <VolunteerView />;
  } else {
    return <NotAuthorizedPage />;
  }
};

export default ViewVolunteer;
