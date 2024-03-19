import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../../../../../../../components/common/layout/index';
import PromotionalItemView from '../../../../../../../components/system-configuration/tenants-administration/operations-administration/marketing-equipment/promotional-item/PromotionalItemView';
import CheckPermission from '../../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../../not-found/NotFoundPage';

const ViewPromotionalItem = () => {
  const { id } = useParams();
  return CheckPermission([
    Permissions.OPERATIONS_ADMINISTRATION.MARKETING_EQUIPMENTS.PROMOTIONAL_ITEMS
      .READ,
  ]) ? (
    <Layout>
      <PromotionalItemView promotionId={id} />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default ViewPromotionalItem;
