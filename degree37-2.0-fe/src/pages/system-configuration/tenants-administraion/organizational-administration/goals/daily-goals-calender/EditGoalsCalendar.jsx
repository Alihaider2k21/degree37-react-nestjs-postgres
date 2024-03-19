import React from 'react';
import EditGoalsCalender from '../../../../../../components/system-configuration/tenants-administration/organizational-administration/goals/daily-goals-calender/EditGoalsCalender';
import Layout from '../../../../../../components/common/layout';
import NotFoundPage from '../../../../../not-found/NotFoundPage.jsx';
import CheckPermission from '../../../../../../helpers/CheckPermissions.js';
import Permissions from '../../../../../../enums/PermissionsEnum.js';

const DailyGoalsCalenderEdit = () => {
  return CheckPermission([
    Permissions.ORGANIZATIONAL_ADMINISTRATION.GOALS.DAILY_GOALS_CALENDAR.WRITE,
  ]) ? (
    <Layout>
      <EditGoalsCalender />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default DailyGoalsCalenderEdit;
