/* eslint-disable */

import React from 'react';
import Layout from '../../../components/common/layout';
import BuildSchedule from '../../../components/staffing-management/build-schedule/BuildSchedule';
import NotAuthorizedPage from '../../not-authorized/NotAuthorizedPage';
import StaffingPermissions from '../../../enums/StaffingPermissionsEnum';
import CheckPermission from '../../../helpers/CheckPermissions';
const buildSchedule = () => {
  const hasPermission = CheckPermission(null, [
    StaffingPermissions.STAFFING_MANAGEMENT.BUILD_SCHEDULES.MODULE_CODE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <BuildSchedule />
      </Layout>
    );
  } else {
    return <NotAuthorizedPage />;
  }
};

export default buildSchedule;
