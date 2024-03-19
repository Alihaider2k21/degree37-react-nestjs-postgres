import React from 'react';
import Layout from '../../../../components/common/layout';
import StaffUpsert from '../../../../components/crm/contacts/staff/Upsert';
import CheckPermission from '../../../../helpers/CheckPermissions';
import CrmPermissions from '../../../../enums/CrmPermissionsEnum';
import NotAuthorizedPage from '../../../not-authorized/NotAuthorizedPage';

const CreateDonor = () => {
  const hasPermission = CheckPermission([
    CrmPermissions.CRM.CONTACTS.STAFF.WRITE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <StaffUpsert />
      </Layout>
    );
  } else {
    return <NotAuthorizedPage />;
  }
};

export default CreateDonor;
