import React from 'react';
import AttachmentCategoriesListing from '../../../../../../components/system-configuration/tenants-administration/operations-administration/notes-attachment/attachment-category/AttachmentCategoriesListing';
import Layout from '../../../../../../components/common/layout';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

export const AttachmentCategoriesList = () => {
  return CheckPermission(null, [
    Permissions.OPERATIONS_ADMINISTRATION.NOTES_AND_ATTACHMENTS
      .ATTACHMENTS_CATEGORY.MODULE_CODE,
  ]) ? (
    <Layout>
      <AttachmentCategoriesListing />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};
