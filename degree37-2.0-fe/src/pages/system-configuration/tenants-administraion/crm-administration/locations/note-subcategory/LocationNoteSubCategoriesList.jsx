import React from 'react';
import Layout from '../../../../../../components/common/layout';
import ListLocationNoteSubCategory from '../../../../../../components/system-configuration/tenants-administration/crm-administration/locations/note-subcategory/ListLocationNoteSubCategory';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

const LocationNoteSubCategoriesList = () => {
  const hasPermission = CheckPermission(null, [
    Permissions.CRM_ADMINISTRATION.LOCATIONS.NOTES_SUBCATEGORY.MODULE_CODE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <ListLocationNoteSubCategory />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default LocationNoteSubCategoriesList;
