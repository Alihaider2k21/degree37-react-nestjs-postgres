import React from 'react';
import OperationStatusEdit from '../../../../../../components/system-configuration/tenants-administration/operations-administration/booking-drives/operation-status/operationStatusEdit';
import Layout from '../../../../../../components/common/layout';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

const EditOperationStatus = () => {
  const hasPermission = CheckPermission([
    Permissions.OPERATIONS_ADMINISTRATION.BOOKING_DRIVES.OPERATION_STATUS.WRITE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <OperationStatusEdit />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default EditOperationStatus;
