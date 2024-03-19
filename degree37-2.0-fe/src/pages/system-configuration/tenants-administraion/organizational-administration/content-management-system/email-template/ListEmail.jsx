import React from 'react';
import EmailList from '../../../../../../components/system-configuration/tenants-administration/organizational-administration/content-management-system/email-template/ListTemplate.js';
import Layout from '../../../../../../components/common/layout';
import NotFoundPage from '../../../../../not-found/NotFoundPage.jsx';
import CheckPermission from '../../../../../../helpers/CheckPermissions.js';
import Permissions from '../../../../../../enums/PermissionsEnum.js';

const ListEmail = () => {
  return CheckPermission(null, [
    Permissions.ORGANIZATIONAL_ADMINISTRATION.CONTENT_MANAGEMENT_SYSTEM
      .EMAIL_TEMPLATES.MODULE_CODE,
  ]) ? (
    <Layout>
      <EmailList />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default ListEmail;
