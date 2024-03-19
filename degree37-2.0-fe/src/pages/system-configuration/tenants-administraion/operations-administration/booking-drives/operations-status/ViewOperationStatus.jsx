import React from 'react';
import Layout from '../../../../../../components/common/layout';
import OperationStatusView from '../../../../../../components/system-configuration/tenants-administration/operations-administration/booking-drives/operation-status/OperationStatusView';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

const ViewOperationStatus = () => {
  const hasPermission = CheckPermission([
    Permissions.OPERATIONS_ADMINISTRATION.BOOKING_DRIVES.OPERATION_STATUS.READ,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <OperationStatusView />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default ViewOperationStatus;
