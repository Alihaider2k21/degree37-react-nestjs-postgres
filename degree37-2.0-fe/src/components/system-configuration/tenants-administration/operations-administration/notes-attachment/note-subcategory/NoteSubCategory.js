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
// let navigateToMainPageLink = `/system-configuration/tenant-admin/operations-admin/${crmAdminType}/note-subcategories/list`;

const NoteSubCategory = () => {
  const { id } = useParams();
  const [subCategoryData, setSubCategoryData] = useState({});
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  let editLink = `/system-configuration/tenant-admin/operations-admin/${crmAdminType}/note-subcategories/${id}/edit`;
  let viewLink = `/system-configuration/tenant-admin/operations-admin/${crmAdminType}/note-subcategories/${id}`;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getData = async (id) => {
      try {
        setIsLoading(true);
        if (id) {
          const result = await fetchData(
            `/note-attachment/note-subcategory/${id}`
          );
          let { data, status, status_code } = result;

          if ((status === 'success') & (status_code === 200)) {
            setSubCategoryData(data);
          } else {
            toast.error('Error Fetching Note Subcategory Details', {
              autoClose: 3000,
            });
          }
        } else {
          toast.error('Error getting Note Subcategory Details', {
            autoClose: 3000,
          });
        }
      } catch (error) {
        console.log(error);
        toast.error('Error getting Note Subcategory Details', {
          autoClose: 3000,
        });
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
      label: `View ${categoryTypeLabel} Subcategory`,
      class: 'disable-label',
      link: viewLink,
    },
  ];

  const config = [
    {
      section: `${categoryTypeLabel} Subcategory Details`,
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
      breadcrumbsTitle={`${categoryTypeLabel} Subcategories`}
      editLink={
        CheckPermission([
          Permissions.OPERATIONS_ADMINISTRATION.NOTES_AND_ATTACHMENTS
            .NOTES_SUBCATEGORY.WRITE,
        ]) && editLink
      }
      data={subCategoryData}
      config={config}
      isLoading={isLoading}
    />
  );
};

export default NoteSubCategory;
