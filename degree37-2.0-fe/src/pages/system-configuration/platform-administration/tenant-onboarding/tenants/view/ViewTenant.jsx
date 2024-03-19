import React from 'react';
import Layout from '../../../../../../components/common/layout/index';
import ViewSingleTenant from '../../../../../../components/system-configuration/platform-administration/tenant-onboarding/tenant/tenantSingle';
import Permissions from '../../../../../../enums/PermissionsEnum';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import NotAuthorizedPage from '../../../../../not-authorized/NotAuthorizedPage';

const ViewTenant = () => {
  const hasPermission = CheckPermission([
    Permissions.SYSTEM_CONFIGURATION.TENANT_MANAGEMENT.READ,
    Permissions.SYSTEM_CONFIGURATION.TENANT_MANAGEMENT.WRITE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <ViewSingleTenant />
      </Layout>
    );
  } else {
    return <NotAuthorizedPage />;
  }
};

export default ViewTenant;
