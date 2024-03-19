import React from 'react';
import ListAllOrganizationalLevels from '../../../../../../components/system-configuration/tenants-administration/organizational-administration/hierarchy/organizational-levels/ListOrganizationalLevels';
import Layout from '../../../../../../components/common/layout';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

const ListOrganizationalLevels = () => {
  const hasPermission = CheckPermission(null, [
    Permissions.ORGANIZATIONAL_ADMINISTRATION.HIERARCHY.ORGANIZATIONAL_LEVELS
      .MODULE_CODE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <ListAllOrganizationalLevels />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default ListOrganizationalLevels;
