import React from 'react';
import Layout from '../../../../../../components/common/layout';
import PromotionalItemList from '../../../../../../components/system-configuration/tenants-administration/operations-administration/marketing-equipment/promotional-item/PromotionalItemList';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

const ListPromotionalItems = () => {
  return CheckPermission(null, [
    Permissions.OPERATIONS_ADMINISTRATION.MARKETING_EQUIPMENTS.PROMOTIONAL_ITEMS
      .MODULE_CODE,
  ]) ? (
    <Layout>
      <PromotionalItemList />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default ListPromotionalItems;
