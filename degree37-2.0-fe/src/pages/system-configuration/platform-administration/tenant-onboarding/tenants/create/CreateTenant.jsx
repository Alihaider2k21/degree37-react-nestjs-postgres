import AddTenant from '../../../../../../components/system-configuration/platform-administration/tenant-onboarding/tenant/AddTenant';

import React from 'react';
import Layout from '../../../../../../components/common/layout/index';
import Permissions from '../../../../../../enums/PermissionsEnum';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import NotAuthorizedPage from '../../../../../not-authorized/NotAuthorizedPage';

const CreateTenant = () => {
  const hasPermission = CheckPermission([
    Permissions.SYSTEM_CONFIGURATION.TENANT_MANAGEMENT.WRITE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <AddTenant />
      </Layout>
    );
  } else {
    return <NotAuthorizedPage />;
  }
};

export default CreateTenant;
