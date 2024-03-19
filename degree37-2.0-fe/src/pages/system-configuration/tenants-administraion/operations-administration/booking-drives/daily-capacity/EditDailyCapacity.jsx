import React from 'react';
import EditDailyCapacity from '../../../../../../components/system-configuration/tenants-administration/operations-administration/booking-drives/daily-capacity/EditDailyCapacity';
import Layout from '../../../../../../components/common/layout';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

const EditDailyCapacityPage = () => {
  const hasPermission = CheckPermission([
    Permissions.OPERATIONS_ADMINISTRATION.BOOKING_DRIVES.DAILY_CAPACITY.WRITE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <EditDailyCapacity />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default EditDailyCapacityPage;
