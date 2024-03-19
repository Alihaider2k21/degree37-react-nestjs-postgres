import React from 'react';
import Layout from '../../../../../../../components/common/layout';
import AddSettings from '../../../../../../../components/system-configuration/tenants-administration/staffing-administration/classifications/settings/AddSettings';
import CheckPermission from '../../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../../not-found/NotFoundPage';

const CreateSettings = () => {
  return CheckPermission([
    Permissions.STAFF_ADMINISTRATION.CLASSIFICATIONS.SETTINGS.WRITE,
  ]) ? (
    <Layout>
      <AddSettings />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default CreateSettings;
