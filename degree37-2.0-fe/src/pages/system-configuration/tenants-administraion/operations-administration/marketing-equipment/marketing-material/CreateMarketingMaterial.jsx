import React from 'react';
import Layout from '../../../../../../components/common/layout';
import MarketingMaterialCreate from '../../../../../../components/system-configuration/tenants-administration/operations-administration/marketing-equipment/marketing-material/MarketingMaterialCreate';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

const CreateMarketingMaterial = () => {
  return CheckPermission([
    Permissions.OPERATIONS_ADMINISTRATION.MARKETING_EQUIPMENTS
      .MARKETING_MATERIAL.WRITE,
  ]) ? (
    <Layout>
      <MarketingMaterialCreate />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default CreateMarketingMaterial;
