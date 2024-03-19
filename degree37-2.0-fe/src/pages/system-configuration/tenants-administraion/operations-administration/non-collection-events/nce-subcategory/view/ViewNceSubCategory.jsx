import React from 'react';
import Layout from '../../../../../../../components/common/layout';
import NceSubCategory from '../../../../../../../components/system-configuration/tenants-administration/operations-administration/non-collection-events/nce-subcategory/NceSubCategory';
import CheckPermission from '../../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../../not-found/NotFoundPage';

function ViewNceSubCategory() {
  return CheckPermission([
    Permissions.OPERATIONS_ADMINISTRATION.NON_COLLECTION_EVENTS.NCE_SUBCATEGORY
      .READ,
  ]) ? (
    <Layout>
      <NceSubCategory />
    </Layout>
  ) : (
    <NotFoundPage />
  );
}

export default ViewNceSubCategory;
