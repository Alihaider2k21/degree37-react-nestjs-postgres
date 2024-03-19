import React from 'react';
import Layout from '../../../components/common/layout';
import AccountUpsert from '../../../components/crm/accounts/AccountUpsert';
import CrmPermissions from '../../../enums/CrmPermissionsEnum';
import CheckPermission from '../../../helpers/CheckPermissions';
import NotAuthorizedPage from '../../not-authorized/NotAuthorizedPage';

const CreateAccount = () => {
  const hasPermission = CheckPermission([CrmPermissions.CRM.ACCOUNTS.WRITE]);
  if (hasPermission) {
    return (
      <Layout>
        <AccountUpsert />
      </Layout>
    );
  } else {
    return <NotAuthorizedPage />;
  }
};

export default CreateAccount;
