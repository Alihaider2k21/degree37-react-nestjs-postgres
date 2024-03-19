import React from 'react';
import Layout from '../../../../../../../components/common/layout/index';
import LocationsAttachmentSubCategoryCreate from '../../../../../../../components/system-configuration/tenants-administration/crm-administration/locations/attachment-subcategories/CreateAttachmentSubCategory';
import CheckPermission from '../../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../../not-found/NotFoundPage';

const CreateLocationsAttachmentSubCategories = () => {
  const hasPermission = CheckPermission([
    Permissions.CRM_ADMINISTRATION.LOCATIONS.ATTACHMENTS_SUBCATEGORY.WRITE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <LocationsAttachmentSubCategoryCreate />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default CreateLocationsAttachmentSubCategories;
