import React from 'react';
import ListAllIndustryCategories from '../../../../../../components/system-configuration/tenants-administration/crm-administration/account/industry-categories/ListAllIndustryCategories';

import Layout from '../../../../../../components/common/layout/index';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

const ListIndustryCategories = () => {
  const hasPermission = CheckPermission(null, [
    Permissions.CRM_ADMINISTRATION.ACCOUNTS.INDUSTRY_CATEGORY.MODULE_CODE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <ListAllIndustryCategories />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default ListIndustryCategories;
