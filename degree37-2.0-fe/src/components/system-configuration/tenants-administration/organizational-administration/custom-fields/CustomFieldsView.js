import React, { useEffect, useState } from 'react';
import ViewForm from '../../../../common/ViewForm';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { fetchData } from '../../../../../helpers/Api';
import { CustomFieldsBreadCrumbsData } from './CustomFieldsBreadCrumbsData';

export default function CustomFieldsView() {
  const { id } = useParams();
  const [customFieldData, setCustomFieldData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const appliesToOption = [
    {
      label: 'Accounts',
      value: '1',
    },
    {
      label: 'Locations',
      value: '5',
    },
    {
      label: 'Donor Centers',
      value: '2',
    },
    {
      label: 'Donors',
      value: '3',
    },
    {
      label: 'Staff',
      value: '8',
    },
    {
      label: 'Volunteers',
      value: '9',
    },
    {
      label: 'Drives',
      value: '4',
    },
    {
      label: 'Sessions',
      value: '7',
    },
    {
      label: 'NCEs',
      value: '6',
    },
  ];

  const fieldDataTypeOption = [
    {
      label: 'Text',
      value: '5',
    },
    {
      label: 'Number',
      value: '3',
    },
    {
      label: 'Decimal',
      value: '2',
    },
    {
      label: 'Date',
      value: '1',
    },
    {
      label: 'Yes or No',
      value: '8',
    },
    {
      label: 'True or false',
      value: '7',
    },
    {
      label: 'Text Array',
      value: '6',
    },
    {
      label: 'Pick List',
      value: '4',
    },
  ];

  useEffect(() => {
    const getData = async (id) => {
      try {
        setIsLoading(true);
        if (id) {
          const result = await fetchData(
            `/system-configuration/organization-administration/custom-fields/${id}`
          );
          let { data, status_code, status } = result;
          if (
            (status === 'success' || status_code === 200) &
            (status_code === 200)
          ) {
            const modifiedData = {
              ...data,
              field_data_type: fieldDataTypeOption?.find(
                (option) => option?.value === data?.field_data_type
              )?.label,
              applies_to: appliesToOption?.find(
                (option) => option?.value === data?.applies_to
              )?.label,
              ...(data?.pick_list && {
                ...Object.fromEntries(
                  data?.pick_list?.map((item, index) => [
                    `type_name${index}`,
                    item?.type_name,
                  ])
                ),
              }),
              ...(data?.pick_list && {
                ...Object.fromEntries(
                  data?.pick_list?.map((item, index) => [
                    `type_value${index}`,
                    item?.type_value || '',
                  ])
                ),
              }),
              type_value: '  ',
              is_required: data?.is_required ? 'Yes' : 'No',
            };

            setCustomFieldData(modifiedData);
          } else {
            toast.error('Error getting Custom Field Details', {
              autoClose: 3000,
            });
          }
        }
      } catch (error) {
        console.log(error);
        toast.error('Error getting Custom Field Details', {
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
    ...CustomFieldsBreadCrumbsData,
    {
      label: 'Custom Fields',
      class: 'disable-label',
      link: `/system-configuration/tenant-admin/organizational-admin/custom-fields/list`,
    },
    {
      label: 'View Custom Field',
      class: 'active-label',
      link: `/system-configuration/tenant-admin/organizational-admin/custom-fields/${id}/view`,
    },
  ];
  const customFieldDetailsFields = [
    { label: 'Field Name', field: 'field_name' },
    { label: 'Field Data Type', field: 'field_data_type' },
    { label: 'Applies To', field: 'applies_to' },
    { label: 'Required', field: 'is_required' },
  ];

  // Conditionally add the 'Name' field
  if (customFieldData?.pick_list?.length > 0) {
    customFieldDetailsFields.push({
      label: 'Pick List Items',
      field: `type_value`,
    });
    for (let i = 0; i < customFieldData?.pick_list?.length; i++) {
      const item = customFieldData.pick_list[i];
      customFieldDetailsFields.push({
        label: item.type_name,
        field: `type_value${i}`,
      });
    }
  }
  const config = [
    {
      section: 'Custom Field Details',
      fields: [...customFieldDetailsFields],
    },
    {
      section: 'Insights',
      fields: [
        {
          label: 'Status',
          field: 'is_active',
          format: (value) => {
            return value;
          },
        },
        {
          label: 'Created by',
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
      breadcrumbsTitle={'Custom Fields'}
      editLink={`/system-configuration/tenant-admin/organizational-admin/custom-fields/${id}/edit`}
      data={customFieldData}
      config={config}
      isLoading={isLoading}
    />
  );
}
