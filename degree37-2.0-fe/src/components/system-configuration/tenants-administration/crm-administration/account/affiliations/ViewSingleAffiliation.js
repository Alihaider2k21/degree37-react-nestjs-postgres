import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import ViewForm from '../../../../../common/ViewForm';
import { AccountBreadCrumbsData } from '../AccountBreadCrumbsData';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';

const ViewSingleAffiliation = () => {
  const { id } = useParams();
  const [affiliationData, setAffiliationData] = useState({});
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [isLoading, setIsLoading] = useState(true);
  const bearerToken = localStorage.getItem('token');

  useEffect(() => {
    const getData = async (id) => {
      try {
        setIsLoading(true);
        if (id) {
          const result = await fetch(`${BASE_URL}/affiliations/${id}`, {
            headers: {
              authorization: `Bearer ${bearerToken}`,
            },
          });
          if (result?.status === 200) {
            let data = await result.json();
            let tempData = {
              ...data,
              collection_operation: data?.collection_operation?.map(
                (collecOperation) => {
                  return {
                    id: collecOperation?.id,
                    name: collecOperation?.name,
                  };
                }
              ),
              status: data?.is_active,
            };

            setAffiliationData({ ...tempData });
          } else {
            toast.error('Error Fetching Affiliation Details', {
              autoClose: 3000,
            });
          }
        } else {
          toast.error('Error Getting Affiliation Details', { autoClose: 3000 });
        }
      } catch (error) {
        console.log(error);
        toast.error('Error Getting Affiliation Details', { autoClose: 3000 });
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
      label: 'View Affiliation',
      class: 'active-label',
      link: `/system-configuration/tenant-admin/crm-admin/accounts/affiliations:${affiliationData.id}`,
    },
  ];

  const config = [
    {
      section: 'Affiliation Details',
      fields: [
        { label: 'Name', field: 'name' },
        { label: 'Description', field: 'description' },
        { label: 'Collection Operation', field: 'collection_operation' },
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
          label: 'Created',
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
      breadcrumbsTitle={'Affiliation'}
      editLink={
        CheckPermission([
          Permissions.CRM_ADMINISTRATION.ACCOUNTS.AFFILIATION.WRITE,
        ]) &&
        `/system-configuration/tenant-admin/crm-admin/accounts/affiliations/${affiliationData.id}/edit`
      }
      data={affiliationData}
      config={config}
      isLoading={isLoading}
    />
  );
};

export default ViewSingleAffiliation;
