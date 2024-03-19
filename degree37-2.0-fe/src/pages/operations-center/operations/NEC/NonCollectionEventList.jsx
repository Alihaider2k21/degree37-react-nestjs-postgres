import React from 'react';
import Layout from '../../../../components/common/layout';
import NceEventList from '../../../../components/operations-center/operations/NCE/NceEventList';
import CheckPermission from '../../../../helpers/CheckPermissions';
import Permissions from '../../../../enums/OcPermissionsEnum';
import NotFoundPage from '../../../not-found/NotFoundPage';

const NonCollectionEventList = () => {
  return CheckPermission(null, [
    Permissions.OPERATIONS_CENTER.OPERATIONS.NON_COLLECTION_EVENTS.MODULE_CODE,
  ]) ? (
    <Layout>
      <NceEventList />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default NonCollectionEventList;
