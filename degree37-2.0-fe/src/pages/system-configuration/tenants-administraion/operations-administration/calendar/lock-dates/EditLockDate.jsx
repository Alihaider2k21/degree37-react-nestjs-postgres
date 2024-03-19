import React from 'react';
import Layout from '../../../../../../components/common/layout/index';
import LockDateUpsert from '../../../../../../components/system-configuration/tenants-administration/operations-administration/calendar/lock-dates/LockDateUpsert';
import { useParams } from 'react-router-dom';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

const EditLockDate = () => {
  const { id } = useParams();
  return CheckPermission([
    Permissions.OPERATIONS_ADMINISTRATION.CALENDAR.LOCK_DATES.WRITE,
  ]) ? (
    <Layout>
      <LockDateUpsert lockDateId={id} />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default EditLockDate;
