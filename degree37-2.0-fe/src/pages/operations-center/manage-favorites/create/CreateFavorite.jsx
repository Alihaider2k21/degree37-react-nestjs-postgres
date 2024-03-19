import React from 'react';
import FavoriteCreate from '../../../../components/operations-center/manage-favorites/FavoriteCreate';
import Layout from '../../../../components/common/layout';
import CheckPermission from '../../../../helpers/CheckPermissions';
import Permissions from '../../../../enums/OcPermissionsEnum';
import NotFoundPage from '../../../not-found/NotFoundPage';

const CreateFavorite = () => {
  return CheckPermission([
    Permissions.OPERATIONS_CENTER.MANAGE_FAVORITE.WRITE,
  ]) ? (
    <Layout>
      <FavoriteCreate />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default CreateFavorite;
