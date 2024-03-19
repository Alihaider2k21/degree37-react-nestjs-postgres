import React from 'react';
import Layout from '../../../../../components/common/layout';
import AddCustomFields from '../../../../../components/system-configuration/tenants-administration/organizational-administration/custom-fields/AddCustomFields';
import NotFoundPage from '../../../../not-found/NotFoundPage.jsx';
import CheckPermission from '../../../../../helpers/CheckPermissions.js';
import Permissions from '../../../../../enums/PermissionsEnum.js';

export default function CreateCustomFields() {
  return CheckPermission([
    Permissions.ORGANIZATIONAL_ADMINISTRATION.CUSTOM_FIELDS.WRITE,
  ]) ? (
    <Layout>
      <AddCustomFields />
    </Layout>
  ) : (
    <NotFoundPage />
  );
}
