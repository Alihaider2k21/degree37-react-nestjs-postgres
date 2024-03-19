import React from 'react';
import Layout from '../../../../../../components/common/layout';
import { useParams } from 'react-router-dom';
import { fetchData } from '../../../../../../helpers/Api';
import ViewForm from '../../../../../../components/common/ViewForm';
import { AccountBreadCrumbsData } from '../../../../../../components/system-configuration/tenants-administration/crm-administration/account/AccountBreadCrumbsData';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

export default function AccountsViewAttachmentSubCategory() {
  const params = useParams();
  const [category, setCategory] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(true);
  const BreadcrumbsData = [
    ...AccountBreadCrumbsData,
    {
      label: 'View Attachment Subcategory',
      class: 'active-label',
      link: `/system-configuration/tenant-admin/crm-admin/accounts/attachment-subcategories/${category.id}/view`,
    },
  ];

  const config = [
    {
      section: 'Attachment Subcategory Details',
      fields: [
        { label: 'Name', field: 'name' },
        { label: 'Description', field: 'description' },
        { label: 'Attachment Category', field: 'parent_id.name' },
      ],
    },
    {
      section: 'Insights',
      fields: [
        {
          label: 'Status',
          field: 'is_active',
          format: (value) => (value ? 'Active' : 'Inactive'),
        },
        {
          label: 'Created By',
          field: 'created_by',
        },
        {
          label: 'Updated By',
          field: 'updated_by',
        },
      ],
    },
  ];

  React.useEffect(() => {
    setIsLoading(true);
    fetchData(`/accounts/attachment-subcategory/${params?.id}`, 'GET')
      .then((res) => {
        setCategory(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, [params]);
  const hasPermission = CheckPermission([
    Permissions.CRM_ADMINISTRATION.ACCOUNTS.ATTACHMENTS_SUBCATEGORY.READ,
  ]);
  if (hasPermission) {
    return (
      <Layout className="mainContent">
        <ViewForm
          breadcrumbsData={BreadcrumbsData}
          breadcrumbsTitle={'Attachment Subcategories'}
          editLink={`/system-configuration/tenant-admin/crm-admin/accounts/attachment-subcategories/${category.id}/edit`}
          data={category}
          isLoading={isLoading}
          config={config}
        />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
}
