import React from 'react';
import Layout from '../../../../../../../components/common/layout/index';
import EditContactsNoteSubCategory from '../../../../../../../components/system-configuration/tenants-administration/crm-administration/contact/note-subcategory/EditContactsNoteSubCategory';
import CheckPermission from '../../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../../not-found/NotFoundPage';

const ContactsNoteSubCategoryEdit = () => {
  const hasPermission = CheckPermission([
    Permissions.CRM_ADMINISTRATION.CONTACTS.NOTES_SUBCATEGORY.WRITE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <EditContactsNoteSubCategory />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default ContactsNoteSubCategoryEdit;
