import React from 'react';
import Layout from '../../../components/common/layout';
import { useParams } from 'react-router-dom';
import AccountUpsert from '../../../components/crm/accounts/AccountUpsert';
import CrmPermissions from '../../../enums/CrmPermissionsEnum';
import CheckPermission from '../../../helpers/CheckPermissions';
import NotAuthorizedPage from '../../not-authorized/NotAuthorizedPage';

const EditAccount = () => {
  const { account_id } = useParams();
  const hasPermission = CheckPermission([CrmPermissions.CRM.ACCOUNTS.WRITE]);
  if (hasPermission) {
    return (
      <Layout>
        <AccountUpsert accountId={account_id} />
      </Layout>
    );
  } else {
    return <NotAuthorizedPage />;
  }
};

export default EditAccount;
