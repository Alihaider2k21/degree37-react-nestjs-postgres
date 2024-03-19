import UsersLists from '../../../../../components/system-configuration/tenants-administration/user-administration/users/UsersList';
import React from 'react';
import Layout from '../../../../../components/common/layout/index';
import CheckPermission from '../../../../../helpers/CheckPermissions.js';
import Permissions from '../../../../../enums/PermissionsEnum.js';
import NotAuthorizedPage from '../../../../not-authorized/NotAuthorizedPage.jsx';

const UsersList = () => {
  return CheckPermission(null, [
    Permissions.USER_ADMINISTRATIONS.USERS.MODULE_CODE,
  ]) ? (
    <Layout>
      <UsersLists />
    </Layout>
  ) : (
    <NotAuthorizedPage />
  );
};

export default UsersList;
