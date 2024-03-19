import React from 'react';
import Layout from '../../../../../../../components/common/layout/index';
import AddLocationNoteSubCategory from '../../../../../../../components/system-configuration/tenants-administration/crm-administration/locations/note-subcategory/AddLocationNoteSubCategory';
import CheckPermission from '../../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../../not-found/NotFoundPage';

const LocationNoteSubCategoryAdd = () => {
  const hasPermission = CheckPermission([
    Permissions.CRM_ADMINISTRATION.LOCATIONS.ATTACHMENTS_SUBCATEGORY.WRITE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <AddLocationNoteSubCategory />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default LocationNoteSubCategoryAdd;
