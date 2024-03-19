import React from 'react';
import Layout from '../../../../../../components/common/layout';
import CreateContactRole from '../../../../../../components/system-configuration/tenants-administration/crm-administration/contact/roles/CreateContactRole';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

const ContactRoleCreate = () => {
  const hasPermission = CheckPermission([
    Permissions.CRM_ADMINISTRATION.CONTACTS.ROLES.WRITE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <CreateContactRole />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default ContactRoleCreate;
