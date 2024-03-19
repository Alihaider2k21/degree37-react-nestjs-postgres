import React from 'react';
import Layout from '../../../../../../components/common/layout';
import MarketingMaterialEdit from '../../../../../../components/system-configuration/tenants-administration/operations-administration/marketing-equipment/marketing-material/MarketingMaterialEdit';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

const EditMarketingMaterial = () => {
  return CheckPermission([
    Permissions.OPERATIONS_ADMINISTRATION.MARKETING_EQUIPMENTS
      .MARKETING_MATERIAL.WRITE,
  ]) ? (
    <Layout>
      <MarketingMaterialEdit />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default EditMarketingMaterial;
