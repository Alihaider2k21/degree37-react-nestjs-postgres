import React from 'react';
import Layout from '../../../../../../../components/common/layout';
import AddSource from '../../../../../../../components/system-configuration/tenants-administration/crm-administration/account/sources/AddSource';
import NotFoundPage from '../../../../../../not-found/NotFoundPage';
import CheckPermission from '../../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../../enums/PermissionsEnum';

const CreateSource = () => {
  const hasPermission = CheckPermission([
    Permissions.CRM_ADMINISTRATION.ACCOUNTS.SOURCES.WRITE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <AddSource />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};
export default CreateSource;
