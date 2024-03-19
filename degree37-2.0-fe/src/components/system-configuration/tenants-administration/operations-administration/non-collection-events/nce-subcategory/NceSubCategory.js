import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { fetchData } from '../../../../../../helpers/Api';
import ViewForm from '../../../../../common/ViewForm';
import { NonCollectionEventsBreadCrumbsData } from '../NonCollectionEventsBreadCrumbsData';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';

let crmAdminType = 'nce-subcategories';
// let crmAdminTypeLabel = 'Non Collection Events';
let categoryTypeLabel = 'NCE';
// let navigateToMainPageLink = `/system-configuration/tenant-admin/operations-admin/${crmAdminType}/list`;

const NceSubCategory = () => {
  const { id } = useParams();
  const [noteCategoryData, setNoteCategoryData] = useState({});
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  let editLink = `/system-configuration/tenant-admin/operations-admin/${crmAdminType}/${id}/edit`;
  let viewLink = `/system-configuration/tenant-admin/operations-admin/${crmAdminType}/${id}`;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getData = async (id) => {
      try {
        setIsLoading(true);
        if (id) {
          const result = await fetchData(`/nce-subcategory/${id}`);
          let { data, status, status_code } = result;

          if ((status === 'success') & (status_code === 200)) {
            setNoteCategoryData(data);
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
    ...NonCollectionEventsBreadCrumbsData,
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
          Permissions.OPERATIONS_ADMINISTRATION.NON_COLLECTION_EVENTS
            .NCE_SUBCATEGORY.WRITE,
        ]) && editLink
      }
      data={noteCategoryData}
      config={config}
      isLoading={isLoading}
    />
  );
};

export default NceSubCategory;
