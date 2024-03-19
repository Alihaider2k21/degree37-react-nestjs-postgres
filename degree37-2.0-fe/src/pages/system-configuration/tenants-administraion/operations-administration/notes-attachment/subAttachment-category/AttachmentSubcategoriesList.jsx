import React from 'react';
import AttachmentSubcategoriesListing from '../../../../../../components/system-configuration/tenants-administration/operations-administration/notes-attachment/subAttachment-category/AttachmentSubCategoriesListing';
import Layout from '../../../../../../components/common/layout';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

export const AttachmentSubcategoriesList = () => {
  return CheckPermission(null, [
    Permissions.OPERATIONS_ADMINISTRATION.NOTES_AND_ATTACHMENTS
      .ATTACHMENTS_SUBCATEGORY.MODULE_CODE,
  ]) ? (
    <Layout>
      <AttachmentSubcategoriesListing />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};
