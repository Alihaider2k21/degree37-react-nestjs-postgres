import React from 'react';
import BookingRulesCreate from '../../../../../../components/system-configuration/tenants-administration/operations-administration/booking-drives/booking-rule/bookingRuleCreate';
import Layout from '../../../../../../components/common/layout';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

const CreateBookingRules = () => {
  const hasPermission = CheckPermission([
    Permissions.OPERATIONS_ADMINISTRATION.BOOKING_DRIVES.BOOKING_RULE.WRITE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <BookingRulesCreate />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default CreateBookingRules;
