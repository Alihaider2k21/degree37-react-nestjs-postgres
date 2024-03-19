import React from 'react';
import LeaveTypeListing from '../../../../../components/system-configuration/tenants-administration/staffing-administration/leave-types/LeaveTypeListing.js';
import Layout from '../../../../../components/common/layout/index.js';
import CheckPermission from '../../../../../helpers/CheckPermissions.js';
import Permissions from '../../../../../enums/PermissionsEnum.js';
import NotFoundPage from '../../../../not-found/NotFoundPage.jsx';

const LeaveType = () => {
  return CheckPermission(null, [
    Permissions.STAFF_ADMINISTRATION.LEAVE_TYPES.MODULE_CODE,
  ]) ? (
    <Layout>
      <LeaveTypeListing />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default LeaveType;
