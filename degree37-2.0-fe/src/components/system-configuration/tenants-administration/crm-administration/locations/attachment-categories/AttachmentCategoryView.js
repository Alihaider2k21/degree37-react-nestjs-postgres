import React from 'react';
import { useParams } from 'react-router-dom';
import { fetchData } from '../../../../../../helpers/Api';
import ViewForm from '../../../../../common/ViewForm';
import { LocationBreadCrumbsData } from '../LocationBreadCrumbsData';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';

const LocationsAttachmentCategoryView = () => {
  const params = useParams();
  const [category, setCategory] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(true);

  const BreadcrumbsData = [
    ...LocationBreadCrumbsData,
    {
      label: 'View Attachment Categories',
      class: 'active-label',
      link: `/system-configuration/tenant-admin/crm-admin/locations/attachment-categories/${params?.id}/view`,
    },
  ];

  React.useEffect(() => {
    setIsLoading(true);
    fetchData(`/locations/attachment-category/${params?.id}`, 'GET')
      .then((res) => {
        setCategory(res.data);
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

  return (
    <ViewForm
      breadcrumbsData={BreadcrumbsData}
      breadcrumbsTitle={'Attachment Categories'}
      editLink={
        CheckPermission([
          Permissions.CRM_ADMINISTRATION.LOCATIONS.ATTACHMENTS_CATEGORY.WRITE,
        ]) &&
        `/system-configuration/tenant-admin/crm-admin/locations/attachment-categories/${params?.id}/edit`
      }
      data={category}
      config={config}
      isLoading={isLoading}
    />
  );
};

export default LocationsAttachmentCategoryView;
