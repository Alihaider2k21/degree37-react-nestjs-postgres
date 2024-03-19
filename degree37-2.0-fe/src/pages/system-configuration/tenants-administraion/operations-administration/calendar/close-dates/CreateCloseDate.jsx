import React from 'react';
import CloseDateUpsert from '../../../../../../components/system-configuration/tenants-administration/operations-administration/calendar/close-dates/CloseDateUpsert';
import Layout from '../../../../../../components/common/layout/index';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

const CreateCloseDate = () => {
  const hasPermission = CheckPermission([
    Permissions.OPERATIONS_ADMINISTRATION.CALENDAR.CLOSE_DATES.WRITE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <CloseDateUpsert />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default CreateCloseDate;
