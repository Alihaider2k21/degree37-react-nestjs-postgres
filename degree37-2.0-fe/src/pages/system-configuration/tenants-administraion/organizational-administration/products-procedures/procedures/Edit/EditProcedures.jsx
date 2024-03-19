import React from 'react';
import ProceduresEdit from '../../../../../../../components/system-configuration/tenants-administration/organizational-administration/products-procedures/procedures/ProcedureEdit';
import Layout from '../../../../../../../components/common/layout/index';
import CheckPermission from '../../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../../not-found/NotFoundPage';

const EditProcedures = () => {
  const hasPermission = CheckPermission([
    Permissions.ORGANIZATIONAL_ADMINISTRATION.PRODUCTS_AND_PROCEDURES.PROCEDURES
      .WRITE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <ProceduresEdit />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default EditProcedures;
