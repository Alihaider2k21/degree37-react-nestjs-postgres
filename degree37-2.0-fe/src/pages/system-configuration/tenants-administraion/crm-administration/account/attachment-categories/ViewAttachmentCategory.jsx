import React from 'react';
import Layout from '../../../../../../components/common/layout';
import { useParams } from 'react-router-dom';
import { fetchData } from '../../../../../../helpers/Api';
import ViewForm from '../../../../../../components/common/ViewForm';
import { AccountBreadCrumbsData } from '../../../../../../components/system-configuration/tenants-administration/crm-administration/account/AccountBreadCrumbsData';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

export default function AccountsViewAttachmentCategory() {
  const params = useParams();
  const [category, setCategory] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(true);

  const BreadcrumbsData = [
    ...AccountBreadCrumbsData,

    {
      label: 'View Attachment Categories',
      class: 'active-label',
      link: `/system-configuration/tenant-admin/crm-admin/accounts/attachment-categories/${category.id}/view`,
    },
  ];

  React.useEffect(() => {
    setIsLoading(true);
    fetchData(`/accounts/attachment-category/${params?.id}`, 'GET')
      .then((res) => {
        setCategory(res?.data);
        console.log(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, [params]);

  const config = [
    {
      section: 'Attachment Category Details',
      fields: [
        { label: 'Name', field: 'name' },
        { label: 'Description', field: 'description' },
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
  const hasPermission = CheckPermission([
    Permissions.CRM_ADMINISTRATION.ACCOUNTS.ATTACHMENTS_CATEGORY.READ,
  ]);
  if (hasPermission) {
    return (
      <Layout className="mainContent">
        <ViewForm
          breadcrumbsData={BreadcrumbsData}
          breadcrumbsTitle={'Attachment Categories'}
          editLink={
            CheckPermission([
              Permissions.CRM_ADMINISTRATION.ACCOUNTS.ATTACHMENTS_CATEGORY
                .WRITE,
            ]) &&
            `/system-configuration/tenant-admin/crm-admin/accounts/attachment-categories/${category.id}/edit`
          }
          isLoading={isLoading}
          data={category}
          config={config}
        />
      </Layout>
    );
  } else {
    return <NotFoundPage />;
  }
}
