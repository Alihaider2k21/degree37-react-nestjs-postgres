import React from 'react';
import Layout from '../../../../../../components/common/layout';
import { useParams } from 'react-router-dom';
import DailyGoalsAllocationView from '../../../../../../components/system-configuration/tenants-administration/organizational-administration/goals/daily-goals-allocation/DailyGoalsAllocationView';
import NotFoundPage from '../../../../../not-found/NotFoundPage.jsx';
import CheckPermission from '../../../../../../helpers/CheckPermissions.js';
import Permissions from '../../../../../../enums/PermissionsEnum.js';

const ViewDailyGoalsAllocation = () => {
  const { id } = useParams();
  return CheckPermission([
    Permissions.ORGANIZATIONAL_ADMINISTRATION.GOALS.DAILY_GOALS_ALLOCATION.READ,
  ]) ? (
    <Layout>
      <DailyGoalsAllocationView goalId={id} />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default ViewDailyGoalsAllocation;
