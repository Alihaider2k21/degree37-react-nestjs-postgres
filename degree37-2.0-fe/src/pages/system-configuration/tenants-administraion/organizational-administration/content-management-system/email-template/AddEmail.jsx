import React from 'react';
import EmailAdd from '../../../../../../components/system-configuration/tenants-administration/organizational-administration/content-management-system/email-template/AddTemplate.js';
import Layout from '../../../../../../components/common/layout';
import NotFoundPage from '../../../../../not-found/NotFoundPage.jsx';
import CheckPermission from '../../../../../../helpers/CheckPermissions.js';
import Permissions from '../../../../../../enums/PermissionsEnum.js';

const AddEmail = () => {
  return CheckPermission([
    Permissions.ORGANIZATIONAL_ADMINISTRATION.CONTENT_MANAGEMENT_SYSTEM
      .EMAIL_TEMPLATES.WRITE,
  ]) ? (
    <Layout>
      <EmailAdd />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default AddEmail;
