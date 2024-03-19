import React from 'react';
import Layout from '../../../../../../../components/common/layout';
import NceCategoryEdit from '../../../../../../../components/system-configuration/tenants-administration/operations-administration/non-collection-events/nce-category/NceCategoryEdit';
import CheckPermission from '../../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../../not-found/NotFoundPage';

const EditNceCategory = () => {
  return CheckPermission([
    Permissions.OPERATIONS_ADMINISTRATION.NON_COLLECTION_EVENTS.NCE_CATEGORY
      .WRITE,
  ]) ? (
    <Layout>
      <NceCategoryEdit />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default EditNceCategory;
