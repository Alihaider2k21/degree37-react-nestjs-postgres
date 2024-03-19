import React from 'react';
import Layout from '../../../../../components/common/layout/index';
import CreateUserRole from '../../../../../components/system-configuration/users-administration/user-roles/CreateUserRole';
import NotAuthorizedPage from '../../../../not-authorized/NotAuthorizedPage.jsx';
import CheckPermission from '../../../../../helpers/CheckPermissions.js';
import Permissions from '../../../../../enums/PermissionsEnum.js';

const UserRolesCreate = () => {
  return CheckPermission([
    Permissions.USER_ADMINISTRATIONS.USER_ROLES.WRITE,
  ]) ? (
    <Layout>
      <CreateUserRole />
    </Layout>
  ) : (
    <NotAuthorizedPage />
  );
};

export default UserRolesCreate;
