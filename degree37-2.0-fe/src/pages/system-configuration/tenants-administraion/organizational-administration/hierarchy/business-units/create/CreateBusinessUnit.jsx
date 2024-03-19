import React from 'react';
import Layout from '../../../../../../../components/common/layout';
import AddBusinessUnit from '../../../../../../../components/system-configuration/tenants-administration/organizational-administration/hierarchy/business-units/AddBusinessUnit';
import NotFoundPage from '../../../../../../not-found/NotFoundPage.jsx';
import CheckPermission from '../../../../../../../helpers/CheckPermissions.js';
import Permissions from '../../../../../../../enums/PermissionsEnum.js';

const CreateBusinessUnit = () => {
  return CheckPermission([
    Permissions.ORGANIZATIONAL_ADMINISTRATION.HIERARCHY.BUSINESS_UNITS.WRITE,
  ]) ? (
    <Layout>
      <AddBusinessUnit />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};
export default CreateBusinessUnit;
