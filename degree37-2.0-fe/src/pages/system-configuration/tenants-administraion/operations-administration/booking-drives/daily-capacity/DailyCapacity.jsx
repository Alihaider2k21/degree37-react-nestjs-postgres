import React from 'react';
import Layout from '../../../../../../components/common/layout';
import DailyCapacityList from '../../../../../../components/system-configuration/tenants-administration/operations-administration/booking-drives/daily-capacity/dailyCapacityList';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

export const DailyCapacity = () => {
  const hasPermission = CheckPermission(null, [
    Permissions.OPERATIONS_ADMINISTRATION.BOOKING_DRIVES.DAILY_CAPACITY
      .MODULE_CODE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <DailyCapacityList />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};
export default DailyCapacity;
