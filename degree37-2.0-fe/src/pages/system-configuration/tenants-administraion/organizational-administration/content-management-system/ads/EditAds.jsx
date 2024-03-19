import React from 'react';
import AdsEdit from '../../../../../../components/system-configuration/tenants-administration/organizational-administration/content-management-system/ads/AdsEdit';
import Layout from '../../../../../../components/common/layout';
import NotFoundPage from '../../../../../not-found/NotFoundPage.jsx';
import CheckPermission from '../../../../../../helpers/CheckPermissions.js';
import Permissions from '../../../../../../enums/PermissionsEnum.js';

const EditAds = () => {
  return CheckPermission([
    Permissions.ORGANIZATIONAL_ADMINISTRATION.CONTENT_MANAGEMENT_SYSTEM.ADS
      .WRITE,
  ]) ? (
    <Layout>
      <AdsEdit />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default EditAds;
