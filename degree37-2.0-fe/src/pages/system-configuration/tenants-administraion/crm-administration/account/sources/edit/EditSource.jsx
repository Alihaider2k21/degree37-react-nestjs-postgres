import React from 'react';
import Layout from '../../../../../../../components/common/layout';
import EditSource from '../../../../../../../components/system-configuration/tenants-administration/crm-administration/account/sources/EditSource';
import CheckPermission from '../../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../../not-found/NotFoundPage';

const EditSources = () => {
  const hasPermission = CheckPermission([
    Permissions.CRM_ADMINISTRATION.ACCOUNTS.SOURCES.WRITE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <EditSource />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};
export default EditSources;
