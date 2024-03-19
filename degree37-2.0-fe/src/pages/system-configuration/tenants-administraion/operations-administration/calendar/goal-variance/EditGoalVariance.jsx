import React from 'react';
import Layout from '../../../../../../components/common/layout/index';
import GoalVarianceEdit from '../../../../../../components/system-configuration/tenants-administration/operations-administration/calendar/goal-variance/GoalVarianceEdit';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

const EditGoalVariance = () => {
  return CheckPermission([
    Permissions.OPERATIONS_ADMINISTRATION.CALENDAR.GOAL_VARIANCE.WRITE,
  ]) ? (
    <Layout>
      <GoalVarianceEdit />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default EditGoalVariance;
