import React from 'react';

import DonorsList from '../../../../components/crm/contacts/donor/DonorsList';
import CheckPermission from '../../../../helpers/CheckPermissions';
import CrmPermissions from '../../../../enums/CrmPermissionsEnum';
import NotAuthorizedPage from '../../../not-authorized/NotAuthorizedPage';
import Layout from '../../../../components/common/layout';

const ListDonors = () => {
  const hasPermission = CheckPermission(null, [
    CrmPermissions.CRM.CONTACTS.DONOR.MODULE_CODE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <DonorsList />
      </Layout>
    );
  } else {
    return <NotAuthorizedPage />;
  }
};

export default ListDonors;
