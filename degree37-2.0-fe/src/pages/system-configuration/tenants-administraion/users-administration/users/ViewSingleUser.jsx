import ViewSingle from '../../../../../components/system-configuration/tenants-administration/user-administration/users/ViewSingleUser';
import React from 'react';
import Layout from '../../../../../components/common/layout/index';
import NotAuthorizedPage from '../../../../not-authorized/NotAuthorizedPage.jsx';
import CheckPermission from '../../../../../helpers/CheckPermissions.js';
import Permissions from '../../../../../enums/PermissionsEnum.js';

const ViewSingleUser = () => {
  return CheckPermission([Permissions.USER_ADMINISTRATIONS.USERS.WRITE]) ? (
    <Layout>
      <ViewSingle />
    </Layout>
  ) : (
    <NotAuthorizedPage />
  );
};

export default ViewSingleUser;
