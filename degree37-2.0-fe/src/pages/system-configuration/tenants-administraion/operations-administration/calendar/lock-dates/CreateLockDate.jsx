import React from 'react';
import LockDateUpsert from '../../../../../../components/system-configuration/tenants-administration/operations-administration/calendar/lock-dates/LockDateUpsert';
import Layout from '../../../../../../components/common/layout/index';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

const CreateLockDate = () => {
  return CheckPermission([
    Permissions.OPERATIONS_ADMINISTRATION.CALENDAR.LOCK_DATES.WRITE,
  ]) ? (
    <Layout>
      <LockDateUpsert />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default CreateLockDate;
