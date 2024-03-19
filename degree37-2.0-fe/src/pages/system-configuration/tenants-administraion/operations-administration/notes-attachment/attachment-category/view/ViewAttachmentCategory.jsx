import React from 'react';
import Layout from '../../../../../../../components/common/layout';
import ViewAttachmentCategoryComponent from '../../../../../../../components/system-configuration/tenants-administration/operations-administration/notes-attachment/attachment-category/view/ViewAttachmentCategory';
import CheckPermission from '../../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../../not-found/NotFoundPage';
export const ViewAttachmentCategory = () => {
  return CheckPermission([
    Permissions.OPERATIONS_ADMINISTRATION.NOTES_AND_ATTACHMENTS
      .ATTACHMENTS_CATEGORY.READ,
  ]) ? (
    <Layout>
      <ViewAttachmentCategoryComponent />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};
