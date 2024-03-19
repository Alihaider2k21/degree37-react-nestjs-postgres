import React from 'react';
import Layout from '../../../../../../components/common/layout';
import AddClassification from '../../../../../../components/system-configuration/tenants-administration/staffing-administration/classifications/AddClassification';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

const CreateClassification = () => {
  return CheckPermission([
    Permissions.STAFF_ADMINISTRATION.CLASSIFICATIONS.CLASSIFICATIONS.WRITE,
  ]) ? (
    <Layout>
      <AddClassification />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default CreateClassification;
