import React from 'react';
import Layout from '../../../../../../../components/common/layout/index';
import LocationsAttachmentCategoryCreate from '../../../../../../../components/system-configuration/tenants-administration/crm-administration/locations/attachment-categories/AttachmentCategoryCreate';
import CheckPermission from '../../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../../not-found/NotFoundPage';

const CreateLocationsAttachmentCategories = () => {
  const hasPermission = CheckPermission([
    Permissions.CRM_ADMINISTRATION.LOCATIONS.ATTACHMENTS_CATEGORY.WRITE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <LocationsAttachmentCategoryCreate />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default CreateLocationsAttachmentCategories;
