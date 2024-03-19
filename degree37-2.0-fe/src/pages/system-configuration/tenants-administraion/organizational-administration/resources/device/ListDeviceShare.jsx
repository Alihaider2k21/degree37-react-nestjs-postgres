import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../../../../../../components/common/layout/index';
import DeviceShareList from '../../../../../../components/system-configuration/tenants-administration/organizational-administration/resources/device/DeviceShareList';
import CheckPermission from '../../../../../../helpers/CheckPermissions.js';
import Permissions from '../../../../../../enums/PermissionsEnum.js';
import NotFoundPage from '../../../../../not-found/NotFoundPage.jsx';

const ListDeviceShare = () => {
  const { id } = useParams();

  return CheckPermission([
    Permissions.ORGANIZATIONAL_ADMINISTRATION.RESOURCES.DEVICES.SHARE_DEVICE,
  ]) ? (
    <Layout>
      <DeviceShareList deviceId={id} />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default ListDeviceShare;
