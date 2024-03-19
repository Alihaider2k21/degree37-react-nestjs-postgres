import React from 'react';
import FacilitiesList from '../../../components/system-configuration/tenants-administration/organizational-administration/resources/facilities-management/FacilitiesList.js';

import Layout from '../../../components/common/layout';
import CheckPermission from '../../../helpers/CheckPermissions.js';
import NotFoundPage from '../../not-found/NotFoundPage.jsx';
import Permissions from '../../../enums/PermissionsEnum.js';
const ListFacilities = () => {
  return CheckPermission(null, [
    Permissions.ORGANIZATIONAL_ADMINISTRATION.RESOURCES.FACILITIES.MODULE_CODE,
  ]) ? (
    <Layout>
      <FacilitiesList />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default ListFacilities;
