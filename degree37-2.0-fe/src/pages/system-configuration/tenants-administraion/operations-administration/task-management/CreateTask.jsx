import React from 'react';
import Layout from '../../../../../components/common/layout';
import TaskManagementCreate from '../../../../../components/system-configuration/tenants-administration/operations-administration/booking-drives/task-management/TaskManagementCreate';
import CheckPermission from '../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../not-found/NotFoundPage';

const CreateTask = () => {
  const hasPermission = CheckPermission([
    Permissions.OPERATIONS_ADMINISTRATION.BOOKING_DRIVES.TASK_MANAGEMENT.WRITE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <TaskManagementCreate />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default CreateTask;
