import React from 'react';
import Layout from '../../../components/common/layout';
import AccountList from '../../../components/crm/accounts/AccountList';
import CrmPermissions from '../../../enums/CrmPermissionsEnum';
import CheckPermission from '../../../helpers/CheckPermissions';
import NotAuthorizedPage from '../../not-authorized/NotAuthorizedPage';

const ListAccounts = () => {
  const hasPermission = CheckPermission(null, [
    CrmPermissions.CRM.ACCOUNTS.MODULE_CODE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <AccountList />
      </Layout>
    );
  } else {
    return <NotAuthorizedPage />;
  }
};

export default ListAccounts;
