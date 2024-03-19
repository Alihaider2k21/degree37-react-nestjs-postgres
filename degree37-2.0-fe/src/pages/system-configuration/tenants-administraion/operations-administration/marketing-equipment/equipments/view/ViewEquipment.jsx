import React from 'react';
import Layout from '../../../../../../../components/common/layout/index';
import ViewSingleEquipment from '../../../../../../../components/system-configuration/tenants-administration/operations-administration/marketing-equipment/equipment/ViewEquipment';
import CheckPermission from '../../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../../not-found/NotFoundPage';

const ViewEquipment = () => {
  return CheckPermission([
    Permissions.OPERATIONS_ADMINISTRATION.MARKETING_EQUIPMENTS.EQUIPMENTS.READ,
  ]) ? (
    <Layout>
      <ViewSingleEquipment />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default ViewEquipment;
