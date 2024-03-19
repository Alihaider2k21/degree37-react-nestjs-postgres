import React from 'react';
import Layout from '../../../../../../../components/common/layout/index';
import AddContactsNoteCategory from '../../../../../../../components/system-configuration/tenants-administration/crm-administration/contact/note-category/AddContactsNoteCategory';
import CheckPermission from '../../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../../not-found/NotFoundPage';

const ContactsNoteCategoryAdd = () => {
  const hasPermission = CheckPermission([
    Permissions.CRM_ADMINISTRATION.CONTACTS.NOTES_CATEGORY.WRITE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <AddContactsNoteCategory />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default ContactsNoteCategoryAdd;
