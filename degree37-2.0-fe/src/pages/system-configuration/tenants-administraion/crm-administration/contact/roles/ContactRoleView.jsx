import React from 'react';
import Layout from '../../../../../../components/common/layout';
import ViewContactRole from '../../../../../../components/system-configuration/tenants-administration/crm-administration/contact/roles/ViewContactRole';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

const ContactRoleView = () => {
  const hasPermission = CheckPermission([
    Permissions.CRM_ADMINISTRATION.CONTACTS.ROLES.READ,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <ViewContactRole />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default ContactRoleView;
