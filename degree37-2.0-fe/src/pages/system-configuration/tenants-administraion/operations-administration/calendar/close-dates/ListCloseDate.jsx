import React from 'react';
import CloseDateList from '../../../../../../components/system-configuration/tenants-administration/operations-administration/calendar/close-dates/CloseDateList';
import Layout from '../../../../../../components/common/layout';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

const ListCloseDates = () => {
  const hasPermission = CheckPermission(null, [
    Permissions.OPERATIONS_ADMINISTRATION.CALENDAR.CLOSE_DATES.MODULE_CODE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <CloseDateList />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default ListCloseDates;
