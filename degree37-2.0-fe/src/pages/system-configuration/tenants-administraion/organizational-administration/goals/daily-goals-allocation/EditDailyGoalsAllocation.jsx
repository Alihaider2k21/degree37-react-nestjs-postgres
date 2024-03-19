import React from 'react';
import Layout from '../../../../../../components/common/layout';
import { useParams } from 'react-router-dom';
import DailyGoalsAllocationEdit from '../../../../../../components/system-configuration/tenants-administration/organizational-administration/goals/daily-goals-allocation/DailyGoalsAllocationEdit';
import NotFoundPage from '../../../../../not-found/NotFoundPage.jsx';
import CheckPermission from '../../../../../../helpers/CheckPermissions.js';
import Permissions from '../../../../../../enums/PermissionsEnum.js';

const EditDailyGoalsAllocation = () => {
  const { id } = useParams();
  return CheckPermission([
    Permissions.ORGANIZATIONAL_ADMINISTRATION.GOALS.DAILY_GOALS_ALLOCATION
      .WRITE,
  ]) ? (
    <Layout>
      <DailyGoalsAllocationEdit goalId={id} />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default EditDailyGoalsAllocation;
