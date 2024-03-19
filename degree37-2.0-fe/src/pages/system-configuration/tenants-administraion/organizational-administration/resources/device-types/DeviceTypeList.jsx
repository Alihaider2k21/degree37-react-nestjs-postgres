import React from 'react';
import Layout from '../../../../../../components/common/layout';
import ListDeviceType from '../../../../../../components/system-configuration/tenants-administration/organizational-administration/resources/device-type/ListDeviceType';
import CheckPermission from '../../../../../../helpers/CheckPermissions.js';
import Permissions from '../../../../../../enums/PermissionsEnum.js';
import NotFoundPage from '../../../../../not-found/NotFoundPage.jsx';

export const DeviceTypeList = () => {
  return CheckPermission(null, [
    Permissions.ORGANIZATIONAL_ADMINISTRATION.RESOURCES.DEVICES.MODULE_CODE,
  ]) ? (
    <Layout>
      <ListDeviceType />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};
