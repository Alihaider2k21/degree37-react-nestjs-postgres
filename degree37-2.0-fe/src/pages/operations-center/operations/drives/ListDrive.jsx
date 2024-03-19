import React from 'react';
import Layout from '../../../../components/common/layout';
import DriveList from '../../../../components/operations-center/operations/drives/DriveList';
import CheckPermission from '../../../../helpers/CheckPermissions';
import Permissions from '../../../../enums/OcPermissionsEnum';
import NotFoundPage from '../../../not-found/NotFoundPage';

const ListDrive = () => {
  return CheckPermission(null, [
    Permissions.OPERATIONS_CENTER.OPERATIONS.DRIVES.MODULE_CODE,
  ]) ? (
    <Layout>
      <DriveList />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default ListDrive;
