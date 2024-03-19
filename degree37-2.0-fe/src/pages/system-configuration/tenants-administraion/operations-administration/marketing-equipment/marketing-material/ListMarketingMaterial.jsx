import React from 'react';
import MarketingMaterialList from '../../../../../../components/system-configuration/tenants-administration/operations-administration/marketing-equipment/marketing-material/MarketingMaterialList';
import Layout from '../../../../../../components/common/layout';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

const ListMarketingMaterial = () => {
  return CheckPermission(null, [
    Permissions.OPERATIONS_ADMINISTRATION.MARKETING_EQUIPMENTS
      .MARKETING_MATERIAL.MODULE_CODE,
  ]) ? (
    <Layout>
      <MarketingMaterialList />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default ListMarketingMaterial;
