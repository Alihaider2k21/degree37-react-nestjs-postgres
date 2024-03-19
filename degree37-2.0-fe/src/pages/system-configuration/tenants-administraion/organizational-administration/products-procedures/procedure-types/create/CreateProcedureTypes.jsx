import React from 'react';
import AddProcedureTypes from '../../../../../../../components/system-configuration/tenants-administration/organizational-administration/products-procedures/procedure-types/AddProcedureTypes';
import Layout from '../../../../../../../components/common/layout/index';
import CheckPermission from '../../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../../not-found/NotFoundPage';

const CreateProcedureTypes = () => {
  const hasPermission = CheckPermission([
    Permissions.ORGANIZATIONAL_ADMINISTRATION.PRODUCTS_AND_PROCEDURES
      .PROCEDURE_TYPES.WRITE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <AddProcedureTypes />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default CreateProcedureTypes;
