import React from 'react';
import Layout from '../../../../../components/common/layout';
import TaskManagementList from '../../../../../components/system-configuration/tenants-administration/operations-administration/booking-drives/task-management/TaskManagementList';
import CheckPermission from '../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../not-found/NotFoundPage';

const ListTask = () => {
  const hasPermission = CheckPermission(null, [
    Permissions.OPERATIONS_ADMINISTRATION.BOOKING_DRIVES.TASK_MANAGEMENT
      .MODULE_CODE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <TaskManagementList />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default ListTask;
