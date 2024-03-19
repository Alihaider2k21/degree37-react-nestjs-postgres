import React from 'react';
import Layout from '../../../../../components/common/layout';
import EditUser from '../../../../../components/system-configuration/users-administration/users/EditUser';
import CheckPermission from '../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../enums/PermissionsEnum';
import NotAuthorizedPage from '../../../../not-authorized/NotAuthorizedPage';

const UserEdit = () => {
  const hasPermission = CheckPermission([
    Permissions.SYSTEM_CONFIGURATION.USER_ADMINISTRATION.WRITE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <EditUser />
      </Layout>
    );
  } else {
    return <NotAuthorizedPage />;
  }
};

export default UserEdit;
