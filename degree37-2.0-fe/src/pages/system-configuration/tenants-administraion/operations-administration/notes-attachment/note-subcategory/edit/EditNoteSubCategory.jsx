import React from 'react';
import Layout from '../../../../../../../components/common/layout';
import NoteSubCategoryEdit from '../../../../../../../components/system-configuration/tenants-administration/operations-administration/notes-attachment/note-subcategory/NoteSubCategoryEdit';
import CheckPermission from '../../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../../not-found/NotFoundPage';

const EditNoteSubCategory = () => {
  return CheckPermission([
    Permissions.OPERATIONS_ADMINISTRATION.NOTES_AND_ATTACHMENTS
      .NOTES_SUBCATEGORY.WRITE,
  ]) ? (
    <Layout>
      <NoteSubCategoryEdit />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default EditNoteSubCategory;
