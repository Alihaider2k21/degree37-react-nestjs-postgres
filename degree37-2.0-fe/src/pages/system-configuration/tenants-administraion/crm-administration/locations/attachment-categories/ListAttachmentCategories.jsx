import React from 'react';
import Layout from '../../../../../../components/common/layout/index';
import LocationsAttachmentCategoryList from '../../../../../../components/system-configuration/tenants-administration/crm-administration/locations/attachment-categories/AttachmentCategoryList';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

const ListLocationsAttachmentCategories = () => {
  const hasPermission = CheckPermission(null, [
    Permissions.CRM_ADMINISTRATION.LOCATIONS.ATTACHMENTS_CATEGORY.MODULE_CODE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <LocationsAttachmentCategoryList />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default ListLocationsAttachmentCategories;
