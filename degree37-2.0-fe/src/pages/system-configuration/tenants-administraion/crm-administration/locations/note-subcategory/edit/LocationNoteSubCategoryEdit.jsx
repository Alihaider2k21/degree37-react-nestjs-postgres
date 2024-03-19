import React from 'react';
import Layout from '../../../../../../../components/common/layout/index';
import EditLocationNoteSubCategory from '../../../../../../../components/system-configuration/tenants-administration/crm-administration/locations/note-subcategory/EditLocationNoteSubCategory';
import CheckPermission from '../../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../../not-found/NotFoundPage';
const LocationNoteSubCategoryEdit = () => {
  const hasPermission = CheckPermission([
    Permissions.CRM_ADMINISTRATION.LOCATIONS.NOTES_SUBCATEGORY.WRITE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <EditLocationNoteSubCategory />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default LocationNoteSubCategoryEdit;
