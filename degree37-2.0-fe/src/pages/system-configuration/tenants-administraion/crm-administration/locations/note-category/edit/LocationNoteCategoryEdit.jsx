import React from 'react';
import Layout from '../../../../../../../components/common/layout';
import EditLocationNoteCategory from '../../../../../../../components/system-configuration/tenants-administration/crm-administration/locations/note-category/EditLocationNoteCategory';
import CheckPermission from '../../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../../not-found/NotFoundPage';

const LocationNoteCategoryEdit = () => {
  const hasPermission = CheckPermission([
    Permissions.CRM_ADMINISTRATION.LOCATIONS.NOTES_CATEGORY.WRITE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <EditLocationNoteCategory />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default LocationNoteCategoryEdit;
