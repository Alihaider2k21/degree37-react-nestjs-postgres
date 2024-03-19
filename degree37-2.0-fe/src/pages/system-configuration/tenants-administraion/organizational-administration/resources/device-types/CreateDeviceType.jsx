import React from 'react';
import Layout from '../../../../../../components/common/layout/index';
import AddDeviceType from '../../../../../../components/system-configuration/tenants-administration/organizational-administration/resources/device-type/AddDeviceType';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';
const CreateDeviceType = () => {
  const hasPermission = CheckPermission([
    Permissions.ORGANIZATIONAL_ADMINISTRATION.RESOURCES.DEVICE_TYPE.WRITE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <AddDeviceType />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default CreateDeviceType;
