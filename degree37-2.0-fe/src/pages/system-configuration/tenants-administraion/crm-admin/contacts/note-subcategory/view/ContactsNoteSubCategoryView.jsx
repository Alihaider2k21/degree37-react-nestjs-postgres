import React from 'react';
import Layout from '../../../../../../../components/common/layout/index';
import ViewContactsSubNoteCategory from '../../../../../../../components/system-configuration/tenants-administration/crm-administration/contact/note-subcategory/ViewContactsNoteSubCategory';
import CheckPermission from '../../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../../not-found/NotFoundPage';

const ContactsNoteSubCategoryView = () => {
  const hasPermission = CheckPermission([
    Permissions.CRM_ADMINISTRATION.CONTACTS.NOTES_SUBCATEGORY.READ,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <ViewContactsSubNoteCategory />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default ContactsNoteSubCategoryView;
