import React from 'react';
import Layout from '../../../../../../../components/common/layout';
import NoteCategoryEdit from '../../../../../../../components/system-configuration/tenants-administration/operations-administration/notes-attachment/note-category/NoteCategoryEdit';
import CheckPermission from '../../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../../not-found/NotFoundPage';

const EditNoteCategory = () => {
  return CheckPermission([
    Permissions.OPERATIONS_ADMINISTRATION.NOTES_AND_ATTACHMENTS.NOTES_CATEGORY
      .WRITE,
  ]) ? (
    <Layout>
      <NoteCategoryEdit />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default EditNoteCategory;
