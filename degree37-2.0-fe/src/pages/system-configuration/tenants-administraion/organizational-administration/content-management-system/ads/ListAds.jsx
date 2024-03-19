import React from 'react';
import AdsList from '../../../../../../components/system-configuration/tenants-administration/organizational-administration/content-management-system/ads/AdsList';
import Layout from '../../../../../../components/common/layout';
import NotFoundPage from '../../../../../not-found/NotFoundPage.jsx';
import CheckPermission from '../../../../../../helpers/CheckPermissions.js';
import Permissions from '../../../../../../enums/PermissionsEnum.js';

const ListAds = () => {
  return CheckPermission(null, [
    Permissions.ORGANIZATIONAL_ADMINISTRATION.CONTENT_MANAGEMENT_SYSTEM.ADS
      .MODULE_CODE,
  ]) ? (
    <Layout>
      <AdsList />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default ListAds;
