import React from 'react';
import PromotionList from '../../../../../../components/system-configuration/tenants-administration/operations-administration/marketing-equipment/promotions/PromotionList';
import Layout from '../../../../../../components/common/layout';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

const ListPromotions = () => {
  return CheckPermission(null, [
    Permissions.OPERATIONS_ADMINISTRATION.MARKETING_EQUIPMENTS.PROMOTIONS
      .MODULE_CODE,
  ]) ? (
    <Layout>
      <PromotionList />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default ListPromotions;
