import React from 'react';
import AddIndustryCategories from '../../../../../../../components/system-configuration/tenants-administration/crm-administration/account/industry-categories/AddIndustryCategories';
import Layout from '../../../../../../../components/common/layout/index';
import CheckPermission from '../../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../../not-found/NotFoundPage';

const CreateIndustryCategories = () => {
  const hasPermission = CheckPermission([
    Permissions.CRM_ADMINISTRATION.ACCOUNTS.INDUSTRY_CATEGORY.WRITE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <AddIndustryCategories />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default CreateIndustryCategories;
