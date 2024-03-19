import React from 'react';
import Layout from '../../../../../components/common/layout';
import ViewAllStaffSetup from '../../../../../components/system-configuration/tenants-administration/staffing-administration/staff-setup/list';
import CheckPermission from '../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../not-found/NotFoundPage';
const ListStaffSetup = () => {
  return CheckPermission(null, [
    Permissions.STAFF_ADMINISTRATION.STAFF_SETUPS.MODULE_CODE,
  ]) ? (
    <Layout>
      <ViewAllStaffSetup />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default ListStaffSetup;
