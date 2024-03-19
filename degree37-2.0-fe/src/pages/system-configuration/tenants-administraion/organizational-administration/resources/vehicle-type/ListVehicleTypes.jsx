import React from 'react';
import VehicleTypesList from '../../../../../../components/system-configuration/tenants-administration/organizational-administration/resources/vehicle-type/VehicleTypeList';
import Layout from '../../../../../../components/common/layout';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

const ListVehicleTypes = () => {
  const hasPermission = CheckPermission(null, [
    Permissions.ORGANIZATIONAL_ADMINISTRATION.RESOURCES.VEHICLE_TYPE
      .MODULE_CODE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <VehicleTypesList />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default ListVehicleTypes;
