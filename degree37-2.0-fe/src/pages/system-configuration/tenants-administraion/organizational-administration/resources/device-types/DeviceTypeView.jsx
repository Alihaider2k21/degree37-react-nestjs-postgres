import React from 'react';
import Layout from '../../../../../../components/common/layout';
import ViewDeviceType from '../../../../../../components/system-configuration/tenants-administration/organizational-administration/resources/device-type/ViewDeviceType';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

export const DeviceTypeView = () => {
  const hasPermission = CheckPermission([
    Permissions.ORGANIZATIONAL_ADMINISTRATION.RESOURCES.DEVICE_TYPE.READ,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <ViewDeviceType />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};
