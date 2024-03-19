import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import ViewForm from '../../../../../common/ViewForm';
import { AccountBreadCrumbsData } from '../AccountBreadCrumbsData';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';

const ViewIndustryCategories = () => {
  const { id } = useParams();
  const [industryCategories, setIndustryCategories] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    const getData = async (id) => {
      try {
        setIsLoading(true);
        if (id) {
          const result = await fetch(
            `${BASE_URL}/accounts/industry_categories/${id}`,
            {
              headers: {
                authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            }
          );
          let { data, status } = await result.json();
          if ((result.ok || result.status === 200) & (status === 200)) {
            setIndustryCategories({
              ...data,
              status: data?.is_active || false,
            });
          } else {
            toast.error('Error Fetching Industry Category Details', {
              autoClose: 3000,
            });
          }
        } else {
          toast.error('Error getting Industry Category Details', {
            autoClose: 3000,
          });
        }
      } catch (error) {
        toast.error('Error getting Industry Category Details', {
          autoClose: 3000,
        });
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) {
      getData(id);
    }
  }, [id, BASE_URL]);

  const BreadcrumbsData = [
    ...AccountBreadCrumbsData,
    {
      label: 'Industry Categories',
      class: 'disable-label',
      link: '/system-configuration/tenant-admin/crm-admin/accounts/industry-categories',
    },

    {
      label: 'View Industry Category',
      class: 'active-label',
      link: `/system-configuration/tenant-admin/crm-admin/accounts/industry-categories/${id}/view`,
    },
  ];

  const config = [
    {
      section: 'Industry Category Details',
      fields: [
        { label: 'Name', field: 'name' },
        { label: 'Description', field: 'description' },
        { label: 'Minimum OEF', field: 'minimum_oef' },
        { label: 'Maximum OEF', field: 'maximum_oef' },
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
          label: 'Updated By',
          field: 'updated_by',
        },
      ],
    },
  ];

  return (
    <ViewForm
      breadcrumbsData={BreadcrumbsData}
      isLoading={isLoading}
      breadcrumbsTitle={'Industry Categories'}
      editLink={
        CheckPermission([
          Permissions.CRM_ADMINISTRATION.ACCOUNTS.INDUSTRY_CATEGORY.WRITE,
        ]) &&
        `/system-configuration/tenant-admin/crm-admin/accounts/industry-categories/${id}/edit`
      }
      data={industryCategories}
      config={config}
    />
  );
};

export default ViewIndustryCategories;
