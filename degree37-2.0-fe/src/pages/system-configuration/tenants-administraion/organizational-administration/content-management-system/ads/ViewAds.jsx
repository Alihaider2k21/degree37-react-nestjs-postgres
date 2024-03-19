import React from 'react';
import AdsView from '../../../../../../components/system-configuration/tenants-administration/organizational-administration/content-management-system/ads/AdsView';
import Layout from '../../../../../../components/common/layout';
import NotFoundPage from '../../../../../not-found/NotFoundPage.jsx';
import CheckPermission from '../../../../../../helpers/CheckPermissions.js';
import Permissions from '../../../../../../enums/PermissionsEnum.js';

const ViewAds = () => {
  return CheckPermission([
    Permissions.ORGANIZATIONAL_ADMINISTRATION.CONTENT_MANAGEMENT_SYSTEM.ADS
      .READ,
  ]) ? (
    <Layout>
      <AdsView />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default ViewAds;
