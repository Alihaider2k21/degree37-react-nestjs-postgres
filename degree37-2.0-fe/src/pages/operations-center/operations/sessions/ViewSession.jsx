import React from 'react';
import Layout from '../../../../components/common/layout';
import SessionView from '../../../../components/operations-center/operations/sessions/SessionViews';
import CheckPermission from '../../../../helpers/CheckPermissions';
import Permissions from '../../../../enums/OcPermissionsEnum';
import NotFoundPage from '../../../not-found/NotFoundPage';

export default function ViewSession() {
  return CheckPermission([
    Permissions.OPERATIONS_CENTER.OPERATIONS.SESSIONS.READ,
  ]) ? (
    <Layout>
      <SessionView />
    </Layout>
  ) : (
    <NotFoundPage />
  );
}
