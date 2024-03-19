import React from 'react';
import Layout from '../../../../../../components/common/layout';
import ListSettings from '../../../../../../components/system-configuration/tenants-administration/staffing-administration/classifications/settings/ListSettings';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

const ListSetting = () => {
  return CheckPermission(null, [
    Permissions.STAFF_ADMINISTRATION.CLASSIFICATIONS.SETTINGS.MODULE_CODE,
  ]) ? (
    <Layout>
      <ListSettings />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};
export default ListSetting;
