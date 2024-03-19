import React from 'react';
import Layout from '../../../../../../components/common/layout';
import ListNoteCategory from '../../../../../../components/system-configuration/tenants-administration/operations-administration/notes-attachment/note-category/ListNoteCategory';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

const NoteCategoryList = () => {
  return CheckPermission(null, [
    Permissions.OPERATIONS_ADMINISTRATION.NOTES_AND_ATTACHMENTS.NOTES_CATEGORY
      .MODULE_CODE,
  ]) ? (
    <Layout>
      <ListNoteCategory />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default NoteCategoryList;
