import React from 'react';
import Layout from '../../../../../../../components/common/layout/index';
import OrganizationalLevelView from '../../../../../../../components/system-configuration/tenants-administration/organizational-administration/hierarchy/organizational-levels/ViewOrganizationalLevels';
import NotFoundPage from '../../../../../../not-found/NotFoundPage.jsx';
import CheckPermission from '../../../../../../../helpers/CheckPermissions.js';
import Permissions from '../../../../../../../enums/PermissionsEnum.js';

const ViewOrganizationalLevels = () => {
  return CheckPermission([
    Permissions.ORGANIZATIONAL_ADMINISTRATION.HIERARCHY.ORGANIZATIONAL_LEVELS
      .READ,
  ]) ? (
    <Layout>
      <OrganizationalLevelView />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default ViewOrganizationalLevels;
