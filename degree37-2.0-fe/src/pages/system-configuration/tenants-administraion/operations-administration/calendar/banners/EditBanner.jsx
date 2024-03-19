import React from 'react';
import Layout from '../../../../../../components/common/layout/index';
import BannerUpsert from '../../../../../../components/system-configuration/tenants-administration/operations-administration/calendar/banners/BannerUpsert';
import { useParams } from 'react-router-dom';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

const EditBanner = () => {
  const { id } = useParams();
  const hasPermission = CheckPermission([
    Permissions.OPERATIONS_ADMINISTRATION.CALENDAR.BANNER.WRITE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <BannerUpsert bannerId={id} />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default EditBanner;
