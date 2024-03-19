import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../../../../../../components/common/layout/index';
import CloseDateView from '../../../../../../components/system-configuration/tenants-administration/operations-administration/calendar/close-dates/CloseDateView';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

const ViewCloseDate = () => {
  const { id } = useParams();
  const hasPermission = CheckPermission([
    Permissions.OPERATIONS_ADMINISTRATION.CALENDAR.CLOSE_DATES.READ,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <CloseDateView closeDateId={id} />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default ViewCloseDate;
