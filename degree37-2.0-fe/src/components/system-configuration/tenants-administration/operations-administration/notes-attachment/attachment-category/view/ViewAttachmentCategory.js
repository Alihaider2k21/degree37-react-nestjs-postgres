import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { fetchData } from '../../../../../../../helpers/Api';
import ViewForm from '../../../../../../common/ViewForm';
import { NotesAttachmentBreadCrumbsData } from '../../NotesAttachmentBreadCrumbsData';
import CheckPermission from '../../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../../enums/PermissionsEnum';

const ViewAttachmentCategory = () => {
  const { id } = useParams();
  const [categoryData, setCategoryData] = useState({});
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getData = async (id) => {
      try {
        setIsLoading(true);
        if (id) {
          const result = await fetchData(
            `/notes-attachments/attachment-categories/${id}`
          );
          let { data, status, status_code } = result;
          if ((status === 'success') & (status_code === 200)) {
            setCategoryData(data);
          } else {
            toast.error('Error Fetching Attachment Category Details', {
              autoClose: 3000,
            });
          }
        } else {
          toast.error('Error getting Attachment Category Details', {
            autoClose: 3000,
          });
        }
      } catch (error) {
        toast.error('Error getting Attachment Category Details', {
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
    ...NotesAttachmentBreadCrumbsData,
    {
      label: 'View Attachment Category',
      class: 'active-label',
      link: `/system-configuration/tenant-admin/operations-admin/notes-attachments/attachment-categories/${id}/view`,
    },
  ];

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
          Permissions.OPERATIONS_ADMINISTRATION.NOTES_AND_ATTACHMENTS
            .ATTACHMENTS_CATEGORY.WRITE,
        ]) &&
        `/system-configuration/tenant-admin/operations-admin/notes-attachments/attachment-categories/${id}/edit`
      }
      data={categoryData}
      config={config}
      isLoading={isLoading}
    />
  );
};

export default ViewAttachmentCategory;
