import React from 'react';
import Layout from '../../../../../components/common/layout';
import ViewDetail from '../../../../../components/system-configuration/tenants-administration/staffing-administration/staff-setup/detail';
import CheckPermission from '../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../not-found/NotFoundPage';

const ViewDetailOfStafSetup = () => {
  return CheckPermission([
    Permissions.STAFF_ADMINISTRATION.STAFF_SETUPS.WRITE,
  ]) ? (
    <Layout>
      <ViewDetail />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default ViewDetailOfStafSetup;
