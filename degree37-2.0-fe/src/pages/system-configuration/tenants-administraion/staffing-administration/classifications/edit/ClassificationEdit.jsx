import React from 'react';
import Layout from '../../../../../../components/common/layout/index';
import EditClassification from '../../../../../../components/system-configuration/tenants-administration/staffing-administration/classifications/EditClassification';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

const ClassificationEdit = () => {
  return CheckPermission([
    Permissions.STAFF_ADMINISTRATION.CLASSIFICATIONS.CLASSIFICATIONS.WRITE,
  ]) ? (
    <Layout>
      <EditClassification />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default ClassificationEdit;
