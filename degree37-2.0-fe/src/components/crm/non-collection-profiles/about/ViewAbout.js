import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import ViewForm from '../../../common/ViewForm';
import { fetchData } from '../../../../helpers/Api';
import TopTabsNCP from '../topTabsNCP';
import CheckPermission from '../../../../helpers/CheckPermissions';
import CrmPermissions from '../../../../enums/CrmPermissionsEnum';
import { NonCollectionProfilesBreadCrumbsData } from '../NonCollectionProfilesBreadCrumbsData';

const ViewAbout = () => {
  const location = useLocation();
  const currentLocation = location.pathname;
  const { id } = useParams();
  const [ncpData, setNcpData] = useState({});
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getData = async (id) => {
      try {
        setIsLoading(true);
        if (id) {
          const result = await fetchData(`/non-collection-profiles/${id}`);
          let { data, status, status_code } = result;
          if ((status === 'success') & (status_code === 200)) {
            const { owner_id } = data;
            owner_id.name = `${owner_id?.first_name ?? ''} ${
              owner_id?.last_name ?? ''
            }`;

            data.collection_operation_id = data.collection_operation_id
              .map((co) => co.name)
              .join(', ');
            setNcpData(data);
          } else {
            toast.error('Error Fetching Non-Collection Profile Details', {
              autoClose: 3000,
            });
          }
        } else {
          toast.error('Error getting Non-Collection Profile Details', {
            autoClose: 3000,
          });
        }
      } catch (error) {
        toast.error('Error getting Non-Collection Profile Details', {
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
    ...NonCollectionProfilesBreadCrumbsData,
    {
      label: 'View Non-Collection Profile',
      class: 'disable-label',
      link: `/crm/non-collection-profiles/${id}/about`,
    },
    {
      label: 'About',
      class: 'active-label',
      link: `/crm/non-collection-profiles/${id}/about`,
    },
  ];
  const config = [
    {
      section: 'Event Details',
      fields: [
        { label: 'Profile Name', field: 'profile_name' },
        { label: 'Alternate Name', field: 'alternate_name' },
      ],
    },
    {
      section: 'Attributes',
      fields: [
        {
          label: 'Event Category',
          field: 'event_category_id.name',
        },
        {
          label: 'Event Subcategory',
          field: 'event_subcategory_id.name',
        },
        {
          label: 'Collection Operation',
          field: 'collection_operation_id',
        },
        {
          label: 'Owner',
          value: ncpData?.owner_id?.name ?? '',
          href: `/system-configuration/tenant-admin/user-admin/users/${ncpData?.owner_id?.id}/view`,
          openInNewTab: true,
        },
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
      breadcrumbsTitle={'About'}
      crmview={true}
      isLoading={isLoading}
      customTopBar={
        <TopTabsNCP
          NCPID={id}
          editLink={
            CheckPermission([CrmPermissions.CRM.NON_COLLECTION_PROFILES.WRITE])
              ? `/crm/non-collection-profiles/${id}/edit`
              : null
          }
          editName={
            CheckPermission([CrmPermissions.CRM.NON_COLLECTION_PROFILES.WRITE])
              ? 'Edit NCP'
              : ''
          }
        />
      }
      currentLocation={currentLocation}
      data={ncpData}
      config={config}
    />
  );
};

export default ViewAbout;
