import React from 'react';
import Layout from '../../../../../../components/common/layout/index';
import AddTerritory from '../../../../../../components/system-configuration/tenants-administration/geo-administration/territory-management/AddTerritory';
import CheckPermission from '../../../../../../helpers/CheckPermissions.js';
import Permissions from '../../../../../../enums/PermissionsEnum.js';
import NotFoundPage from '../../../../../not-found/NotFoundPage.jsx';

const CreateTerritory = () => {
  return CheckPermission([
    Permissions.GEO_ADMINISTRATION.TERRITORY_MANAGEMENT.WRITE,
  ]) ? (
    <Layout>
      <AddTerritory />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default CreateTerritory;
