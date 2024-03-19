import React from 'react';
import Layout from '../../../../../../components/common/layout';
import ViewDetailOfRoomSize from '../../../../../../components/system-configuration/tenants-administration/crm-administration/locations/room-sizes/ViewDetailOfRoomSize';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

const ViewRoomDetail = () => {
  const hasPermission = CheckPermission([
    Permissions.CRM_ADMINISTRATION.LOCATIONS.ROOM_SIZES.READ,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <ViewDetailOfRoomSize />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default ViewRoomDetail;
