import React from 'react';
import Layout from '../../../../../../../components/common/layout';
import EditAttachmentSubcategoryComponent from '../../../../../../../components/system-configuration/tenants-administration/operations-administration/notes-attachment/subAttachment-category/edit/EditAttachmentSubcategory';
import CheckPermission from '../../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../../not-found/NotFoundPage';
export const EditNotesAttachmentSubcategory = () => {
  return CheckPermission([
    Permissions.OPERATIONS_ADMINISTRATION.NOTES_AND_ATTACHMENTS
      .ATTACHMENTS_SUBCATEGORY.WRITE,
  ]) ? (
    <Layout>
      <EditAttachmentSubcategoryComponent />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};
