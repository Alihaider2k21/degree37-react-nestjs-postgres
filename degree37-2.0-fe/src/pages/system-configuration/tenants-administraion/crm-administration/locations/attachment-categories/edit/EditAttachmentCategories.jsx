import React from 'react';
import Layout from '../../../../../../../components/common/layout/index';
import LocationsAttachmentCategoryEdit from '../../../../../../../components/system-configuration/tenants-administration/crm-administration/locations/attachment-categories/AttachmentCategoryEdit';
import CheckPermission from '../../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../../not-found/NotFoundPage';

const EditLocationsAttachmentCategories = () => {
  const hasPermission = CheckPermission([
    Permissions.CRM_ADMINISTRATION.LOCATIONS.ATTACHMENTS_CATEGORY.WRITE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <LocationsAttachmentCategoryEdit />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default EditLocationsAttachmentCategories;
