import React from 'react';
import Layout from '../../../../../../../components/common/layout/index';
import AddContactsNoteSubCategory from '../../../../../../../components/system-configuration/tenants-administration/crm-administration/contact/note-subcategory/AddContactsNoteSubCategory';
import CheckPermission from '../../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../../not-found/NotFoundPage';

const ContactsNoteSubCategoryAdd = () => {
  const hasPermission = CheckPermission([
    Permissions.CRM_ADMINISTRATION.CONTACTS.NOTES_SUBCATEGORY.WRITE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <AddContactsNoteSubCategory />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default ContactsNoteSubCategoryAdd;
