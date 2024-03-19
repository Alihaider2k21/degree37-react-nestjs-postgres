import React from 'react';
import Layout from '../../../../../../components/common/layout/index';
import CloseDateUpsert from '../../../../../../components/system-configuration/tenants-administration/operations-administration/calendar/close-dates/CloseDateUpsert';
import { useParams } from 'react-router-dom';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

const EditCloseDate = () => {
  const { id } = useParams();
  const hasPermission = CheckPermission([
    Permissions.OPERATIONS_ADMINISTRATION.CALENDAR.CLOSE_DATES.WRITE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <CloseDateUpsert closeDateId={id} />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default EditCloseDate;
