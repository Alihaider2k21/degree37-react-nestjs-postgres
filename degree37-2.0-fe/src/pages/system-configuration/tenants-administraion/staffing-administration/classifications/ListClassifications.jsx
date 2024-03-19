import React from 'react';
import Layout from '../../../../../components/common/layout';
import ListClassification from '../../../../../components/system-configuration/tenants-administration/staffing-administration/classifications/ListClassification';
import CheckPermission from '../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../not-found/NotFoundPage';

const ListClassifications = () => {
  return CheckPermission(null, [
    Permissions.STAFF_ADMINISTRATION.CLASSIFICATIONS.CLASSIFICATIONS
      .MODULE_CODE,
  ]) ? (
    <Layout>
      <ListClassification />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default ListClassifications;
