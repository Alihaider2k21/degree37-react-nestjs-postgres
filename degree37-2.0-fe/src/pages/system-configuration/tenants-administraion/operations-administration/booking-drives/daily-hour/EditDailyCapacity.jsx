import React from 'react';
import Layout from '../../../../../../components/common/layout';
import DailyHourEdit from '../../../../../../components/system-configuration/tenants-administration/operations-administration/booking-drives/daily-hour/EditDailyHour';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

const EditDailyHourPage = () => {
  const hasPermission = CheckPermission([
    Permissions.OPERATIONS_ADMINISTRATION.BOOKING_DRIVES.DAILY_HOURS.WRITE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <DailyHourEdit />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default EditDailyHourPage;
