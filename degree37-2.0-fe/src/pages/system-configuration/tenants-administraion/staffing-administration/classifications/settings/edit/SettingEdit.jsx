import React from 'react';
import Layout from '../../../../../../../components/common/layout';
import EditSettings from '../../../../../../../components/system-configuration/tenants-administration/staffing-administration/classifications/settings/EditSettings';
import CheckPermission from '../../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../../not-found/NotFoundPage';

const SettingEdit = () => {
  return CheckPermission([
    Permissions.STAFF_ADMINISTRATION.CLASSIFICATIONS.SETTINGS.WRITE,
  ]) ? (
    <Layout>
      <EditSettings />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default SettingEdit;
