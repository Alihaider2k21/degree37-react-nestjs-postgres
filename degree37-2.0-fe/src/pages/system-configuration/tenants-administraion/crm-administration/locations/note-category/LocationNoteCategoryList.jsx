import React from 'react';
import Layout from '../../../../../../components/common/layout';
import ListLocationNoteCategory from '../../../../../../components/system-configuration/tenants-administration/crm-administration/locations/note-category/ListLocationNoteCategory';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

const LocationNoteCategoryList = () => {
  const hasPermission = CheckPermission(null, [
    Permissions.CRM_ADMINISTRATION.LOCATIONS.NOTES_CATEGORY.MODULE_CODE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <ListLocationNoteCategory />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default LocationNoteCategoryList;
