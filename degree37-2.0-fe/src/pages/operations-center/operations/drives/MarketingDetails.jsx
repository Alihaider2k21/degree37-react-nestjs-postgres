import React from 'react';
import Layout from '../../../../components/common/layout';
import DetailsMarketing from '../../../../components/operations-center/operations/drives/marketingDetails';
import NotFoundPage from '../../../not-found/NotFoundPage';
import Permissions from '../../../../enums/OcPermissionsEnum';
import CheckPermission from '../../../../helpers/CheckPermissions';

const marketingDetails = () => {
  return CheckPermission([
    Permissions.OPERATIONS_CENTER.OPERATIONS.DRIVES.READ,
  ]) ? (
    <Layout>
      <DetailsMarketing />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default marketingDetails;
