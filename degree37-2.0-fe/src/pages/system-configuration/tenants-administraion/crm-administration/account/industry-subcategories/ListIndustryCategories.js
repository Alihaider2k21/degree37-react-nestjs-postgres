import React from 'react';
import ListAllIndustrySubCategories from '../../../../../../components/system-configuration/tenants-administration/crm-administration/account/industry-subcategories/ListAllIndustrySubCategories';

import Layout from '../../../../../../components/common/layout/index';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

const ListIndustrySubCategories = () => {
  const hasPermission = CheckPermission(null, [
    Permissions.CRM_ADMINISTRATION.ACCOUNTS.INDUSTRY_SUBCATEGORY.MODULE_CODE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <ListAllIndustrySubCategories />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default ListIndustrySubCategories;
