import React from 'react';
import { useParams } from 'react-router-dom';
import VehicleShareList from '../../../../../../components/system-configuration/tenants-administration/organizational-administration/resources/vehicle/VehicleShareList';
import Layout from '../../../../../../components/common/layout/index';
import Permissions from '../../../../../../enums/PermissionsEnum.js';
import CheckPermission from '../../../../../../helpers/CheckPermissions.js';
import NotFoundPage from '../../../../../not-found/NotFoundPage.jsx';

const ListVehicleMaintenance = () => {
  const { id } = useParams();

  return CheckPermission([
    Permissions.ORGANIZATIONAL_ADMINISTRATION.RESOURCES.VEHICLES.SHARE_VEHICLE,
  ]) ? (
    <Layout>
      <VehicleShareList vehicleId={id} />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default ListVehicleMaintenance;
