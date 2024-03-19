import React from 'react';
import Layout from '../../../../components/common/layout';
import NceEdit from '../../../../components/operations-center/operations/NCE/NceEdit';
import CheckPermission from '../../../../helpers/CheckPermissions';
import Permissions from '../../../../enums/OcPermissionsEnum';
import NotFoundPage from '../../../not-found/NotFoundPage';

const NonCollectionEventEdit = () => {
  return CheckPermission([
    Permissions.OPERATIONS_CENTER.OPERATIONS.NON_COLLECTION_EVENTS.WRITE,
  ]) ? (
    <Layout>
      <NceEdit />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default NonCollectionEventEdit;
