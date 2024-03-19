import React from 'react';
import ViewLeaveType from '../../../../../components/system-configuration/tenants-administration/staffing-administration/leave-types/ViewLeaveType.js';
import Layout from '../../../../../components/common/layout/index.js';
import CheckPermission from '../../../../../helpers/CheckPermissions.js';
import Permissions from '../../../../../enums/PermissionsEnum.js';
import NotFoundPage from '../../../../not-found/NotFoundPage.jsx';

const ViewLeave = () => {
  return CheckPermission([
    Permissions.STAFF_ADMINISTRATION.LEAVE_TYPES.READ,
  ]) ? (
    <Layout>
      <ViewLeaveType />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default ViewLeave;
