import React from 'react';
import Layout from '../../../../../../components/common/layout';
import GoalsPerformanceRules from '../../../../../../components/system-configuration/tenants-administration/organizational-administration/goals/performance-rules/GoalsPerformanceRules';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

const ViewGoalsPerformanceRules = () => {
  const hasPermission = CheckPermission(null, [
    Permissions.ORGANIZATIONAL_ADMINISTRATION.GOALS.PERFORMANCE_RULES
      .MODULE_CODE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <GoalsPerformanceRules editMode={false} />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default ViewGoalsPerformanceRules;
