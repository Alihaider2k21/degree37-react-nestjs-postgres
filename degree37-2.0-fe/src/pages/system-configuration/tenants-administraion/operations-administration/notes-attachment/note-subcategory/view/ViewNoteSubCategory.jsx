import React from 'react';
import Layout from '../../../../../../../components/common/layout';
import NoteSubCategory from '../../../../../../../components/system-configuration/tenants-administration/operations-administration/notes-attachment/note-subcategory/NoteSubCategory';
import CheckPermission from '../../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../../not-found/NotFoundPage';

function ViewNoteSubCategory() {
  return CheckPermission([
    Permissions.OPERATIONS_ADMINISTRATION.NOTES_AND_ATTACHMENTS
      .NOTES_SUBCATEGORY.READ,
  ]) ? (
    <Layout>
      <NoteSubCategory />
    </Layout>
  ) : (
    <NotFoundPage />
  );
}

export default ViewNoteSubCategory;
