import React from 'react';
import ProceduresTypesEdit from '../../../../../../../components/system-configuration/tenants-administration/organizational-administration/products-procedures/procedure-types/EditProcedureTypes';
import Layout from '../../../../../../../components/common/layout/index';
import NotFoundPage from '../../../../../../not-found/NotFoundPage';
import CheckPermission from '../../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../../enums/PermissionsEnum';

const EditProcedures = () => {
  const hasPermission = CheckPermission([
    Permissions.ORGANIZATIONAL_ADMINISTRATION.PRODUCTS_AND_PROCEDURES
      .PROCEDURE_TYPES.WRITE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <ProceduresTypesEdit />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default EditProcedures;
