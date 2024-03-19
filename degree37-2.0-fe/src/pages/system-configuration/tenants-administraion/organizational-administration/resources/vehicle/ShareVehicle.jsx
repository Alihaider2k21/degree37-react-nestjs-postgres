import React from 'react';
import { useParams } from 'react-router-dom';
import VehicleShare from '../../../../../../components/system-configuration/tenants-administration/organizational-administration/resources/vehicle/VehicleShare';
import Layout from '../../../../../../components/common/layout/index';
import NotFoundPage from '../../../../../not-found/NotFoundPage.jsx';
import Permissions from '../../../../../../enums/PermissionsEnum.js';
import CheckPermission from '../../../../../../helpers/CheckPermissions.js';

const ScheduleVehicleShare = () => {
  const { id, shareId } = useParams();

  return CheckPermission([
    Permissions.ORGANIZATIONAL_ADMINISTRATION.RESOURCES.VEHICLES.SHARE_VEHICLE,
  ]) ? (
    <Layout>
      <VehicleShare vehicleId={id} shareId={shareId} />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default ScheduleVehicleShare;
