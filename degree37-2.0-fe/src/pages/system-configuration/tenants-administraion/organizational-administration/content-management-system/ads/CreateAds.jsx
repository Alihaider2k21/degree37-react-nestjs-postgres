import React from 'react';
import AdsCreate from '../../../../../../components/system-configuration/tenants-administration/organizational-administration/content-management-system/ads/AdsCreate';
import Layout from '../../../../../../components/common/layout';
import NotFoundPage from '../../../../../not-found/NotFoundPage.jsx';
import CheckPermission from '../../../../../../helpers/CheckPermissions.js';
import Permissions from '../../../../../../enums/PermissionsEnum.js';

const CreateAds = () => {
  return CheckPermission([
    Permissions.ORGANIZATIONAL_ADMINISTRATION.CONTENT_MANAGEMENT_SYSTEM.ADS
      .WRITE,
  ]) ? (
    <Layout>
      <AdsCreate />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default CreateAds;
