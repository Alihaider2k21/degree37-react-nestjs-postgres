import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../../../../../../components/common/layout/index';
import BannerView from '../../../../../../components/system-configuration/tenants-administration/operations-administration/calendar/banners/BannerView';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

const ViewBanner = () => {
  const { id } = useParams();
  const hasPermission = CheckPermission([
    Permissions.OPERATIONS_ADMINISTRATION.CALENDAR.BANNER.READ,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <BannerView bannerId={id} />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default ViewBanner;
