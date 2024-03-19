import React from 'react';
import Layout from '../../../../../../../components/common/layout';
import AddNoteSubCategory from '../../../../../../../components/system-configuration/tenants-administration/crm-administration/account/note-subcategory/AddNoteSubCategory';
import CheckPermission from '../../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../../not-found/NotFoundPage';

const CreateNoteSubCategory = () => {
  const hasPermission = CheckPermission([
    Permissions.CRM_ADMINISTRATION.ACCOUNTS.NOTES_SUBCATEGORY.WRITE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <AddNoteSubCategory />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default CreateNoteSubCategory;
