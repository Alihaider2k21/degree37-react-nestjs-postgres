import React from 'react';
import Layout from '../../../../../../../components/common/layout';
import AddNceSubCategory from '../../../../../../../components/system-configuration/tenants-administration/operations-administration/non-collection-events/nce-subcategory/AddNceSubCategory';
import CheckPermission from '../../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../../not-found/NotFoundPage';

const CreateNceSubCategory = () => {
  return CheckPermission([
    Permissions.OPERATIONS_ADMINISTRATION.NON_COLLECTION_EVENTS.NCE_SUBCATEGORY
      .WRITE,
  ]) ? (
    <Layout>
      <AddNceSubCategory />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default CreateNceSubCategory;
