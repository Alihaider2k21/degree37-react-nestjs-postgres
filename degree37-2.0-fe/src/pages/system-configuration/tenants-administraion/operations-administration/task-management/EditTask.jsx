import React from 'react';
import Layout from '../../../../../components/common/layout';
import TaskManagementEdit from '../../../../../components/system-configuration/tenants-administration/operations-administration/booking-drives/task-management/TaskManagementEdit';
import CheckPermission from '../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../not-found/NotFoundPage';

const EditTask = () => {
  const hasPermission = CheckPermission([
    Permissions.OPERATIONS_ADMINISTRATION.BOOKING_DRIVES.TASK_MANAGEMENT.WRITE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <TaskManagementEdit />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default EditTask;
