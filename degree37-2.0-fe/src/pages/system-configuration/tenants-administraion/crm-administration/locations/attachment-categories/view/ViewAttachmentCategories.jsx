import React from 'react';
import Layout from '../../../../../../../components/common/layout/index';
import LocationsAttachmentCategoryView from '../../../../../../../components/system-configuration/tenants-administration/crm-administration/locations/attachment-categories/AttachmentCategoryView';
import CheckPermission from '../../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../../not-found/NotFoundPage';

const ViewLocationsAttachmentCategories = () => {
  const hasPermission = CheckPermission([
    Permissions.CRM_ADMINISTRATION.LOCATIONS.ATTACHMENTS_CATEGORY.READ,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <LocationsAttachmentCategoryView />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default ViewLocationsAttachmentCategories;
