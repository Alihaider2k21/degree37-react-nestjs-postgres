import React from 'react';
import ProceduresList from '../../../../../../components/system-configuration/tenants-administration/organizational-administration/products-procedures/procedures/ProceduresList';
import Layout from '../../../../../../components/common/layout';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';
const ListProcedures = () => {
  const hasPermission = CheckPermission(null, [
    Permissions.ORGANIZATIONAL_ADMINISTRATION.PRODUCTS_AND_PROCEDURES.PROCEDURES
      .MODULE_CODE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <ProceduresList />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default ListProcedures;
