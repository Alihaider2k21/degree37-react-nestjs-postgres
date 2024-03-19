import React from 'react';
import Layout from '../../../../../../../components/common/layout';
import ViewSource from '../../../../../../../components/system-configuration/tenants-administration/crm-administration/account/sources/ViewSource';
import CheckPermission from '../../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../../not-found/NotFoundPage';

const ViewSources = () => {
  const hasPermission = CheckPermission([
    Permissions.CRM_ADMINISTRATION.ACCOUNTS.SOURCES.READ,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <ViewSource />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};
export default ViewSources;
