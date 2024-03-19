import React from 'react';
import Layout from '../../../../../../components/common/layout';
import CreateUpdateForm from '../../../../../../components/system-configuration/tenants-administration/crm-administration/locations/room-sizes/CreateUpdateForm';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

const CreateUpdateRoomSize = () => {
  const hasPermission = CheckPermission([
    Permissions.CRM_ADMINISTRATION.LOCATIONS.ROOM_SIZES.WRITE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <CreateUpdateForm />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default CreateUpdateRoomSize;
