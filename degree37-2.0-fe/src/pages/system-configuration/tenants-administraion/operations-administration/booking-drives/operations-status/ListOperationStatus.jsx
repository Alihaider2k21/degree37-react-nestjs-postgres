import React from 'react';
import Layout from '../../../../../../components/common/layout';
import ListAllOperationStatus from '../../../../../../components/system-configuration/tenants-administration/operations-administration/booking-drives/operation-status/ListAllOperationStatus';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

const ListOperationStatus = () => {
  const hasPermission = CheckPermission(null, [
    Permissions.OPERATIONS_ADMINISTRATION.BOOKING_DRIVES.OPERATION_STATUS
      .MODULE_CODE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <ListAllOperationStatus />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default ListOperationStatus;
