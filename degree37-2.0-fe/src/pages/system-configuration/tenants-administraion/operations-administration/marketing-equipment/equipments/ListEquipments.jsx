import React from 'react';
import Layout from '../../../../../../components/common/layout';
import EquipmentsList from '../../../../../../components/system-configuration/tenants-administration/operations-administration/marketing-equipment/equipment/ListEquipment';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';
const ListEquipments = () => {
  return CheckPermission(null, [
    Permissions.OPERATIONS_ADMINISTRATION.MARKETING_EQUIPMENTS.EQUIPMENTS
      .MODULE_CODE,
  ]) ? (
    <Layout>
      <EquipmentsList />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default ListEquipments;
