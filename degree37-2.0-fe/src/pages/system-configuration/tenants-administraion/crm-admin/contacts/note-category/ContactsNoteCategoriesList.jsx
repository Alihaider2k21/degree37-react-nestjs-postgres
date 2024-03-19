import React from 'react';
import Layout from '../../../../../../components/common/layout';
import ListContactsNoteCategories from '../../../../../../components/system-configuration/tenants-administration/crm-administration/contact/note-category/ListContactsNoteCategory';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';
const ContactsNoteCategoriesList = () => {
  const hasPermission = CheckPermission(null, [
    Permissions.CRM_ADMINISTRATION.CONTACTS.NOTES_CATEGORY.MODULE_CODE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <ListContactsNoteCategories />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default ContactsNoteCategoriesList;
