import React from 'react';
import VehicleList from '../../../../../../components/system-configuration/tenants-administration/organizational-administration/resources/vehicle/VehicleList';
import Layout from '../../../../../../components/common/layout';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

const ListVehicle = () => {
  const hasPermission = CheckPermission(null, [
    Permissions.ORGANIZATIONAL_ADMINISTRATION.RESOURCES.VEHICLES.MODULE_CODE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <VehicleList />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default ListVehicle;
