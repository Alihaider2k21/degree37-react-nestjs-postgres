import React from 'react';
import Layout from '../../../../../../../components/common/layout';
import ViewSingleSetting from '../../../../../../../components/system-configuration/tenants-administration/staffing-administration/classifications/settings/ViewSingleSetting';
import CheckPermission from '../../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../../not-found/NotFoundPage';

const ViewSetting = () => {
  return CheckPermission([
    Permissions.STAFF_ADMINISTRATION.CLASSIFICATIONS.SETTINGS.READ,
  ]) ? (
    <Layout>
      <ViewSingleSetting />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default ViewSetting;
