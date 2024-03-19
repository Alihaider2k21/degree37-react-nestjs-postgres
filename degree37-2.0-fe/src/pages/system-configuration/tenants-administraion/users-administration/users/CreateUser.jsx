import AddUser from '../../../../../components/system-configuration/tenants-administration/user-administration/users/AddUser';
import React from 'react';
import Layout from '../../../../../components/common/layout/index';
import NotAuthorizedPage from '../../../../not-authorized/NotAuthorizedPage.jsx';
import Permissions from '../../../../../enums/PermissionsEnum.js';
import CheckPermission from '../../../../../helpers/CheckPermissions.js';

const CreateUser = () => {
  return CheckPermission([Permissions.USER_ADMINISTRATIONS.USERS.WRITE]) ? (
    <Layout>
      <AddUser />
    </Layout>
  ) : (
    <NotAuthorizedPage />
  );
};

export default CreateUser;
