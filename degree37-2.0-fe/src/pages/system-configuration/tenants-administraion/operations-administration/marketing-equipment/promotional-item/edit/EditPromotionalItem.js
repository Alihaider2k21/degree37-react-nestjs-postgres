import React from 'react';
import Layout from '../../../../../../../components/common/layout';
import PromotionalItemEdit from '../../../../../../../components/system-configuration/tenants-administration/operations-administration/marketing-equipment/promotional-item/PromotionalItemEdit';

import { useParams } from 'react-router-dom';
import CheckPermission from '../../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../../not-found/NotFoundPage';

const EditPromotionalItem = () => {
  const { id } = useParams();
  return CheckPermission([
    Permissions.OPERATIONS_ADMINISTRATION.MARKETING_EQUIPMENTS.PROMOTIONAL_ITEMS
      .WRITE,
  ]) ? (
    <Layout>
      <PromotionalItemEdit promotionId={id} />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default EditPromotionalItem;
