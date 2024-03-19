import React from 'react';
import EmailView from '../../../../../../components/system-configuration/tenants-administration/organizational-administration/content-management-system/email-template/ViewTemplate.js';
import Layout from '../../../../../../components/common/layout';
import NotFoundPage from '../../../../../not-found/NotFoundPage.jsx';
import CheckPermission from '../../../../../../helpers/CheckPermissions.js';
import Permissions from '../../../../../../enums/PermissionsEnum.js';

const ViewEmail = () => {
  return CheckPermission([
    Permissions.ORGANIZATIONAL_ADMINISTRATION.CONTENT_MANAGEMENT_SYSTEM
      .EMAIL_TEMPLATES.READ,
  ]) ? (
    <Layout>
      <EmailView />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default ViewEmail;
