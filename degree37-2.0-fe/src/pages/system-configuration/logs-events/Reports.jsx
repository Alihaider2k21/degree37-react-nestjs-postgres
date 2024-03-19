import React from 'react';
import Layout from '../../../components/common/layout';
import AllReports from '../../../components/system-configuration/logs-events/Reports';
import CheckPermission from '../../../helpers/CheckPermissions';
import Permissions from '../../../enums/PermissionsEnum';
import NotAuthorizedPage from '../../not-authorized/NotAuthorizedPage';

const Reports = () => {
  const hasPermission = CheckPermission(null, [
    Permissions.SYSTEM_CONFIGURATION.LOG_AND_EVENT_MANAGEMENT.MODULE_CODE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <AllReports />
      </Layout>
    );
  } else {
    return <NotAuthorizedPage />;
  }
};

export default Reports;
