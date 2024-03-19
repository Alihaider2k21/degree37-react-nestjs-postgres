import React from 'react';
import { useParams } from 'react-router-dom';
import VehicleScheduleReitrement from '../../../../../../components/system-configuration/tenants-administration/organizational-administration/resources/vehicle/VehicleScheduleReitrement';
import Layout from '../../../../../../components/common/layout/index';
import NotFoundPage from '../../../../../not-found/NotFoundPage.jsx';
import CheckPermission from '../../../../../../helpers/CheckPermissions.js';
import Permissions from '../../../../../../enums/PermissionsEnum.js';

const ScheduleVehicleRetirement = () => {
  const { id } = useParams();

  return CheckPermission([
    Permissions.ORGANIZATIONAL_ADMINISTRATION.RESOURCES.VEHICLES
      .SCHEDULE_RETIREMENT,
  ]) ? (
    <Layout>
      <VehicleScheduleReitrement vehicleId={id} />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default ScheduleVehicleRetirement;
