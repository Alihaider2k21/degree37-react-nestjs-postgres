import React from 'react';
import Layout from '../../../../../../components/common/layout';
import EditTerritory from '../../../../../../components/system-configuration/tenants-administration/geo-administration/territory-management/EditTerritory';
import CheckPermission from '../../../../../../helpers/CheckPermissions.js';
import NotFoundPage from '../../../../../not-found/NotFoundPage.jsx';
import Permissions from '../../../../../../enums/PermissionsEnum.js';

const TerritoryEdit = () => {
  return CheckPermission([
    Permissions.GEO_ADMINISTRATION.TERRITORY_MANAGEMENT.WRITE,
  ]) ? (
    <Layout>
      <EditTerritory />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};
export default TerritoryEdit;
