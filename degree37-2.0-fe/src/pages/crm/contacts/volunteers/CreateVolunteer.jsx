import React from 'react';
import Layout from '../../../../components/common/layout';
import VolunteerUpsert from '../../../../components/crm/contacts/volunteers/Upsert';
import CrmPermissions from '../../../../enums/CrmPermissionsEnum';
import CheckPermission from '../../../../helpers/CheckPermissions';
import NotAuthorizedPage from '../../../not-authorized/NotAuthorizedPage';

const CreateVolunteer = () => {
  const hasPermission = CheckPermission([
    CrmPermissions.CRM.CONTACTS.VOLUNTEERS.WRITE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <VolunteerUpsert />
      </Layout>
    );
  } else {
    return <NotAuthorizedPage />;
  }
};

export default CreateVolunteer;
