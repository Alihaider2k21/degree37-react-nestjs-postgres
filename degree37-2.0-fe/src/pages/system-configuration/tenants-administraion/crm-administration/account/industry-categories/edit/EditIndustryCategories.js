import React from 'react';
import IndustryCategoriesEdit from '../../../../../../../components/system-configuration/tenants-administration/crm-administration/account/industry-categories/EditIndustryCategories';
import Layout from '../../../../../../../components/common/layout/index';
import CheckPermission from '../../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../../not-found/NotFoundPage';

const EditIndustryCategories = () => {
  const hasPermission = CheckPermission([
    Permissions.CRM_ADMINISTRATION.ACCOUNTS.INDUSTRY_CATEGORY.WRITE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <IndustryCategoriesEdit />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default EditIndustryCategories;
