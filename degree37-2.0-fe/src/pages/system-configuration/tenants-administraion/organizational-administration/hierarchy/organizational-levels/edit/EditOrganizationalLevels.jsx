import React from 'react';
import Layout from '../../../../../../../components/common/layout/index';
import OrganizationalLevelEdit from '../../../../../../../components/system-configuration/tenants-administration/organizational-administration/hierarchy/organizational-levels/EditOrganizationalLevels';
import NotFoundPage from '../../../../../../not-found/NotFoundPage.jsx';
import CheckPermission from '../../../../../../../helpers/CheckPermissions.js';
import Permissions from '../../../../../../../enums/PermissionsEnum';

const EditOrganizationalLevels = () => {
  return CheckPermission([
    Permissions.ORGANIZATIONAL_ADMINISTRATION.HIERARCHY.ORGANIZATIONAL_LEVELS
      .WRITE,
  ]) ? (
    <Layout>
      <OrganizationalLevelEdit />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default EditOrganizationalLevels;
