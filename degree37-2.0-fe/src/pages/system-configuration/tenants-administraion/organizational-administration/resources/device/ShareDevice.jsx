import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../../../../../../components/common/layout/index';
import DeviceShare from '../../../../../../components/system-configuration/tenants-administration/organizational-administration/resources/device/DeviceShare';
import NotFoundPage from '../../../../../not-found/NotFoundPage.jsx';
import CheckPermission from '../../../../../../helpers/CheckPermissions.js';
import Permissions from '../../../../../../enums/PermissionsEnum';

const ShareDevice = () => {
  const { id } = useParams();

  return CheckPermission([
    Permissions.ORGANIZATIONAL_ADMINISTRATION.RESOURCES.DEVICES.SHARE_DEVICE,
  ]) ? (
    <Layout>
      <DeviceShare deviceId={id} />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default ShareDevice;
