import React from 'react';
import Layout from '../../../../../../../components/common/layout/index';
import EditContactsNoteCategory from '../../../../../../../components/system-configuration/tenants-administration/crm-administration/contact/note-category/EditContactsNoteCategory';
import CheckPermission from '../../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../../not-found/NotFoundPage';

const ContactsNoteCategoryEdit = () => {
  const hasPermission = CheckPermission([
    Permissions.CRM_ADMINISTRATION.CONTACTS.NOTES_CATEGORY.WRITE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <EditContactsNoteCategory />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default ContactsNoteCategoryEdit;
