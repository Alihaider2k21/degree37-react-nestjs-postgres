import React from 'react';
import Layout from '../../../../../../components/common/layout';
import ListDailyGoalsAllocation from '../../../../../../components/system-configuration/tenants-administration/organizational-administration/goals/daily-goals-allocation/ListDailyGoalsAllocation';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

const DailyGoalsAllocationList = () => {
  const hasPermission = CheckPermission(null, [
    Permissions.ORGANIZATIONAL_ADMINISTRATION.GOALS.DAILY_GOALS_ALLOCATION
      .MODULE_CODE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <ListDailyGoalsAllocation />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default DailyGoalsAllocationList;
