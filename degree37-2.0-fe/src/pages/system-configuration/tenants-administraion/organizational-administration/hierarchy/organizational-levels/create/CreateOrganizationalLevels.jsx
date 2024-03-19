import React from 'react';
import Layout from '../../../../../../../components/common/layout/index';
import AddOrganizationalLevel from '../../../../../../../components/system-configuration/tenants-administration/organizational-administration/hierarchy/organizational-levels/AddOrganizationalLevels';
import NotFoundPage from '../../../../../../not-found/NotFoundPage.jsx';
import Permissions from '../../../../../../../enums/PermissionsEnum.js';
import CheckPermission from '../../../../../../../helpers/CheckPermissions.js';

const CreateOrganizationalLevels = () => {
  return CheckPermission([
    Permissions.ORGANIZATIONAL_ADMINISTRATION.HIERARCHY.ORGANIZATIONAL_LEVELS
      .WRITE,
  ]) ? (
    <Layout>
      <AddOrganizationalLevel />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default CreateOrganizationalLevels;
