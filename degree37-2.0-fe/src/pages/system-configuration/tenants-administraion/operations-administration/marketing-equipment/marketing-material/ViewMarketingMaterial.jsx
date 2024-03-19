import React from 'react';
import Layout from '../../../../../../components/common/layout';
import MarketingMaterialView from '../../../../../../components/system-configuration/tenants-administration/operations-administration/marketing-equipment/marketing-material/MarketingMaterialView';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

const ViewMarketingMaterial = () => {
  return CheckPermission([
    Permissions.OPERATIONS_ADMINISTRATION.MARKETING_EQUIPMENTS
      .MARKETING_MATERIAL.READ,
  ]) ? (
    <Layout>
      <MarketingMaterialView />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default ViewMarketingMaterial;
