import React from 'react';
import Layout from '../../../../components/common/layout';
import SessionList from '../../../../components/operations-center/operations/sessions/SessionList';
import CheckPermission from '../../../../helpers/CheckPermissions';
import Permissions from '../../../../enums/OcPermissionsEnum';
import NotAuthorizedPage from '../../../not-authorized/NotAuthorizedPage';

const ListSession = () => {
  return CheckPermission(null, [
    Permissions.OPERATIONS_CENTER.OPERATIONS.SESSIONS.MODULE_CODE,
  ]) ? (
    <Layout>
      <SessionList />
    </Layout>
  ) : (
    <NotAuthorizedPage />
  );
};

export default ListSession;
