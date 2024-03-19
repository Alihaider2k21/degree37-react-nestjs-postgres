import React from 'react';
import Layout from '../../../../components/common/layout';
import AddAdminRoles from '../../../../components/system-configuration/platform-administration/roles-administration/AddAdminRoles';
import CheckPermission from '../../../../helpers/CheckPermissions';
import Permissions from '../../../../enums/PermissionsEnum';
import NotAuthorizedPage from '../../../not-authorized/NotAuthorizedPage';

const AddPlatformAdminRoles = () => {
  const hasPermission = CheckPermission([
    Permissions.SYSTEM_CONFIGURATION.ROLE_ADMINISTRATION.WRITE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <AddAdminRoles />
      </Layout>
    );
  } else {
    return <NotAuthorizedPage />;
  }
};
export default AddPlatformAdminRoles;
