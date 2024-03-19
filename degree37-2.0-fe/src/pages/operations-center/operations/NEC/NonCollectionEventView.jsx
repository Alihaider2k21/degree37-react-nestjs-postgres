import React from 'react';
import NceView from '../../../../components/operations-center/operations/NCE/NceView';
import Layout from '../../../../components/common/layout';
import NotFoundPage from '../../../not-found/NotFoundPage';
import CheckPermission from '../../../../helpers/CheckPermissions.js';
import Permissions from '../../../../enums/OcPermissionsEnum.js';

const NonCollectionEventView = () => {
  return CheckPermission([
    Permissions.OPERATIONS_CENTER.OPERATIONS.NON_COLLECTION_EVENTS.READ,
  ]) ? (
    <Layout>
      <NceView />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default NonCollectionEventView;
