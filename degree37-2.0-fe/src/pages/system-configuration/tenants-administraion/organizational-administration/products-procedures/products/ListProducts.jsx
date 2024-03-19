import React from 'react';
import ListAllProducts from '../../../../../../components/system-configuration/tenants-administration/organizational-administration/products-procedures/products/ListProducts';

import Layout from '../../../../../../components/common/layout/index';
import NotFoundPage from '../../../../../not-found/NotFoundPage';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';

const ListProducts = () => {
  const hasPermission = CheckPermission(null, [
    Permissions.ORGANIZATIONAL_ADMINISTRATION.PRODUCTS_AND_PROCEDURES.PRODUCTS
      .MODULE_CODE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <ListAllProducts />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default ListProducts;
