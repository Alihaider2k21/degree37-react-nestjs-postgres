import React from 'react';
import FavoriteView from '../../../../components/operations-center/manage-favorites/FavoriteView';
import Layout from '../../../../components/common/layout';
import CheckPermission from '../../../../helpers/CheckPermissions';
import Permissions from '../../../../enums/OcPermissionsEnum';
import NotFoundPage from '../../../not-found/NotFoundPage';
const ViewFavorite = () => {
  return CheckPermission([
    Permissions.OPERATIONS_CENTER.MANAGE_FAVORITE.READ,
  ]) ? (
    <Layout>
      <FavoriteView />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default ViewFavorite;
