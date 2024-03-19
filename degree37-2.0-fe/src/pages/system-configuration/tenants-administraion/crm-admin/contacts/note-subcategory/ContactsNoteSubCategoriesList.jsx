import React from 'react';
import Layout from '../../../../../../components/common/layout';
import ListContactsNoteSubCategory from '../../../../../../components/system-configuration/tenants-administration/crm-administration/contact/note-subcategory/ListContactsNoteSubCategory';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';
const ContactsNoteSubCategoriesList = () => {
  const hasPermission = CheckPermission(null, [
    Permissions.CRM_ADMINISTRATION.CONTACTS.NOTES_SUBCATEGORY.MODULE_CODE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <ListContactsNoteSubCategory />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default ContactsNoteSubCategoriesList;
