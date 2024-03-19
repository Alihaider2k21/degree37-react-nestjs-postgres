import React from 'react';
import Layout from '../../../../../../../components/common/layout';
import NoteCategory from '../../../../../../../components/system-configuration/tenants-administration/crm-administration/account/note-category/NoteCategory';
import CheckPermission from '../../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../../not-found/NotFoundPage';

function ViewNoteCategory() {
  const hasPermission = CheckPermission([
    Permissions.CRM_ADMINISTRATION.ACCOUNTS.NOTES_CATEGORY.READ,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <NoteCategory />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
}

export default ViewNoteCategory;
