import React from 'react';
import Layout from '../../../../../../components/common/layout';
import OperationStatusCreate from '../../../../../../components/system-configuration/tenants-administration/operations-administration/booking-drives/operation-status/operationStatusCreate';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

const CreateOperationsStatus = () => {
  const hasPermission = CheckPermission([
    Permissions.OPERATIONS_ADMINISTRATION.BOOKING_DRIVES.OPERATION_STATUS.WRITE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <OperationStatusCreate />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default CreateOperationsStatus;
