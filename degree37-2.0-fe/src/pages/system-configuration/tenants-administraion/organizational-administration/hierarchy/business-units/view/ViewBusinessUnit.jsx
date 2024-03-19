import React from 'react';
import Layout from '../../../../../../../components/common/layout';
import ViewBusinessUnit from '../../../../../../../components/system-configuration/tenants-administration/organizational-administration/hierarchy/business-units/ViewBusinessUnit';
import NotFoundPage from '../../../../../../not-found/NotFoundPage.jsx';
import CheckPermission from '../../../../../../../helpers/CheckPermissions.js';
import Permissions from '../../../../../../../enums/PermissionsEnum.js';

const BusinessUnitView = () => {
  return CheckPermission([
    Permissions.ORGANIZATIONAL_ADMINISTRATION.HIERARCHY.BUSINESS_UNITS.READ,
  ]) ? (
    <Layout>
      <ViewBusinessUnit />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};
export default BusinessUnitView;
