import React from 'react';
import { useParams } from 'react-router-dom';
import { fetchData } from '../../../../../../helpers/Api';
import ViewForm from '../../../../../common/ViewForm/index';
import { LocationBreadCrumbsData } from '../LocationBreadCrumbsData';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';

const LocationsAttachmentSubCategoryView = () => {
  const params = useParams();
  const [category, setCategory] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(true);

  const BreadcrumbsData = [
    ...LocationBreadCrumbsData,
    {
      label: 'View Attachment Subcategories',
      class: 'active-label',
      link: `/system-configuration/tenant-admin/crm-admin/locations/attachment-subcategories/${params?.id}/view`,
    },
  ];

  React.useEffect(() => {
    setIsLoading(true);
    fetchData(`/locations/attachment-subcategory/${params?.id}`, 'GET')
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
      section: 'Attachment Subcategory Details',
      fields: [
        { label: 'Name', field: 'name' },
        { label: 'Description', field: 'description' },
        { label: 'Note Category', field: 'parent_id.name' },
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
      breadcrumbsTitle={'Attachment Subcategories'}
      editLink={
        CheckPermission([
          Permissions.CRM_ADMINISTRATION.LOCATIONS.ATTACHMENTS_SUBCATEGORY
            .WRITE,
        ]) &&
        `/system-configuration/tenant-admin/crm-admin/locations/attachment-subcategories/${params?.id}/edit`
      }
      data={category}
      config={config}
      isLoading={isLoading}
    />
  );
};

export default LocationsAttachmentSubCategoryView;
