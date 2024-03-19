import React from 'react';
import Layout from '../../../../../../../components/common/layout/index';
import LocationsAttachmentSubCategoryEdit from '../../../../../../../components/system-configuration/tenants-administration/crm-administration/locations/attachment-subcategories/EditAttachmentSubCategory';
import CheckPermission from '../../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../../not-found/NotFoundPage';

const EditLocationsAttachmentSubCategories = () => {
  const hasPermission = CheckPermission([
    Permissions.CRM_ADMINISTRATION.LOCATIONS.ATTACHMENTS_SUBCATEGORY.WRITE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <LocationsAttachmentSubCategoryEdit />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default EditLocationsAttachmentSubCategories;
