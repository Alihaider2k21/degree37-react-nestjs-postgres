import React from 'react';
import Layout from '../../../../../components/common/layout';
import TaskManagementView from '../../../../../components/system-configuration/tenants-administration/operations-administration/booking-drives/task-management/TaskManagementView';
import CheckPermission from '../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../not-found/NotFoundPage';

const ViewTask = () => {
  const hasPermission = CheckPermission([
    Permissions.OPERATIONS_ADMINISTRATION.BOOKING_DRIVES.TASK_MANAGEMENT.READ,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <TaskManagementView />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default ViewTask;
