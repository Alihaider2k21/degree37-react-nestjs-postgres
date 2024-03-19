import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../../../../../../components/common/layout/index';
import DeviceScheduleMaintenance from '../../../../../../components/system-configuration/tenants-administration/organizational-administration/resources/device/DeviceScheduleMaintenance';
import CheckPermission from '../../../../../../helpers/CheckPermissions.js';
import Permissions from '../../../../../../enums/PermissionsEnum.js';
import NotFoundPage from '../../../../../not-found/NotFoundPage.jsx';

const ScheduleDeviceMaintenance = () => {
  const { id } = useParams();

  return CheckPermission([
    Permissions.ORGANIZATIONAL_ADMINISTRATION.RESOURCES.DEVICES
      .SCHEDULE_MAINTENANCE,
  ]) ? (
    <Layout>
      <DeviceScheduleMaintenance deviceId={id} />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default ScheduleDeviceMaintenance;
