import React from 'react';
import Layout from '../../../../../../components/common/layout';
import DevicesList from '../../../../../../components/system-configuration/tenants-administration/organizational-administration/resources/device/DeviceList';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

const ListDevices = () => {
  const hasPermission = CheckPermission(null, [
    Permissions.ORGANIZATIONAL_ADMINISTRATION.RESOURCES.DEVICES.MODULE_CODE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <DevicesList />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default ListDevices;
