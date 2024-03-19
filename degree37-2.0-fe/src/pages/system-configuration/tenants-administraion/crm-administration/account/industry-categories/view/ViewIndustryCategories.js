import React from 'react';
import IndustryCategoriesView from '../../../../../../../components/system-configuration/tenants-administration/crm-administration/account/industry-categories/ViewIndustryCategories';
import Layout from '../../../../../../../components/common/layout/index';
import NotFoundPage from '../../../../../../not-found/NotFoundPage';
import CheckPermission from '../../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../../enums/PermissionsEnum';

const ViewIndustryCategories = () => {
  const hasPermission = CheckPermission([
    Permissions.CRM_ADMINISTRATION.ACCOUNTS.INDUSTRY_CATEGORY.READ,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <IndustryCategoriesView />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default ViewIndustryCategories;
