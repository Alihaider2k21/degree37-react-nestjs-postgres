import React from 'react';
import AddPromotionalItem from '../../../../../../../components/system-configuration/tenants-administration/operations-administration/marketing-equipment/promotional-item/AddPromotionalItem';
import Layout from '../../../../../../../components/common/layout';
import CheckPermission from '../../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../../not-found/NotFoundPage';

const CreatePromotionalItem = () => {
  return CheckPermission([
    Permissions.OPERATIONS_ADMINISTRATION.MARKETING_EQUIPMENTS.PROMOTIONAL_ITEMS
      .WRITE,
  ]) ? (
    <Layout>
      <AddPromotionalItem />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default CreatePromotionalItem;
