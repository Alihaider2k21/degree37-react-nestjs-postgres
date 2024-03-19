import React from 'react';
import Layout from '../../../../../../../components/common/layout';
import NoteCategoryEdit from '../../../../../../../components/system-configuration/tenants-administration/crm-administration/account/note-category/NoteCategoryEdit';
import CheckPermission from '../../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../../not-found/NotFoundPage';

const EditNoteCategory = () => {
  const hasPermission = CheckPermission([
    Permissions.CRM_ADMINISTRATION.ACCOUNTS.NOTES_CATEGORY.WRITE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <NoteCategoryEdit />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default EditNoteCategory;
