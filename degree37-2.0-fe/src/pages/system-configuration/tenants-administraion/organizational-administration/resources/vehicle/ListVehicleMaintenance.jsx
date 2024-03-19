import React from 'react';
import { useParams } from 'react-router-dom';
import VehicleMaintenanceList from '../../../../../../components/system-configuration/tenants-administration/organizational-administration/resources/vehicle/VehicleMaintenanceList';
import Layout from '../../../../../../components/common/layout/index';
import NotFoundPage from '../../../../../not-found/NotFoundPage.jsx';
import CheckPermission from '../../../../../../helpers/CheckPermissions.js';
import Permissions from '../../../../../../enums/PermissionsEnum.js';

const ListVehicleMaintenance = () => {
  const { id } = useParams();

  return CheckPermission([
    Permissions.ORGANIZATIONAL_ADMINISTRATION.RESOURCES.VEHICLES
      .SCHEDULE_MAINTENANCE,
  ]) ? (
    <Layout>
      <VehicleMaintenanceList vehicleId={id} />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default ListVehicleMaintenance;
