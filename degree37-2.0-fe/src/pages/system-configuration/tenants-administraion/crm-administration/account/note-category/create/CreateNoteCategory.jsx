import React from 'react';
import Layout from '../../../../../../../components/common/layout';
import AddNoteCategory from '../../../../../../../components/system-configuration/tenants-administration/crm-administration/account/note-category/AddNoteCategory';
import CheckPermission from '../../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../../not-found/NotFoundPage';

const CreateNoteCategory = () => {
  const hasPermission = CheckPermission([
    Permissions.CRM_ADMINISTRATION.ACCOUNTS.NOTES_CATEGORY.WRITE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <AddNoteCategory />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default CreateNoteCategory;
