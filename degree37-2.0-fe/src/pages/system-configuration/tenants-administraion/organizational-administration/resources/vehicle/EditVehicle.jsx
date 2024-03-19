import React from 'react';
import Layout from '../../../../../../components/common/layout/index';
import VehicleUpsert from '../../../../../../components/system-configuration/tenants-administration/organizational-administration/resources/vehicle/VehicleUpsert';
import { useParams } from 'react-router-dom';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

const EditVehicle = () => {
  const { id } = useParams();
  const hasPermission = CheckPermission([
    Permissions.ORGANIZATIONAL_ADMINISTRATION.RESOURCES.VEHICLES.WRITE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <VehicleUpsert vehicleId={id} />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default EditVehicle;
