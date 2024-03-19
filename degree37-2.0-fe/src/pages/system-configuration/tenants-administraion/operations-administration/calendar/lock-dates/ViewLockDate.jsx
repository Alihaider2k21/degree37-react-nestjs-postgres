import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../../../../../../components/common/layout/index';
import LockDateView from '../../../../../../components/system-configuration/tenants-administration/operations-administration/calendar/lock-dates/LockDateView';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

const ViewLockDate = () => {
  const { id } = useParams();

  return CheckPermission([
    Permissions.OPERATIONS_ADMINISTRATION.CALENDAR.LOCK_DATES.READ,
  ]) ? (
    <Layout>
      <LockDateView lockDateId={id} />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default ViewLockDate;
