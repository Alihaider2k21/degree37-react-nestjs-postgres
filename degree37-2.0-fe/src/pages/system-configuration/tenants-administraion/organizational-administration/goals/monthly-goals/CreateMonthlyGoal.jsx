import React from 'react';
import Layout from '../../../../../../components/common/layout';
import AddMonthlyGoal from '../../../../../../components/system-configuration/tenants-administration/organizational-administration/goals/monthly-goals/AddMonthlyGoal';
import NotFoundPage from '../../../../../not-found/NotFoundPage.jsx';
import CheckPermission from '../../../../../../helpers/CheckPermissions.js';
import Permissions from '../../../../../../enums/PermissionsEnum.js';

const CreateMonthlyGoal = () => {
  return CheckPermission([
    Permissions.ORGANIZATIONAL_ADMINISTRATION.GOALS.MONTHLY_GOALS.WRITE,
  ]) ? (
    <Layout>
      <AddMonthlyGoal />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default CreateMonthlyGoal;
