import React from 'react';
import Layout from '../../../../../../../components/common/layout';
import NewAttachmentCategory from '../../../../../../../components/system-configuration/tenants-administration/operations-administration/notes-attachment/attachment-category/create/CreateAttachmentCategory';
import CheckPermission from '../../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../../not-found/NotFoundPage';
export const CreateAttachmentCategory = () => {
  return CheckPermission([
    Permissions.OPERATIONS_ADMINISTRATION.NOTES_AND_ATTACHMENTS
      .ATTACHMENTS_CATEGORY.WRITE,
  ]) ? (
    <Layout>
      <NewAttachmentCategory />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};
