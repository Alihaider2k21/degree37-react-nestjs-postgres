import React from 'react';
import Layout from '../../../../components/common/layout';
import EditAdminRoles from '../../../../components/system-configuration/platform-administration/roles-administration/EditAdminRoles';
import CheckPermission from '../../../../helpers/CheckPermissions';
import Permissions from '../../../../enums/PermissionsEnum';
import NotAuthorizedPage from '../../../not-authorized/NotAuthorizedPage';

const EditPlatformAdminRoles = () => {
  const hasPermission = CheckPermission([
    Permissions.SYSTEM_CONFIGURATION.ROLE_ADMINISTRATION.WRITE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <EditAdminRoles />
      </Layout>
    );
  } else {
    return <NotAuthorizedPage />;
  }
};
export default EditPlatformAdminRoles;
