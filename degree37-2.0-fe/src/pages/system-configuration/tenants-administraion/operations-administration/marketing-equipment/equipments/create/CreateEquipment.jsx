import React from 'react';
import Layout from '../../../../../../../components/common/layout/index';
import AddEquipment from '../../../../../../../components/system-configuration/tenants-administration/operations-administration/marketing-equipment/equipment/AddEquipment';
import CheckPermission from '../../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../../not-found/NotFoundPage';

const CreateEquipment = () => {
  return CheckPermission([
    Permissions.OPERATIONS_ADMINISTRATION.MARKETING_EQUIPMENTS.EQUIPMENTS.WRITE,
  ]) ? (
    <Layout>
      <AddEquipment />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default CreateEquipment;
