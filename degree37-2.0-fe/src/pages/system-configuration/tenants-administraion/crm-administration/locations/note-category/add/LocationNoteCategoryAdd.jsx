import React from 'react';
import Layout from '../../../../../../../components/common/layout';
import AddLocationNoteCategory from '../../../../../../../components/system-configuration/tenants-administration/crm-administration/locations/note-category/AddLocationNoteCategory';
import CheckPermission from '../../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../../not-found/NotFoundPage';

const LocationNoteCategoryAdd = () => {
  const hasPermission = CheckPermission([
    Permissions.CRM_ADMINISTRATION.LOCATIONS.NOTES_CATEGORY.WRITE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <AddLocationNoteCategory />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default LocationNoteCategoryAdd;
