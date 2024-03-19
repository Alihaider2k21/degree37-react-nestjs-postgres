import React from 'react';
import Layout from '../../../../components/common/layout';
import DonorUpsert from '../../../../components/crm/contacts/donor/Upsert';
import CheckPermission from '../../../../helpers/CheckPermissions';
import CrmPermissions from '../../../../enums/CrmPermissionsEnum';
import NotAuthorizedPage from '../../../not-authorized/NotAuthorizedPage';

const CreateDonor = () => {
  const hasPermission = CheckPermission([
    CrmPermissions.CRM.CONTACTS.DONOR.WRITE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <DonorUpsert />
      </Layout>
    );
  } else {
    return <NotAuthorizedPage />;
  }
};

export default CreateDonor;
