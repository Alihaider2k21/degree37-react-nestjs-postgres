import React from 'react';

import Layout from '../../../../../../../components/common/layout/index';
import ViewContactsNoteCategory from '../../../../../../../components/system-configuration/tenants-administration/crm-administration/contact/note-category/ViewContactsNoteCategory';
import CheckPermission from '../../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../../not-found/NotFoundPage';

const ContactsNoteCategoryView = () => {
  const hasPermission = CheckPermission([
    Permissions.CRM_ADMINISTRATION.CONTACTS.NOTES_CATEGORY.READ,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <ViewContactsNoteCategory />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default ContactsNoteCategoryView;
