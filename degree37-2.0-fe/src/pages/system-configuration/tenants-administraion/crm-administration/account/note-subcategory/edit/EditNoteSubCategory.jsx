import React from 'react';
import Layout from '../../../../../../../components/common/layout';
import EditNotesSubCategory from '../../../../../../../components/system-configuration/tenants-administration/crm-administration/account/note-subcategory/NoteSubCategoryEdit';
import CheckPermission from '../../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../../not-found/NotFoundPage';

const EditNoteSubCategory = () => {
  const hasPermission = CheckPermission([
    Permissions.CRM_ADMINISTRATION.ACCOUNTS.NOTES_SUBCATEGORY.WRITE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <EditNotesSubCategory />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default EditNoteSubCategory;
