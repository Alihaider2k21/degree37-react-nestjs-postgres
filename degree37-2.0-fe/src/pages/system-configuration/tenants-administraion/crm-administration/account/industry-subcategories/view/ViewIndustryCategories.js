import React from 'react';
import IndustrySubCategoriesView from '../../../../../../../components/system-configuration/tenants-administration/crm-administration/account/industry-subcategories/ViewIndustrySubCategories';
import Layout from '../../../../../../../components/common/layout/index';
import CheckPermission from '../../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../../not-found/NotFoundPage';

const ViewIndustrySubCategories = () => {
  const hasPermission = CheckPermission([
    Permissions.CRM_ADMINISTRATION.ACCOUNTS.INDUSTRY_SUBCATEGORY.READ,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <IndustrySubCategoriesView />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default ViewIndustrySubCategories;
