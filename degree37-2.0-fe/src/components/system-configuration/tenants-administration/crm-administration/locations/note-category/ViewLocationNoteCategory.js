import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { fetchData } from '../../../../../../helpers/Api';
import ViewForm from '../../../../../common/ViewForm';
import { LocationBreadCrumbsData } from '../LocationBreadCrumbsData';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';

let crmAdminType = 'locations';
// let crmAdminTypeLabel = 'Location';
let categoryTypeLabel = 'Note';
let categoryType = 'note';
// let navigateToMainPageLink = `/system-configuration/tenant-admin/crm-admin/${crmAdminType}/${categoryType}-categories`;

const ViewLocationNoteCategory = () => {
  const { id } = useParams();
  const [noteCategoryData, setNoteCategoryData] = useState({});
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [isLoading, setIsLoading] = useState(true);
  let editLink = `/system-configuration/tenant-admin/crm-admin/${crmAdminType}/${categoryType}-categories/edit/${id}/`;
  let viewLink = `/system-configuration/tenant-admin/crm-admin/${crmAdminType}/${categoryType}-categories/view/${id}`;

  useEffect(() => {
    const getData = async (id) => {
      try {
        setIsLoading(true);
        if (id) {
          const result = await fetchData(
            `/${crmAdminType}/${categoryType}-category/${id}`
          );
          let { data, status, status_code } = result;

          if ((status === 'success') & (status_code === 200)) {
            setNoteCategoryData(data);
          } else {
            toast.error('Error Fetching Note Category Details', {
              autoClose: 3000,
            });
          }
        } else {
          toast.error('Error getting Note Category Details', {
            autoClose: 3000,
          });
        }
      } catch (error) {
        console.log(error);
        toast.error('Error getting Note Category Details', { autoClose: 3000 });
      } finally {
        setIsLoading(false);
      }
    };
    if (id) {
      getData(id);
    }
  }, [id, BASE_URL]);

  const BreadcrumbsData = [
    ...LocationBreadCrumbsData,
    {
      label: `View ${categoryTypeLabel} Category`,
      class: 'disable-label',
      link: viewLink,
    },
  ];

  const config = [
    {
      section: `${categoryTypeLabel} Category Details`,
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
          field: 'status',
          format: (value) => (value ? 'Active' : 'Inactive'),
        },
        {
          label: 'Created By',
          field: 'created_by',
        },
        {
          label: 'Modified',
          field: 'updated_by',
        },
      ],
    },
  ];

  return (
    <ViewForm
      breadcrumbsData={BreadcrumbsData}
      breadcrumbsTitle={`${categoryTypeLabel} Categories`}
      editLink={
        CheckPermission([
          Permissions.CRM_ADMINISTRATION.LOCATIONS.NOTES_CATEGORY.WRITE,
        ]) && editLink
      }
      data={noteCategoryData}
      config={config}
      isLoading={isLoading}
    />
  );
};

export default ViewLocationNoteCategory;
