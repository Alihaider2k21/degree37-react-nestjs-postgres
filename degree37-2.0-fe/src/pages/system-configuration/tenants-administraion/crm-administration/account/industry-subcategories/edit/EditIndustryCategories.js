import React from 'react';
import IndustrySubCategoriesEdit from '../../../../../../../components/system-configuration/tenants-administration/crm-administration/account/industry-subcategories/EditIndustrySubCategories';
import Layout from '../../../../../../../components/common/layout/index';
import NotFoundPage from '../../../../../../not-found/NotFoundPage';
import CheckPermission from '../../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../../enums/PermissionsEnum';

const EditIndustrySubCategories = () => {
  const hasPermission = CheckPermission([
    Permissions.CRM_ADMINISTRATION.ACCOUNTS.INDUSTRY_SUBCATEGORY.WRITE,
  ]);
  if (hasPermission) {
    return (
      <Layout>
        <IndustrySubCategoriesEdit />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
};

export default EditIndustrySubCategories;
