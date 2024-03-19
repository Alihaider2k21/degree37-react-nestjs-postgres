import React from 'react';
import Layout from '../../../../../../components/common/layout';
import DailyHourList from '../../../../../../components/system-configuration/tenants-administration/operations-administration/booking-drives/daily-hour/dailyHourList';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

export const DailyHour = () => {
  const hasPermission = CheckPermission(null, [
    Permissions.OPERATIONS_ADMINISTRATION.BOOKING_DRIVES.DAILY_HOURS
      .MODULE_CODE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <DailyHourList />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};
export default DailyHour;
