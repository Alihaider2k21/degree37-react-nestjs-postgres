import React from 'react';
import Layout from '../../../../../../../components/common/layout';
import EditBusinessUnit from '../../../../../../../components/system-configuration/tenants-administration/organizational-administration/hierarchy/business-units/EditBusinessUnit';
import NotFoundPage from '../../../../../../not-found/NotFoundPage.jsx';
import CheckPermission from '../../../../../../../helpers/CheckPermissions.js';
import Permissions from '../../../../../../../enums/PermissionsEnum.js';

const BusinessUnitEdit = () => {
  return CheckPermission([
    Permissions.ORGANIZATIONAL_ADMINISTRATION.HIERARCHY.BUSINESS_UNITS.READ,
  ]) ? (
    <Layout>
      <EditBusinessUnit />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};
export default BusinessUnitEdit;
