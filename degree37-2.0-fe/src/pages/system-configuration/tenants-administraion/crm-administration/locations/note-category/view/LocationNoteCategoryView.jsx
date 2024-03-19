import React from 'react';
import Layout from '../../../../../../../components/common/layout';
import ViewLocationNoteCategory from '../../../../../../../components/system-configuration/tenants-administration/crm-administration/locations/note-category/ViewLocationNoteCategory';
import CheckPermission from '../../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../../not-found/NotFoundPage';

function LocationNoteCategoryView() {
  const hasPermission = CheckPermission([
    Permissions.CRM_ADMINISTRATION.LOCATIONS.NOTES_CATEGORY.READ,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <ViewLocationNoteCategory />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
}

export default LocationNoteCategoryView;
