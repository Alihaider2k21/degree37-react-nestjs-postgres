import React from 'react';
import Layout from '../../../../../../components/common/layout';
import MonthlyGoalEdit from '../../../../../../components/system-configuration/tenants-administration/organizational-administration/goals/monthly-goals/MonthlyGoalEdit';
import { useParams } from 'react-router-dom';
import CheckPermission from '../../../../../../helpers/CheckPermissions.js';
import Permissions from '../../../../../../enums/PermissionsEnum.js';
import NotFoundPage from '../../../../../not-found/NotFoundPage.jsx';

const EditMonthlyGoal = () => {
  const { id } = useParams();
  return CheckPermission([
    Permissions.ORGANIZATIONAL_ADMINISTRATION.GOALS.MONTHLY_GOALS.WRITE,
  ]) ? (
    <Layout>
      <MonthlyGoalEdit goalId={id} />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default EditMonthlyGoal;
