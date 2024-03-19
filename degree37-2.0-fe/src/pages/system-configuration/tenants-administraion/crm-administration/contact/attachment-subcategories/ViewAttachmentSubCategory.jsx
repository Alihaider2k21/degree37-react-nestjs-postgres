import React from 'react';
import Layout from '../../../../../../components/common/layout';
import { useParams } from 'react-router-dom';
import { fetchData } from '../../../../../../helpers/Api';
import ViewForm from '../../../../../../components/common/ViewForm';
import { ContactBreadCrumbsData } from '../../../../../../components/system-configuration/tenants-administration/crm-administration/contact/ContactBreadCrumbsData';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import NotFoundPage from '../../../../../not-found/NotFoundPage';

export default function ViewAttachmentCategory() {
  const params = useParams();
  const [category, setCategory] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(true);

  const BreadcrumbsData = [
    ...ContactBreadCrumbsData,
    {
      label: 'View Attachment Subcategories',
      class: 'active-label',
      link: `/system-configuration/tenant-admin/crm-admin/contacts/attachment-subcategories/${category.id}/view`,
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
    fetchData(`/contacts/attachment-subcategory/${params?.id}`, 'GET')
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
    Permissions.CRM_ADMINISTRATION.CONTACTS.ATTACHMENTS_SUBCATEGORY.READ,
  ]);
  if (hasPermission) {
    return (
      <Layout className="mainContent">
        <ViewForm
          breadcrumbsData={BreadcrumbsData}
          breadcrumbsTitle={'Attachment Subcategories'}
          editLink={
            CheckPermission([
              Permissions.CRM_ADMINISTRATION.CONTACTS.ATTACHMENTS_SUBCATEGORY
                .WRITE,
            ]) &&
            `/system-configuration/tenant-admin/crm-admin/contacts/attachment-subcategories/${category.id}/edit`
          }
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
