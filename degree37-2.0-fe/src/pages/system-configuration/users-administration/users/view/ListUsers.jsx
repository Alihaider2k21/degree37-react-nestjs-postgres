import React from 'react';
import Layout from '../../../../../components/common/layout';
import UsersList from '../../../../../components/system-configuration/users-administration/users/UsersList';
import CheckPermission from '../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../enums/PermissionsEnum';
import NotAuthorizedPage from '../../../../not-authorized/NotAuthorizedPage';

const ListTenants = () => {
  const hasPermission = CheckPermission(null, [
    Permissions.SYSTEM_CONFIGURATION.USER_ADMINISTRATION.MODULE_CODE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <UsersList />
      </Layout>
    );
  } else {
    return <NotAuthorizedPage />;
  }
};

export default ListTenants;
