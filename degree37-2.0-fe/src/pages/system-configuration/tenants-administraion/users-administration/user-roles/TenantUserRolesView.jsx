import React from 'react';
import Layout from '../../../../../components/common/layout/index';
import EditTenantUserRole from '../../../../../components/system-configuration/users-administration/user-roles/ViewTenantUserRole';
import { useParams } from 'react-router-dom';
import NotAuthorizedPage from '../../../../not-authorized/NotAuthorizedPage.jsx';
import CheckPermission from '../../../../../helpers/CheckPermissions.js';
import Permissions from '../../../../../enums/PermissionsEnum.js';

const TenantUserRolesView = () => {
  const { id } = useParams();
  return CheckPermission([Permissions.USER_ADMINISTRATIONS.USER_ROLES.READ]) ? (
    <Layout>
      <EditTenantUserRole roleId={id} />
    </Layout>
  ) : (
    <NotAuthorizedPage />
  );
};

export default TenantUserRolesView;
