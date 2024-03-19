import React from 'react';
import ViewDailyGoalsCalender from '../../../../../../components/system-configuration/tenants-administration/organizational-administration/goals/daily-goals-calender/ViewGoalsCalender';
import Layout from '../../../../../../components/common/layout';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

const DailyGoalsCalenderView = () => {
  const hasPermission = CheckPermission(null, [
    Permissions.ORGANIZATIONAL_ADMINISTRATION.GOALS.DAILY_GOALS_CALENDAR
      .MODULE_CODE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <ViewDailyGoalsCalender />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default DailyGoalsCalenderView;
