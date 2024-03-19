import React from 'react';
import VehicleTypeUpsert from '../../../../../../components/system-configuration/tenants-administration/organizational-administration/resources/vehicle-type/VehicleTypeUpsert';
import Layout from '../../../../../../components/common/layout/index';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

const CreateVehicleType = () => {
  const hasPermission = CheckPermission([
    Permissions.ORGANIZATIONAL_ADMINISTRATION.RESOURCES.VEHICLE_TYPE.WRITE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <VehicleTypeUpsert />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default CreateVehicleType;
