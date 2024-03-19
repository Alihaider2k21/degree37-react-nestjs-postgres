import React from 'react';
import LockDateList from '../../../../../../components/system-configuration/tenants-administration/operations-administration/calendar/lock-dates/LockDateList';
import Layout from '../../../../../../components/common/layout';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

const ListLockDates = () => {
  return CheckPermission(null, [
    Permissions.OPERATIONS_ADMINISTRATION.CALENDAR.LOCK_DATES.MODULE_CODE,
  ]) ? (
    <Layout>
      <LockDateList />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default ListLockDates;
