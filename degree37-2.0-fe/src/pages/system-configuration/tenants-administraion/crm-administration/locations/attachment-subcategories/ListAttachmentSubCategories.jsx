import React from 'react';
import Layout from '../../../../../../components/common/layout/index';
import LocationsAttachmentSubCategoryList from '../../../../../../components/system-configuration/tenants-administration/crm-administration/locations/attachment-subcategories/ListAttachmentSubCategory';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

const ListLocationsAttachmentSubCategories = () => {
  const hasPermission = CheckPermission(null, [
    Permissions.CRM_ADMINISTRATION.LOCATIONS.ATTACHMENTS_SUBCATEGORY
      .MODULE_CODE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <LocationsAttachmentSubCategoryList />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default ListLocationsAttachmentSubCategories;
