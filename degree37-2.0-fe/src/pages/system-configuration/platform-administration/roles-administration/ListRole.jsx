import React from 'react';
import RolesList from '../../../../components/system-configuration/platform-administration/roles-administration/RolesList';
import Layout from '../../../../components/common/layout';
import Permissions from '../../../../enums/PermissionsEnum';
import CheckPermission from '../../../../helpers/CheckPermissions';
import NotAuthorizedPage from '../../../not-authorized/NotAuthorizedPage';

const ListRole = () => {
  const hasPermission = CheckPermission(null, [
    Permissions.SYSTEM_CONFIGURATION.ROLE_ADMINISTRATION.MODULE_CODE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <RolesList />
      </Layout>
    );
  } else {
    return <NotAuthorizedPage />;
  }
};

export default ListRole;
