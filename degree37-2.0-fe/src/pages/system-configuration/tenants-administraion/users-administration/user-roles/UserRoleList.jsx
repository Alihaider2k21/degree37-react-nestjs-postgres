import React from 'react';
import Layout from '../../../../../components/common/layout/index';
import ListUserRole from '../../../../../components/system-configuration/users-administration/user-roles/ListUserRole';
import CheckPermission from '../../../../../helpers/CheckPermissions.js';
import Permissions from '../../../../../enums/PermissionsEnum.js';
import NotAuthorizedPage from '../../../../not-authorized/NotAuthorizedPage.jsx';

const TenantUserRolesList = () => {
  return CheckPermission(null, [
    Permissions.USER_ADMINISTRATIONS.USER_ROLES.MODULE_CODE,
  ]) ? (
    <Layout>
      <ListUserRole />
    </Layout>
  ) : (
    <NotAuthorizedPage />
  );
};

export default TenantUserRolesList;
