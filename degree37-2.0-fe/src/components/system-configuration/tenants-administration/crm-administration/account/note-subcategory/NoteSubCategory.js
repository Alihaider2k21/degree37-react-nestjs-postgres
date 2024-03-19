import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { fetchData } from '../../../../../../helpers/Api';
import ViewForm from '../../../../../common/ViewForm';
import { AccountBreadCrumbsData } from '../AccountBreadCrumbsData';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';

const NoteSubCategory = () => {
  const { id } = useParams();
  const [noteSubCategoryData, setNoteSubCategoryData] = useState({});
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const getData = async (id) => {
      try {
        if (id) {
          const result = await fetchData(`/accounts/note-subcategory/${id}`);
          let { data, status_code, status } = result;
          if (
            (status === 'success' || status_code === 200) &
            (status_code === 200)
          ) {
            setNoteSubCategoryData(data);
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
    ...AccountBreadCrumbsData,
    {
      label: 'View Note Subcategory',
      class: 'active-label',
      link: `/system-configuration/tenant-admin/crm-admin/accounts/note-subcategories/${id}`,
    },
  ];

  const config = [
    {
      section: 'Note Subcategory Details',
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
          label: 'Created',
          field: 'created_by',
        },
        {
          label: 'Modified',
          field: 'modified_by',
        },
      ],
    },
  ];

  return (
    <ViewForm
      breadcrumbsData={BreadcrumbsData}
      breadcrumbsTitle={'Note Subcategories'}
      editLink={
        CheckPermission([
          Permissions.CRM_ADMINISTRATION.ACCOUNTS.NOTES_SUBCATEGORY.WRITE,
        ]) &&
        `/system-configuration/tenant-admin/crm-admin/accounts/note-subcategories/${id}/edit`
      }
      data={noteSubCategoryData}
      config={config}
      isLoading={isLoading}
    />
  );
};

export default NoteSubCategory;
