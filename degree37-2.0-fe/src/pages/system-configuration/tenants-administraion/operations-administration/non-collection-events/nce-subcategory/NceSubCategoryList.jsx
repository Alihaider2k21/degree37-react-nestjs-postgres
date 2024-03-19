import React from 'react';
import Layout from '../../../../../../components/common/layout';
import ListNceSubCategory from '../../../../../../components/system-configuration/tenants-administration/operations-administration/non-collection-events/nce-subcategory/ListNceSubCategory';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

const NceSubCategoryList = () => {
  return CheckPermission(null, [
    Permissions.OPERATIONS_ADMINISTRATION.NON_COLLECTION_EVENTS.NCE_SUBCATEGORY
      .MODULE_CODE,
  ]) ? (
    <Layout>
      <ListNceSubCategory />
    </Layout>
  ) : (
    <NotFoundPage />
  );
};

export default NceSubCategoryList;
