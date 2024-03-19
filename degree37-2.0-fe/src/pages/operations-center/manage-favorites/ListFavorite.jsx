import React from 'react';
import Layout from '../../../components/common/layout';
import FavoriteList from '../../../components/operations-center/manage-favorites/FavoriteList';
import CheckPermission from '../../../helpers/CheckPermissions';
import Permissions from '../../../enums/OcPermissionsEnum';
import NotFoundPage from '../../not-found/NotFoundPage';

const ListFavorite = () => {
  return CheckPermission(null, [
    Permissions.OPERATIONS_CENTER.MANAGE_FAVORITE.MODULE_CODE,
  ]) ? (
    <Layout>
      <FavoriteList />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default ListFavorite;
