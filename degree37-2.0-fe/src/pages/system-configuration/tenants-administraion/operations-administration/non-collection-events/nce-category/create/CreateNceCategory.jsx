import React from 'react';
import Layout from '../../../../../../../components/common/layout';
import AddNceCategory from '../../../../../../../components/system-configuration/tenants-administration/operations-administration/non-collection-events/nce-category/AddNceCategory';
import CheckPermission from '../../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../../not-found/NotFoundPage';

const CreateNceCategory = () => {
  return CheckPermission([
    Permissions.OPERATIONS_ADMINISTRATION.NON_COLLECTION_EVENTS.NCE_CATEGORY
      .WRITE,
  ]) ? (
    <Layout>
      <AddNceCategory />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default CreateNceCategory;
