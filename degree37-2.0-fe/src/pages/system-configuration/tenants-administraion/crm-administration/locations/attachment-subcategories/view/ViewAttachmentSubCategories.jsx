import React from 'react';
import Layout from '../../../../../../../components/common/layout/index';
import LocationsAttachmentSubCategoryView from '../../../../../../../components/system-configuration/tenants-administration/crm-administration/locations/attachment-subcategories/ViewAttachmentSubCategory';
import CheckPermission from '../../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../../not-found/NotFoundPage';

const ViewLocationsAttachmentSubCategories = () => {
  const hasPermission = CheckPermission([
    Permissions.CRM_ADMINISTRATION.LOCATIONS.ATTACHMENTS_SUBCATEGORY.WRITE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <LocationsAttachmentSubCategoryView />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default ViewLocationsAttachmentSubCategories;
