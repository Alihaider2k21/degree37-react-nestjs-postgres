import React from 'react';
import ViewProcedureTypes from '../../../../../../../components/system-configuration/tenants-administration/organizational-administration/products-procedures/procedure-types/ViewProcedureTypes';
import Layout from '../../../../../../../components/common/layout/index';
import CheckPermission from '../../../../../../../helpers/CheckPermissions.js';
import Permissions from '../../../../../../../enums/PermissionsEnum.js';
import NotFoundPage from '../../../../../../not-found/NotFoundPage.jsx';

const ViewProcedure = () => {
  return CheckPermission([
    Permissions.ORGANIZATIONAL_ADMINISTRATION.PRODUCTS_AND_PROCEDURES
      .PROCEDURE_TYPES.READ,
  ]) ? (
    <Layout>
      <ViewProcedureTypes />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default ViewProcedure;
