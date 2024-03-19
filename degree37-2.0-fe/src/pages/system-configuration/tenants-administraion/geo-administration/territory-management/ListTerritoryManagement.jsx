import React from 'react';
import Layout from '../../../../../components/common/layout';
import TerritoryManagementList from '../../../../../components/system-configuration/tenants-administration/geo-administration/territory-management/TerritoryManagementList';
import CheckPermission from '../../../../../helpers/CheckPermissions.js';
import NotFoundPage from '../../../../not-found/NotFoundPage.jsx';
import Permissions from '../../../../../enums/PermissionsEnum.js';

const ListTerritoryManagement = () => {
  return CheckPermission(null, [
    Permissions.GEO_ADMINISTRATION.TERRITORY_MANAGEMENT.MODULE_CODE,
  ]) ? (
    <Layout>
      <TerritoryManagementList />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default ListTerritoryManagement;
