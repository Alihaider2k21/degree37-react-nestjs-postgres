import React from 'react';
import Layout from '../../../../../../../components/common/layout';
import NoteSubCategory from '../../../../../../../components/system-configuration/tenants-administration/crm-administration/account/note-subcategory/NoteSubCategory';
import CheckPermission from '../../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../../not-found/NotFoundPage';

function ViewNoteSubCategory() {
  const hasPermission = CheckPermission([
    Permissions.CRM_ADMINISTRATION.ACCOUNTS.NOTES_SUBCATEGORY.READ,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <NoteSubCategory />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
}

export default ViewNoteSubCategory;
