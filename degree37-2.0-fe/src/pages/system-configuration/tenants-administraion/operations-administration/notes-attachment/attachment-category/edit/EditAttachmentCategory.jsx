import React from 'react';
import Layout from '../../../../../../../components/common/layout';
import EditNotesAndAttachmentCategory from '../../../../../../../components/system-configuration/tenants-administration/operations-administration/notes-attachment/attachment-category/edit/EditAttachmentCategory';
import CheckPermission from '../../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../../not-found/NotFoundPage';
export const EditNotesAttachmentCategory = () => {
  return CheckPermission([
    Permissions.OPERATIONS_ADMINISTRATION.NOTES_AND_ATTACHMENTS
      .ATTACHMENTS_CATEGORY.WRITE,
  ]) ? (
    <Layout>
      <EditNotesAndAttachmentCategory />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};
