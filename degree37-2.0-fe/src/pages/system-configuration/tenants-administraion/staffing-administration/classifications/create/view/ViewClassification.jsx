import React from 'react';
import Layout from '../../../../../../../components/common/layout';
import ViewSingleClassification from '../../../../../../../components/system-configuration/tenants-administration/staffing-administration/classifications/ViewSingleClassification';
import CheckPermission from '../../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../../not-found/NotFoundPage';

const ViewClassification = () => {
  return CheckPermission([
    Permissions.STAFF_ADMINISTRATION.CLASSIFICATIONS.CLASSIFICATIONS.READ,
  ]) ? (
    <Layout>
      <ViewSingleClassification />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default ViewClassification;
