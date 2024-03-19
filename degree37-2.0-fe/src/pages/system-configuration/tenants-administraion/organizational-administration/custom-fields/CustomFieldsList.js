import React from 'react';
import Layout from '../../../../../components/common/layout';
import ListCustomFields from '../../../../../components/system-configuration/tenants-administration/organizational-administration/custom-fields/ListCustomFields';
import NotFoundPage from '../../../../not-found/NotFoundPage.jsx';
import CheckPermission from '../../../../../helpers/CheckPermissions.js';
import Permissions from '../../../../../enums/PermissionsEnum.js';

export default function CustomFieldsList() {
  return CheckPermission(null, [
    Permissions.ORGANIZATIONAL_ADMINISTRATION.CUSTOM_FIELDS.MODULE_CODE,
  ]) ? (
    <Layout>
      <ListCustomFields />
    </Layout>
  ) : (
    <NotFoundPage />
  );
}
