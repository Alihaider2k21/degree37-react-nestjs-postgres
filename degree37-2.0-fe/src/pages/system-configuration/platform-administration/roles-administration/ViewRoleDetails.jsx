import React from 'react';
import ViewRoleDetails from '../../../../components/system-configuration/platform-administration/roles-administration/ViewRoleDetails/ViewRoleDetails';
import Layout from '../../../../components/common/layout';
import Permissions from '../../../../enums/PermissionsEnum';
import CheckPermission from '../../../../helpers/CheckPermissions';
import NotAuthorizedPage from '../../../not-authorized/NotAuthorizedPage';

const ViewRoleDetail = () => {
  const hasPermission = CheckPermission([
    Permissions.SYSTEM_CONFIGURATION.ROLE_ADMINISTRATION.READ,
    Permissions.SYSTEM_CONFIGURATION.ROLE_ADMINISTRATION.WRITE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <ViewRoleDetails />
      </Layout>
    );
  } else {
    return <NotAuthorizedPage />;
  }
};

export default ViewRoleDetail;
