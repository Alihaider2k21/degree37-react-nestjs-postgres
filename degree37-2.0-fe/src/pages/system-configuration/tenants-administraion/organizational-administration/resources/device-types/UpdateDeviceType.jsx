import React from 'react';
import EditDeviceType from '../../../../../../components/system-configuration/tenants-administration/organizational-administration/resources/device-type/EditDeviceType';
import Layout from '../../../../../../components/common/layout';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';
const UpdateDeviceType = () => {
  const hasPermission = CheckPermission([
    Permissions.ORGANIZATIONAL_ADMINISTRATION.RESOURCES.DEVICE_TYPE.WRITE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <EditDeviceType />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default UpdateDeviceType;
