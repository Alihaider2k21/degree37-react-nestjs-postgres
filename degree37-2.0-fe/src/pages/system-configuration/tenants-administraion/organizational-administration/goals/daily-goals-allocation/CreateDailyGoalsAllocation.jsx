import React from 'react';
import Layout from '../../../../../../components/common/layout';
import AddDailyGoalsAllocation from '../../../../../../components/system-configuration/tenants-administration/organizational-administration/goals/daily-goals-allocation/AddDailyGoalsAllocation';
import NotFoundPage from '../../../../../not-found/NotFoundPage.jsx';
import CheckPermission from '../../../../../../helpers/CheckPermissions.js';
import Permissions from '../../../../../../enums/PermissionsEnum.js';

const CreateDailyGoalsAllocation = () => {
  return CheckPermission([
    Permissions.ORGANIZATIONAL_ADMINISTRATION.GOALS.DAILY_GOALS_ALLOCATION
      .WRITE,
  ]) ? (
    <Layout>
      <AddDailyGoalsAllocation />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default CreateDailyGoalsAllocation;
