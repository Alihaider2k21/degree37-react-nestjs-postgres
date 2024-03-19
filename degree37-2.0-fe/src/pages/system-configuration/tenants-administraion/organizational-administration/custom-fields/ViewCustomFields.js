import React from 'react';
import Layout from '../../../../../components/common/layout';
import CustomFieldsView from '../../../../../components/system-configuration/tenants-administration/organizational-administration/custom-fields/CustomFieldsView';
import NotFoundPage from '../../../../not-found/NotFoundPage.jsx';
import CheckPermission from '../../../../../helpers/CheckPermissions.js';
import Permissions from '../../../../../enums/PermissionsEnum.js';

export default function ViewCustomFields() {
  return CheckPermission([
    Permissions.ORGANIZATIONAL_ADMINISTRATION.CUSTOM_FIELDS.READ,
  ]) ? (
    <Layout>
      <CustomFieldsView />
    </Layout>
  ) : (
    <NotFoundPage />
  );
}
