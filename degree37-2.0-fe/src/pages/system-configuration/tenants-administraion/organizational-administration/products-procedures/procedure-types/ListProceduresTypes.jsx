import React from 'react';
import ListAllProcedureTypes from '../../../../../../components/system-configuration/tenants-administration/organizational-administration/products-procedures/procedure-types/ListProcedureTypes';

import Layout from '../../../../../../components/common/layout/index';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

const ListProcedureTypes = () => {
  const hasPermission = CheckPermission(null, [
    Permissions.ORGANIZATIONAL_ADMINISTRATION.PRODUCTS_AND_PROCEDURES
      .PROCEDURE_TYPES.MODULE_CODE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <ListAllProcedureTypes />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default ListProcedureTypes;
