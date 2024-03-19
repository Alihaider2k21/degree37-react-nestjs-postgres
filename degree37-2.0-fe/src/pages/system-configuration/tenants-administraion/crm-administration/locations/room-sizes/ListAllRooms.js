import React from 'react';
import Layout from '../../../../../../components/common/layout';
import ListAllRoomSizes from '../../../../../../components/system-configuration/tenants-administration/crm-administration/locations/room-sizes/ListAllRooms';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

// /system-configuration/tenant-admin/crm-admin/locations/room-size
const ListAllRooms = () => {
  const hasPermission = CheckPermission(null, [
    Permissions.CRM_ADMINISTRATION.LOCATIONS.ROOM_SIZES.MODULE_CODE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <ListAllRoomSizes />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default ListAllRooms;
