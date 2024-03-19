import React from 'react';
import Layout from '../../../../../../components/common/layout';
import MonthlyGoalView from '../../../../../../components/system-configuration/tenants-administration/organizational-administration/goals/monthly-goals/MonthlyGoalView';
import { useParams } from 'react-router-dom';
import CheckPermission from '../../../../../../helpers/CheckPermissions.js';
import NotFoundPage from '../../../../../not-found/NotFoundPage.jsx';
import Permissions from '../../../../../../enums/PermissionsEnum.js';

const ViewMonthlyGoal = () => {
  const { id } = useParams();
  return CheckPermission([
    Permissions.ORGANIZATIONAL_ADMINISTRATION.GOALS.MONTHLY_GOALS.READ,
  ]) ? (
    <Layout>
      <MonthlyGoalView goalId={id} />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default ViewMonthlyGoal;
