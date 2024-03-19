import React from 'react';
import Layout from '../../../../components/common/layout';
import DrivesUpsert from '../../../../components/operations-center/operations/drives/DriveUpsert';
import CheckPermission from '../../../../helpers/CheckPermissions';
import Permissions from '../../../../enums/OcPermissionsEnum';
// import NotFoundPage from '../../../not-found/NotFoundPage';
const CreateDrive = () => {
  return (
    <Layout>
      <DrivesUpsert />
    </Layout>
  );
};

export default CreateDrive;
