import React from 'react';
import Layout from '../../../../../../../components/common/layout';
import NceCategory from '../../../../../../../components/system-configuration/tenants-administration/operations-administration/non-collection-events/nce-category/NceCategory';
import CheckPermission from '../../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../../not-found/NotFoundPage';

function ViewNceCategory() {
  return CheckPermission([
    Permissions.OPERATIONS_ADMINISTRATION.NON_COLLECTION_EVENTS.NCE_CATEGORY
      .WRITE,
  ]) ? (
    <Layout>
      <NceCategory />
    </Layout>
  ) : (
    <NotFoundPage />
  );
}

export default ViewNceCategory;
