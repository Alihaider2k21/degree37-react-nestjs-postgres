import React from 'react';
import Layout from '../../../../../../components/common/layout';
import ListNceCategory from '../../../../../../components/system-configuration/tenants-administration/operations-administration/non-collection-events/nce-category/ListNceCategory';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

const NceCategoryList = () => {
  return CheckPermission(null, [
    Permissions.OPERATIONS_ADMINISTRATION.NON_COLLECTION_EVENTS.NCE_CATEGORY
      .MODULE_CODE,
  ]) ? (
    <Layout>
      <ListNceCategory />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default NceCategoryList;
