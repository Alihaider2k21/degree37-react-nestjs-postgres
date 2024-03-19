import React from 'react';
import Layout from '../../../../../../components/common/layout/index';
import GoalVarianceCreate from '../../../../../../components/system-configuration/tenants-administration/operations-administration/calendar/goal-variance/GoalVarianceCreate';
import NotFoundPage from '../../../../../not-found/NotFoundPage';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';

const CreateGoalVariance = () => {
  return CheckPermission([
    Permissions.OPERATIONS_ADMINISTRATION.CALENDAR.GOAL_VARIANCE.WRITE,
  ]) ? (
    <Layout>
      <GoalVarianceCreate />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default CreateGoalVariance;
