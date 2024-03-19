import React from 'react';
import Layout from '../../../../../../components/common/layout';
import ListMonthlyGoals from '../../../../../../components/system-configuration/tenants-administration/organizational-administration/goals/monthly-goals/ListMonthlyGoals';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

const MonthlyGoalsList = () => {
  const hasPermission = CheckPermission(null, [
    Permissions.ORGANIZATIONAL_ADMINISTRATION.GOALS.MONTHLY_GOALS.MODULE_CODE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <ListMonthlyGoals />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default MonthlyGoalsList;
