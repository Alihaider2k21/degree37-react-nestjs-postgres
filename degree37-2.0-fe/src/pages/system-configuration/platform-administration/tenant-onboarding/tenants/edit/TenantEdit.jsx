import React from 'react';
import EditTenant from '../../../../../../components/system-configuration/platform-administration/tenant-onboarding/tenant/TenantEdit';
import Layout from '../../../../../../components/common/layout/index';
import Permissions from '../../../../../../enums/PermissionsEnum';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import NotAuthorizedPage from '../../../../../not-authorized/NotAuthorizedPage';

const TenantEdit = () => {
  const hasPermission = CheckPermission([
    Permissions.SYSTEM_CONFIGURATION.TENANT_MANAGEMENT.WRITE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <EditTenant />
      </Layout>
    );
  } else {
    return <NotAuthorizedPage />;
  }
};
export default TenantEdit;
