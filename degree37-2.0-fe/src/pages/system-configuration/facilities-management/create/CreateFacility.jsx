import AddFacility from '../../../../components/system-configuration/tenants-administration/organizational-administration/resources/facilities-management/AddFacility';

import React from 'react';
import Layout from '../../../../components/common/layout';
import NotFoundPage from '../../../not-found/NotFoundPage.jsx';
import CheckPermission from '../../../../helpers/CheckPermissions.js';
import Permissions from '../../../../enums/PermissionsEnum.js';

const CreateFacility = () => {
  return CheckPermission([
    Permissions.ORGANIZATIONAL_ADMINISTRATION.RESOURCES.FACILITIES.WRITE,
  ]) ? (
    <Layout>
      <AddFacility />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default CreateFacility;
