import React from 'react';
import Layout from '../../../../../../components/common/layout';
import ListSources from '../../../../../../components/system-configuration/tenants-administration/crm-administration/account/sources/ListSource';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

const SourcesList = () => {
  const hasPermission = CheckPermission(null, [
    Permissions.CRM_ADMINISTRATION.ACCOUNTS.SOURCES.MODULE_CODE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <ListSources />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};
export default SourcesList;
