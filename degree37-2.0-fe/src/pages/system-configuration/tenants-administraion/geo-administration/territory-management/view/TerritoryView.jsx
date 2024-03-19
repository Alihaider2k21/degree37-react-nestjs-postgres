import React from 'react';
import Layout from '../../../../../../components/common/layout';
import ViewTerritory from '../../../../../../components/system-configuration/tenants-administration/geo-administration/territory-management/ViewTerritory';
import NotFoundPage from '../../../../../not-found/NotFoundPage.jsx';
import Permissions from '../../../../../../enums/PermissionsEnum.js';
import CheckPermission from '../../../../../../helpers/CheckPermissions.js';

const TerritoryView = () => {
  return CheckPermission([
    Permissions.GEO_ADMINISTRATION.TERRITORY_MANAGEMENT.READ,
  ]) ? (
    <Layout>
      <ViewTerritory />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default TerritoryView;
