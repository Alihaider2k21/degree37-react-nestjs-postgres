import React from 'react';
import Layout from '../../../../../components/common/layout';
import AddUser from '../../../../../components/system-configuration/users-administration/users/AddUser';
import CheckPermission from '../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../enums/PermissionsEnum';
import NotAuthorizedPage from '../../../../not-authorized/NotAuthorizedPage';

const CreateUser = () => {
  const hasPermission = CheckPermission([
    Permissions.SYSTEM_CONFIGURATION.USER_ADMINISTRATION.WRITE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <AddUser />
      </Layout>
    );
  } else {
    return <NotAuthorizedPage />;
  }
};

export default CreateUser;
