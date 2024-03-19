import React from 'react';
import Layout from '../../../../components/common/layout';
import FavoriteEditDuplicate from '../../../../components/operations-center/manage-favorites/FavoriteEditDuplicate';
import CheckPermission from '../../../../helpers/CheckPermissions';
import Permissions from '../../../../enums/OcPermissionsEnum';
import NotFoundPage from '../../../not-found/NotFoundPage';
const EditDuplicateFavorite = () => {
  return CheckPermission([
    Permissions.OPERATIONS_CENTER.MANAGE_FAVORITE.DUPLICATE,
    Permissions.OPERATIONS_CENTER.MANAGE_FAVORITE.WRITE,
  ]) ? (
    <Layout>
      <FavoriteEditDuplicate />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};
export default EditDuplicateFavorite;
