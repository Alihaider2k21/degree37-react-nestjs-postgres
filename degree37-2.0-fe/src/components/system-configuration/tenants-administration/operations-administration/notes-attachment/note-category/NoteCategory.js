import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { fetchData } from '../../../../../../helpers/Api';
import ViewForm from '../../../../../common/ViewForm';
import { NotesAttachmentBreadCrumbsData } from '../NotesAttachmentBreadCrumbsData';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';

let crmAdminType = 'notes-attachments';
// let crmAdminTypeLabel = 'Notes & Attachments';
let categoryTypeLabel = 'Note';
// let navigateToMainPageLink = `/system-configuration/tenant-admin/operations-admin/${crmAdminType}/note-categories/list`;

const NoteCategory = () => {
  const { id } = useParams();
  const [noteCategoryData, setNoteCategoryData] = useState({});
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [isLoading, setIsLoading] = useState(true);

  let editLink = `/system-configuration/tenant-admin/operations-admin/${crmAdminType}/${categoryTypeLabel}-categories/${id}/edit`;
  let viewLink = `/system-configuration/tenant-admin/operations-admin/${crmAdminType}/${categoryTypeLabel}-categories/${id}`;

  useEffect(() => {
    const getData = async (id) => {
      try {
        setIsLoading(true);
        if (id) {
          const result = await fetchData(
            `/note-attachment/note-category/${id}`
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
      breadcrumbsTitle={`${categoryTypeLabel} Categories`}
      editLink={
        CheckPermission([
          Permissions.OPERATIONS_ADMINISTRATION.NOTES_AND_ATTACHMENTS
            .NOTES_CATEGORY.WRITE,
        ]) && editLink
      }
      data={noteCategoryData}
      config={config}
      isLoading={isLoading}
    />
  );
};

export default NoteCategory;
