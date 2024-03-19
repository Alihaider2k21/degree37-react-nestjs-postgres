import React from 'react';
import BannerList from '../../../../../../components/system-configuration/tenants-administration/operations-administration/calendar/banners/BannerList';
import Layout from '../../../../../../components/common/layout';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

const ListBanners = () => {
  const hasPermission = CheckPermission(null, [
    Permissions.OPERATIONS_ADMINISTRATION.CALENDAR.BANNER.MODULE_CODE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <BannerList />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default ListBanners;
