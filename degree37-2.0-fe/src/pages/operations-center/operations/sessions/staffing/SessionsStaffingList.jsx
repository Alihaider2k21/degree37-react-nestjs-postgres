import React from 'react';
import Layout from '../../../../../components/common/layout';
import SessionsListStaffing from '../../../../../components/operations-center/operations/sessions/staffing/SessionsListStaffing';
import NotFoundPage from '../../../../not-found/NotFoundPage';
import CheckPermission from '../../../../../helpers/CheckPermissions';
import OcPermissions from '../../../../../enums/OcPermissionsEnum';

const SessionsStaffingList = () => {
  const hasPermission = CheckPermission(null, [
    OcPermissions.OPERATIONS_CENTER.OPERATIONS.SESSIONS.STAFFING,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <SessionsListStaffing />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default SessionsStaffingList;
