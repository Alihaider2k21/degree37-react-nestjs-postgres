import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../../../../../../components/common/layout/index';
import DeviceView from '../../../../../../components/system-configuration/tenants-administration/organizational-administration/resources/device/DeviceView';
import NotFoundPage from '../../../../../not-found/NotFoundPage.jsx';
import CheckPermission from '../../../../../../helpers/CheckPermissions.js';
import Permissions from '../../../../../../enums/PermissionsEnum.js';

const ViewDevice = () => {
  const { id } = useParams();
  return CheckPermission([
    Permissions.ORGANIZATIONAL_ADMINISTRATION.RESOURCES.DEVICES.READ,
  ]) ? (
    <Layout>
      <DeviceView deviceId={id} />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default ViewDevice;
