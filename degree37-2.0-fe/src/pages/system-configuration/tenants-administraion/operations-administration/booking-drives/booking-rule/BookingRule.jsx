import React from 'react';
import BookingRulesList from '../../../../../../components/system-configuration/tenants-administration/operations-administration/booking-drives/booking-rule/bookingRuleList';
import Layout from '../../../../../../components/common/layout';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';
const BookingRules = () => {
  const hasPermission = CheckPermission(null, [
    Permissions.OPERATIONS_ADMINISTRATION.BOOKING_DRIVES.BOOKING_RULE
      .MODULE_CODE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <BookingRulesList />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default BookingRules;
