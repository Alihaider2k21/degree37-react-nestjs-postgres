import React from 'react';
import Layout from '../../../../../../components/common/layout';
import ListNoteSubCategory from '../../../../../../components/system-configuration/tenants-administration/crm-administration/account/note-subcategory/ListNoteSubCategory';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

const NoteSubCategoryList = () => {
  const hasPermission = CheckPermission(null, [
    Permissions.CRM_ADMINISTRATION.ACCOUNTS.NOTES_SUBCATEGORY.MODULE_CODE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <ListNoteSubCategory />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default NoteSubCategoryList;
