import React from 'react';
import Layout from '../../../components/common/layout';
import CheckPermission from '../../../helpers/CheckPermissions';
import NotAuthorizedPage from '../../not-authorized/NotAuthorizedPage';
import StaffingPermissions from '../../../enums/StaffingPermissionsEnum';
import ViewSchedule from '../../../components/staffing-management/view-schedule/ViewSchedule';
const ScheduleView = () => {
  const hasPermission = CheckPermission(null, [
    StaffingPermissions.STAFFING_MANAGEMENT.VIEW_SCHEDULE.MODULE_CODE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <ViewSchedule />
      </Layout>
    );
  } else {
    return <NotAuthorizedPage />;
  }
};
export default ScheduleView;
