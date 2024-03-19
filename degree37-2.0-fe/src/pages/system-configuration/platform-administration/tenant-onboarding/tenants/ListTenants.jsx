import React from 'react';
import TenantsList from '../../../../../components/system-configuration/platform-administration/tenant-onboarding/tenant/TenantsList';
import Layout from '../../../../../components/common/layout';
import Permissions from '../../../../../enums/PermissionsEnum';
import CheckPermission from '../../../../../helpers/CheckPermissions';
import NotAuthorizedPage from '../../../../not-authorized/NotAuthorizedPage';

const ListTenants = () => {
  const hasPermission = CheckPermission(null, [
    Permissions.SYSTEM_CONFIGURATION.TENANT_MANAGEMENT.MODULE_CODE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <TenantsList />
      </Layout>
    );
  } else {
    return <NotAuthorizedPage />;
  }
};

export default ListTenants;
