import React from 'react';
import Layout from '../../../../../../../components/common/layout/index';
import ViewLocationNoteSubCategory from '../../../../../../../components/system-configuration/tenants-administration/crm-administration/locations/note-subcategory/ViewLocationNoteSubCategory';
import CheckPermission from '../../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../../not-found/NotFoundPage';

const LocationNoteSubCategoryView = () => {
  const hasPermission = CheckPermission([
    Permissions.CRM_ADMINISTRATION.LOCATIONS.NOTES_SUBCATEGORY.READ,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <ViewLocationNoteSubCategory />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default LocationNoteSubCategoryView;
