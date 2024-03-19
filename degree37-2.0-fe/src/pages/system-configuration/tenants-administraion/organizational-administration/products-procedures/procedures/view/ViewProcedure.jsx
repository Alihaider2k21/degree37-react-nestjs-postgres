import React from 'react';
import ViewSingleProcedure from '../../../../../../../components/system-configuration/tenants-administration/organizational-administration/products-procedures/procedures/ProcedureSingle';
import Layout from '../../../../../../../components/common/layout/index';
import CheckPermission from '../../../../../../../helpers/CheckPermissions.js';
import NotFoundPage from '../../../../../../not-found/NotFoundPage.jsx';
import Permissions from '../../../../../../../enums/PermissionsEnum.js';

const ViewProcedureTypes = () => {
  return CheckPermission([
    Permissions.ORGANIZATIONAL_ADMINISTRATION.PRODUCTS_AND_PROCEDURES.PROCEDURES
      .READ,
  ]) ? (
    <Layout>
      <ViewSingleProcedure />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default ViewProcedureTypes;
