import React from 'react';
import Layout from '../../../../components/common/layout';
import VolunteersList from '../../../../components/crm/contacts/volunteers/VolunteersList';
import CrmPermissions from '../../../../enums/CrmPermissionsEnum';
import CheckPermission from '../../../../helpers/CheckPermissions';
import NotAuthorizedPage from '../../../not-authorized/NotAuthorizedPage';

const ListVolunteers = () => {
  const hasPermission = CheckPermission(null, [
    CrmPermissions.CRM.CONTACTS.VOLUNTEERS.MODULE_CODE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <VolunteersList />
      </Layout>
    );
  } else {
    return <NotAuthorizedPage />;
  }
};

export default ListVolunteers;
