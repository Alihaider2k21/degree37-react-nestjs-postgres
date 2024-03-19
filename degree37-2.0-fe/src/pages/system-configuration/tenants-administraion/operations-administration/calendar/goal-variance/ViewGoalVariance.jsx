import React from 'react';
import Layout from '../../../../../../components/common/layout/index';
import GoalVarianceView from '../../../../../../components/system-configuration/tenants-administration/operations-administration/calendar/goal-variance/GoalVarianceView';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

const ViewGoalVariance = () => {
  return CheckPermission(null, [
    Permissions.OPERATIONS_ADMINISTRATION.CALENDAR.GOAL_VARIANCE.MODULE_CODE,
  ]) ? (
    <Layout>
      <GoalVarianceView />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default ViewGoalVariance;
