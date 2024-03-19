import React from 'react';
import Layout from '../../../../../../components/common/layout';
import GoalsPerformanceRules from '../../../../../../components/system-configuration/tenants-administration/organizational-administration/goals/performance-rules/GoalsPerformanceRules';
import CheckPermission from '../../../../../../helpers/CheckPermissions.js';
import NotFoundPage from '../../../../../not-found/NotFoundPage.jsx';
import Permissions from '../../../../../../enums/PermissionsEnum.js';

const EditGoalsPerformanceRules = () => {
  return CheckPermission([
    Permissions.ORGANIZATIONAL_ADMINISTRATION.GOALS.PERFORMANCE_RULES.WRITE,
  ]) ? (
    <Layout>
      <GoalsPerformanceRules editMode={true} />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default EditGoalsPerformanceRules;
