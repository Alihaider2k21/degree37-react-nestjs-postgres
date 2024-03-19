import React from 'react';
import Layout from '../../../../../components/common/layout';
import AddEditForm from '../../../../../components/system-configuration/tenants-administration/staffing-administration/staff-setup/addEditForm';
import CheckPermission from '../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../not-found/NotFoundPage';

const CreateUpdateStaffSetup = () => {
  return CheckPermission([
    Permissions.STAFF_ADMINISTRATION.STAFF_SETUPS.WRITE,
  ]) ? (
    <Layout>
      <AddEditForm />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default CreateUpdateStaffSetup;
