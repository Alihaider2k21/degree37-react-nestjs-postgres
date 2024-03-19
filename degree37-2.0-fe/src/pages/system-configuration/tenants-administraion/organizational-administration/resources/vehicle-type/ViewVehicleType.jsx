import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../../../../../../components/common/layout/index';
import VehicleTypeView from '../../../../../../components/system-configuration/tenants-administration/organizational-administration/resources/vehicle-type/VehicleTypeView';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

const ViewVehicleType = () => {
  const { id } = useParams();
  const hasPermission = CheckPermission([
    Permissions.ORGANIZATIONAL_ADMINISTRATION.RESOURCES.VEHICLE_TYPE.READ,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <VehicleTypeView vehicleTypeId={id} />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default ViewVehicleType;
