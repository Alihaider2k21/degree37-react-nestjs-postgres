import React from 'react';
import AddIndustrySubCategories from '../../../../../../../components/system-configuration/tenants-administration/crm-administration/account/industry-subcategories/AddIndustrySubCategories';
import Layout from '../../../../../../../components/common/layout/index';
import CheckPermission from '../../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../../not-found/NotFoundPage';

const CreateIndustrySubCategories = () => {
  const hasPermission = CheckPermission([
    Permissions.CRM_ADMINISTRATION.ACCOUNTS.INDUSTRY_SUBCATEGORY.WRITE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <AddIndustrySubCategories />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default CreateIndustrySubCategories;
