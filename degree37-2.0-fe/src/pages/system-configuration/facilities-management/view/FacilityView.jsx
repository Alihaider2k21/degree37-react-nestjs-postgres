import Layout from '../../../../components/common/layout';
import FacilityView from '../../../../components/system-configuration/tenants-administration/organizational-administration/resources/facilities-management/ViewFacility.js';
import React from 'react';
import NotFoundPage from '../../../not-found/NotFoundPage.jsx';
import CheckPermission from '../../../../helpers/CheckPermissions.js';
import Permissions from '../../../../enums/PermissionsEnum.js';

const ViewFacilityLayout = () => {
  return CheckPermission([
    Permissions.ORGANIZATIONAL_ADMINISTRATION.RESOURCES.FACILITIES.READ,
  ]) ? (
    <Layout>
      <FacilityView />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default ViewFacilityLayout;
