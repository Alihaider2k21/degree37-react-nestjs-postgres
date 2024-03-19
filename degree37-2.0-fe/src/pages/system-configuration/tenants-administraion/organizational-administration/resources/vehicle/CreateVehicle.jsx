import React from 'react';
import VehicleUpsert from '../../../../../../components/system-configuration/tenants-administration/organizational-administration/resources/vehicle/VehicleUpsert';
import Layout from '../../../../../../components/common/layout/index';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

const CreateVehicle = () => {
  const hasPermission = CheckPermission([
    Permissions.ORGANIZATIONAL_ADMINISTRATION.RESOURCES.VEHICLES.WRITE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <VehicleUpsert />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default CreateVehicle;
