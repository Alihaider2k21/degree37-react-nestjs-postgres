import React from 'react';
import Layout from '../../../components/common/layout';
import AccountView from '../../../components/crm/accounts/AccountView';
import CrmPermissions from '../../../enums/CrmPermissionsEnum';
import CheckPermission from '../../../helpers/CheckPermissions';
import NotAuthorizedPage from '../../not-authorized/NotAuthorizedPage';

const ViewAccount = () => {
  const hasPermission = CheckPermission([
    CrmPermissions.CRM.ACCOUNTS.WRITE,
    CrmPermissions.CRM.ACCOUNTS.READ,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <AccountView />
      </Layout>
    );
  } else {
    return <NotAuthorizedPage />;
  }
};

export default ViewAccount;
