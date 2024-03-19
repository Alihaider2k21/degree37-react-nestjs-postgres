import AddTenantConfigurations from '../../../../../../components/system-configuration/platform-administration/tenant-onboarding/tenant/tenantConfigurations';
import Layout from '../../../../../../components/common/layout/index.js';
import React from 'react';
import Permissions from '../../../../../../enums/PermissionsEnum';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import NotAuthorizedPage from '../../../../../not-authorized/NotAuthorizedPage';

const CreateTenantConfigurations = () => {
  const hasPermission = CheckPermission([
    Permissions.SYSTEM_CONFIGURATION.TENANT_MANAGEMENT.ADD_CONFIG,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <AddTenantConfigurations />
      </Layout>
    );
  } else {
    return <NotAuthorizedPage />;
  }
};

export default CreateTenantConfigurations;
