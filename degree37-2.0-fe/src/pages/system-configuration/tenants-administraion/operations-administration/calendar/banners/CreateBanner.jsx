import React from 'react';
import BannerUpsert from '../../../../../../components/system-configuration/tenants-administration/operations-administration/calendar/banners/BannerUpsert';
import Layout from '../../../../../../components/common/layout/index';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

const CreateBanner = () => {
  const hasPermission = CheckPermission([
    Permissions.OPERATIONS_ADMINISTRATION.CALENDAR.BANNER.WRITE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <BannerUpsert />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default CreateBanner;
