import React from 'react';
import Layout from '../../../../../../components/common/layout/index';
import DeviceUpsert from '../../../../../../components/system-configuration/tenants-administration/organizational-administration/resources/device/DeviceUpsert';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

const EditDevice = () => {
  const hasPermission = CheckPermission([
    Permissions.ORGANIZATIONAL_ADMINISTRATION.RESOURCES.DEVICES.WRITE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <DeviceUpsert />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default EditDevice;
