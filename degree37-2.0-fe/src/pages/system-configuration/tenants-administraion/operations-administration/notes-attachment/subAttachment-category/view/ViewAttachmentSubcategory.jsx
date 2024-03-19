import React from 'react';
import Layout from '../../../../../../../components/common/layout';
import ViewAttachmentSubcategoryComponent from '../../../../../../../components/system-configuration/tenants-administration/operations-administration/notes-attachment/subAttachment-category/view/ViewAttachmentSubcategory';
import CheckPermission from '../../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../../not-found/NotFoundPage';
export const ViewAttachmentSubcategory = () => {
  return CheckPermission([
    Permissions.OPERATIONS_ADMINISTRATION.NOTES_AND_ATTACHMENTS
      .ATTACHMENTS_SUBCATEGORY.READ,
  ]) ? (
    <Layout>
      <ViewAttachmentSubcategoryComponent />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};
