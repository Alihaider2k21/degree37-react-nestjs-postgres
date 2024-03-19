import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { fetchData } from '../../../../../../helpers/Api';
import ViewForm from '../../../../../common/ViewForm';
import { ContactBreadCrumbsData } from '../ContactBreadCrumbsData';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';

const ViewContactsNoteCategory = () => {
  const { id } = useParams();
  const [noteCategoryData, setNoteCategoryData] = useState({});
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getData = async (id) => {
      try {
        setIsLoading(true);
        if (id) {
          const result = await fetchData(`/contacts/note-category/${id}`);
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
    ...ContactBreadCrumbsData,
    {
      label: 'View Note Category',
      class: 'disable-label',
      link: `/system-configuration/tenant-admin/crm-admin/contacts/note-categories/view/${id}`,
    },
  ];

  const config = [
    {
      section: 'Note Category Details',
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
      isLoading={isLoading}
      breadcrumbsData={BreadcrumbsData}
      breadcrumbsTitle={'Note Categories'}
      editLink={
        CheckPermission([
          Permissions.CRM_ADMINISTRATION.CONTACTS.NOTES_CATEGORY.WRITE,
        ]) &&
        `/system-configuration/tenant-admin/crm-admin/contacts/note-categories/edit/${id}`
      }
      data={noteCategoryData}
      config={config}
    />
  );
};

export default ViewContactsNoteCategory;
