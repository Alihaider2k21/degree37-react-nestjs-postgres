import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../../../../../../../components/common/layout/index';
import PromotionView from '../../../../../../../components/system-configuration/tenants-administration/operations-administration/marketing-equipment/promotions/PromotionView';
import NotFoundPage from '../../../../../../not-found/NotFoundPage';
import Permissions from '../../../../../../../enums/PermissionsEnum';
import CheckPermission from '../../../../../../../helpers/CheckPermissions';

const ViewPromotion = () => {
  const { id } = useParams();
  return CheckPermission([
    Permissions.OPERATIONS_ADMINISTRATION.MARKETING_EQUIPMENTS.PROMOTIONS.READ,
  ]) ? (
    <Layout>
      <PromotionView promotionId={id} />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default ViewPromotion;
