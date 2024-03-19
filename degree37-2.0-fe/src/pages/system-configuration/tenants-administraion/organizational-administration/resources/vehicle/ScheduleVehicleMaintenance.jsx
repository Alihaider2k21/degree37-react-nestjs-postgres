import React from 'react';
import { useParams } from 'react-router-dom';
import VehicleScheduleMaintenance from '../../../../../../components/system-configuration/tenants-administration/organizational-administration/resources/vehicle/VehicleScheduleMaintenance';
import Layout from '../../../../../../components/common/layout/index';
import NotFoundPage from '../../../../../not-found/NotFoundPage.jsx';
import CheckPermission from '../../../../../../helpers/CheckPermissions.js';
import Permissions from '../../../../../../enums/PermissionsEnum.js';

const ScheduleVehicleMaintenance = () => {
  const { id, maintenanceId } = useParams();

  return CheckPermission([
    Permissions.ORGANIZATIONAL_ADMINISTRATION.RESOURCES.VEHICLES
      .SCHEDULE_MAINTENANCE,
  ]) ? (
    <Layout>
      <VehicleScheduleMaintenance
        vehicleId={id}
        maintenanceId={maintenanceId}
      />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default ScheduleVehicleMaintenance;
