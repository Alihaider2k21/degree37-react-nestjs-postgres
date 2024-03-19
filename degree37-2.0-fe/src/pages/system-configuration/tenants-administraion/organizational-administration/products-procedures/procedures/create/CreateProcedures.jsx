import React from 'react';
import AddProcedures from '../../../../../../../components/system-configuration/tenants-administration/organizational-administration/products-procedures/procedures/AddProcedures';

import Layout from '../../../../../../../components/common/layout/index';
import CheckPermission from '../../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../../not-found/NotFoundPage';

const CreateProcedures = () => {
  const hasPermission = CheckPermission([
    Permissions.ORGANIZATIONAL_ADMINISTRATION.PRODUCTS_AND_PROCEDURES.PROCEDURES
      .WRITE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <AddProcedures />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default CreateProcedures;
