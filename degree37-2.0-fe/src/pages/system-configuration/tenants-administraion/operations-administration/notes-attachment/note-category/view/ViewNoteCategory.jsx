import React from 'react';
import Layout from '../../../../../../../components/common/layout';
import NoteCategory from '../../../../../../../components/system-configuration/tenants-administration/operations-administration/notes-attachment/note-category/NoteCategory';
import CheckPermission from '../../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../../not-found/NotFoundPage';

function ViewNoteCategory() {
  return CheckPermission([
    Permissions.OPERATIONS_ADMINISTRATION.NOTES_AND_ATTACHMENTS.NOTES_CATEGORY
      .READ,
  ]) ? (
    <Layout>
      <NoteCategory />
    </Layout>
  ) : (
    <NotFoundPage />
  );
}

export default ViewNoteCategory;
