import React from 'react';
import Layout from '../../../../components/common/layout';
import NceCreate from '../../../../components/operations-center/operations/NCE/NceCreate';
import CheckPermission from '../../../../helpers/CheckPermissions';
import Permissions from '../../../../enums/OcPermissionsEnum';
import NotFoundPage from '../../../not-found/NotFoundPage';

const NonCollectionEventCreate = () => {
  return CheckPermission([
    Permissions.OPERATIONS_CENTER.OPERATIONS.NON_COLLECTION_EVENTS.WRITE,
  ]) ? (
    <Layout>
      <NceCreate />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default NonCollectionEventCreate;
