import React from 'react';
import Layout from '../../../../../../../components/common/layout';
import NceSubCategoryEdit from '../../../../../../../components/system-configuration/tenants-administration/operations-administration/non-collection-events/nce-subcategory/NceSubCategoryEdit';
import CheckPermission from '../../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../../not-found/NotFoundPage';

const EditNceSubCategory = () => {
  return CheckPermission([
    Permissions.OPERATIONS_ADMINISTRATION.NON_COLLECTION_EVENTS.NCE_SUBCATEGORY
      .WRITE,
  ]) ? (
    <Layout>
      <NceSubCategoryEdit />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default EditNceSubCategory;
