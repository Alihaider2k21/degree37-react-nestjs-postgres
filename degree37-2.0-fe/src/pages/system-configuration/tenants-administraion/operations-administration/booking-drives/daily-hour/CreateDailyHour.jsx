import React from 'react';
import Layout from '../../../../../../components/common/layout';
import AddDailyHour from '../../../../../../components/system-configuration/tenants-administration/operations-administration/booking-drives/daily-hour/AddDailyHour';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

const CreateDailyHour = () => {
  const hasPermission = CheckPermission([
    Permissions.OPERATIONS_ADMINISTRATION.BOOKING_DRIVES.DAILY_HOURS.WRITE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <AddDailyHour />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default CreateDailyHour;
