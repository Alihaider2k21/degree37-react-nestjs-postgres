import React from 'react';
import Layout from '../../../../../../components/common/layout';
import ListContactRole from '../../../../../../components/system-configuration/tenants-administration/crm-administration/contact/roles/ListContactRole';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import NotFoundPage from '../../../../../not-found/NotFoundPage';
import Permissions from '../../../../../../enums/PermissionsEnum';

const ContactRoleList = () => {
  const hasPermission = CheckPermission(null, [
    Permissions.CRM_ADMINISTRATION.CONTACTS.ROLES.MODULE_CODE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <ListContactRole />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default ContactRoleList;
