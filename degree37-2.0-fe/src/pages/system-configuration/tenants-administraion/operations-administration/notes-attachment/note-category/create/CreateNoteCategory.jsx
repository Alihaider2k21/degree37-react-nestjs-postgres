import React from 'react';
import Layout from '../../../../../../../components/common/layout';
import AddNoteCategory from '../../../../../../../components/system-configuration/tenants-administration/operations-administration/notes-attachment/note-category/AddNoteCategory';
import CheckPermission from '../../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../../not-found/NotFoundPage';

const CreateNoteCategory = () => {
  return CheckPermission([
    Permissions.OPERATIONS_ADMINISTRATION.NOTES_AND_ATTACHMENTS.NOTES_CATEGORY
      .WRITE,
  ]) ? (
    <Layout>
      <AddNoteCategory />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default CreateNoteCategory;
