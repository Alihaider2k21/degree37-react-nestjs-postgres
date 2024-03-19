import React from 'react';
import Layout from '../../../../components/common/layout';
import { useParams } from 'react-router-dom';
import DriveView from '../../../../components/operations-center/operations/drives/DriveView';
import NotFoundPage from '../../../not-found/NotFoundPage';
import Permissions from '../../../../enums/OcPermissionsEnum';
import CheckPermission from '../../../../helpers/CheckPermissions';

const ViewDrive = () => {
  const { id, slug } = useParams();
  return CheckPermission([
    Permissions.OPERATIONS_CENTER.OPERATIONS.DRIVES.READ,
  ]) ? (
    <Layout>
      <DriveView id={id} slug={slug} />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default ViewDrive;
