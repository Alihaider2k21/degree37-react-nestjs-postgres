import React from 'react';
import Layout from '../../../../../../components/common/layout';
import ListNoteSubCategory from '../../../../../../components/system-configuration/tenants-administration/operations-administration/notes-attachment/note-subcategory/ListNoteSubCategory';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

const NoteSubCategoryList = () => {
  return CheckPermission(null, [
    Permissions.OPERATIONS_ADMINISTRATION.NOTES_AND_ATTACHMENTS
      .NOTES_SUBCATEGORY.MODULE_CODE,
  ]) ? (
    <Layout>
      <ListNoteSubCategory />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default NoteSubCategoryList;
