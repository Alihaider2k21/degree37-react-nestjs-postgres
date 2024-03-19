import React from 'react';
import Layout from '../../../../../../../components/common/layout';
import AddNoteSubCategory from '../../../../../../../components/system-configuration/tenants-administration/operations-administration/notes-attachment/note-subcategory/AddNoteSubCategory';
import CheckPermission from '../../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../../not-found/NotFoundPage';

const CreateNoteSubCategory = () => {
  return CheckPermission([
    Permissions.OPERATIONS_ADMINISTRATION.NOTES_AND_ATTACHMENTS
      .NOTES_SUBCATEGORY.WRITE,
  ]) ? (
    <Layout>
      <AddNoteSubCategory />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default CreateNoteSubCategory;
