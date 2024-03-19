import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../../../../../../components/common/layout/index';
import VehicleView from '../../../../../../components/system-configuration/tenants-administration/organizational-administration/resources/vehicle/VehicleView';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

const ViewVehicle = () => {
  const { id } = useParams();
  const hasPermission = CheckPermission([
    Permissions.ORGANIZATIONAL_ADMINISTRATION.RESOURCES.VEHICLES.READ,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <VehicleView vehicleId={id} />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default ViewVehicle;
