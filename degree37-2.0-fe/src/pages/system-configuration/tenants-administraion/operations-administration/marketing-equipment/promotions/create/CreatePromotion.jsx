import React from 'react';
import PromotionUpsert from '../../../../../../../components/system-configuration/tenants-administration/operations-administration/marketing-equipment/promotions/PromotionUpsert';
import Layout from '../../../../../../../components/common/layout/index';
import CheckPermission from '../../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../../not-found/NotFoundPage';

const CreatePromotion = () => {
  return CheckPermission([
    Permissions.OPERATIONS_ADMINISTRATION.MARKETING_EQUIPMENTS.PROMOTIONS.WRITE,
  ]) ? (
    <Layout>
      <PromotionUpsert />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default CreatePromotion;
