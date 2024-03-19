import React from 'react';
import Layout from '../../../../../../components/common/layout';
import ListNoteCategory from '../../../../../../components/system-configuration/tenants-administration/crm-administration/account/note-category/ListNoteCategory';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

const NoteCategoryList = () => {
  const hasPermission = CheckPermission(null, [
    Permissions.CRM_ADMINISTRATION.ACCOUNTS.NOTES_CATEGORY.MODULE_CODE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <ListNoteCategory />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default NoteCategoryList;
