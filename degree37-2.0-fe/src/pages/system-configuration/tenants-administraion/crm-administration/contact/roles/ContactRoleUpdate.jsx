import React from 'react';
import Layout from '../../../../../../components/common/layout';
import EditContactRole from '../../../../../../components/system-configuration/tenants-administration/crm-administration/contact/roles/EditContactRole';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

const ContactRoleUpdate = () => {
  const hasPermission = CheckPermission([
    Permissions.CRM_ADMINISTRATION.CONTACTS.ROLES.WRITE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <EditContactRole />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default ContactRoleUpdate;
