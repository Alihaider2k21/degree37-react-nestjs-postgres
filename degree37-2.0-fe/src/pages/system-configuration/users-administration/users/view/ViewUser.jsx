import React from 'react';
import ViewSingleUser from '../../../../../components/system-configuration/users-administration/users/ViewSingleUser';
import Layout from '../../../../../components/common/layout';
import CheckPermission from '../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../enums/PermissionsEnum';
import NotAuthorizedPage from '../../../../not-authorized/NotAuthorizedPage';

const ViewUser = () => {
  const hasPermission = CheckPermission([
    Permissions.SYSTEM_CONFIGURATION.USER_ADMINISTRATION.READ,
    Permissions.SYSTEM_CONFIGURATION.USER_ADMINISTRATION.WRITE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <ViewSingleUser />
      </Layout>
    );
  } else {
    return <NotAuthorizedPage />;
  }
};

export default ViewUser;
