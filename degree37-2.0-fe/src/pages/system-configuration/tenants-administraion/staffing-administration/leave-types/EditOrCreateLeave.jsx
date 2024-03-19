import React from 'react';

import Layout from '../../../../../components/common/layout';
import AddOrEditLeave from '../../../../../components/system-configuration/tenants-administration/staffing-administration/leave-types/AddOrEditLeave.js';
import CheckPermission from '../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../not-found/NotFoundPage';

const EditOrCreateLeave = () => {
  return CheckPermission([
    Permissions.STAFF_ADMINISTRATION.LEAVE_TYPES.WRITE,
  ]) ? (
    <Layout>
      <AddOrEditLeave />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default EditOrCreateLeave;
