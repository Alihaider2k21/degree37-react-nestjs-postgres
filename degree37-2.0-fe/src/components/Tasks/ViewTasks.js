import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import ViewForm from '../common/ViewForm';
import moment from 'moment';
import { formatUser } from '../../helpers/formatUser';
import jwt from 'jwt-decode';

const ViewTasks = () => {
  const { id } = useParams();
  const accessToken = localStorage.getItem('token');
  const [decodeToken, setDecodeToken] = useState({});
  const [tasksData, setTasksData] = useState({});
  const [updatedTaskData, setUpdatedTaskData] = useState({});
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [isLoading, setIsLoading] = useState(true);

  const [isStatus, setIsStatus] = useState({
    value: '',
    label: '',
  });

  const statusOption = useMemo(() => {
    const statusOption = [
      {
        id: 1,
        status: 'Not Started',
        className: 'badge Grey',
      },
      {
        id: 2,
        status: 'In Process',
        className: 'badge Yellow',
      },
      {
        id: 3,
        status: 'Deferred',
        className: 'badge Blue',
      },
      {
        id: 4,
        status: 'Completed',
        className: 'badge active',
      },
      {
        id: 5,
        status: 'Cancelled',
        className: 'badge inactive',
      },
    ];
    return statusOption;
  }, []);

  const associatedWithOptions = useMemo(() => {
    const associatedWithOptions = [
      {
        label: 'Select All',
        value: null,
      },
      { label: 'Account', value: 'accounts' },
      {
        label: 'CRM Location',
        value: 'crm_locations',
      },
      { label: 'Staff', value: 'staff' },
      {
        label: 'Volunteer',
        value: 'crm_volunteer',
      },
      { label: 'Donor', value: 'donors' },
      {
        label: 'Donor Center',
        value: 'donor_centers',
      },
      {
        label: 'Non-Collection Profile',
        value: 'non_collection_profiles',
      },
      {
        label: 'Session',
        value: 'sessions',
      },
      {
        label: 'NCE',
        value: 'oc_non_collection_events',
      },
      {
        label: 'Drives',
        value: 'oc_drives',
      },
    ];
    return associatedWithOptions;
  }, []);

  useEffect(() => {
    if (accessToken) {
      setDecodeToken(jwt(accessToken));
    }
    const updateStatus = async () => {
      let body = {
        status: +isStatus?.value,
      };
      try {
        const response = await fetch(`${BASE_URL}/tasks/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(body),
        });
        let data = await response.json();
        if (data?.status === 'success') {
          console.log('success');
        } else if (response?.status === 400) {
          toast.error(`${data?.message?.[0] ?? data?.response}`, {
            autoClose: 3000,
          });
        } else {
          toast.error(`${data?.message?.[0] ?? data?.response}`, {
            autoClose: 3000,
          });
        }
      } catch (error) {
        toast.error(`${error?.message}`, { autoClose: 3000 });
      }
    };
    if (isStatus?.value) {
      updateStatus();
    }
  }, [isStatus, id, BASE_URL, accessToken]);

  useEffect(() => {
    const accessToken = localStorage.getItem('token');
    const getData = async (id) => {
      try {
        setIsLoading(true);
        if (id) {
          const result = await fetch(`${BASE_URL}/tasks/${id}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          let { data } = await result.json();
          if (result.ok || result.status === 200) {
            setTasksData(data);
          } else {
            toast.error('Error Fetching Tasks Details', {
              autoClose: 3000,
            });
          }
        } else {
          toast.error('Error Fetching Tasks Details', {
            autoClose: 3000,
          });
        }
      } catch (error) {
        console.log(error);
        toast.error('Error Fetching Tasks Details', {
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

  useEffect(() => {
    const statusOptionItem =
      statusOption.find((option) => option.id === tasksData.status) || '';
    const statusString = statusOptionItem?.status || '';
    const className = statusOptionItem?.className || '';
    const associateWithItem = associatedWithOptions?.find((option) =>
      option.value !== null ? option.value === tasksData.taskable_type : ''
    );
    if (statusOptionItem) {
      setIsStatus({
        value: statusOptionItem.id,
        label: statusOptionItem.status,
      });
    }
    let taskableName = 'N/A';
    if (tasksData?.taskable_id?.id) {
      if (tasksData?.taskable_id?.name) {
        taskableName = tasksData?.taskable_id?.name;
      }
      if (tasksData?.taskable_id?.first_name) {
        taskableName = formatUser(tasksData?.taskable_id, 1);
      }
      if (tasksData?.taskable_id?.profile_name) {
        taskableName = tasksData?.taskable_id?.profile_name;
      }
    }
    const updatedTaskData = {
      ...tasksData,
      status: statusString,
      due_date: tasksData.due_date
        ? moment(tasksData?.due_date).format('MM-DD-YYYY')
        : '',
      className: className,
      taskable_type: associateWithItem?.label
        ? associateWithItem?.label
        : 'N/A',
      taskable_id: tasksData.taskable_id?.id
        ? tasksData.taskable_id?.id
        : 'N/A',
      name: formatUser(tasksData.assigned_by, 1),
      assign_to: formatUser(tasksData.assigned_to, 1),
      taskable_name: taskableName,
    };
    if (tasksData) {
      setUpdatedTaskData(updatedTaskData);
    }
  }, [tasksData, statusOption, associatedWithOptions]);

  const BreadcrumbsData = [
    { label: 'Dashboard', class: 'disable-label', link: '/' },
    {
      label: 'Task',
      class: 'active-label',
      link: '/system-configuration/tasks',
    },
    {
      label: 'View Task',
      class: 'active-label',
      link: `/system-configuration/tasks/${id}/view`,
    },
  ];
  const config = [
    {
      section: 'Task Details',
      fields: [
        { label: 'Associated With', field: 'taskable_type' },
        { label: 'Reference', field: 'taskable_name' },
        { label: 'Assigned To', field: 'assign_to' },
        { label: 'Assigned By', field: 'name' },
        { label: 'Task Name', field: 'task_name' },
        { label: 'Description', field: 'description' },
        { label: 'Due Date', field: 'due_date' },
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
          field: 'modified_by',
        },
      ],
    },
  ];

  return (
    <div>
      <ViewForm
        isLoading={isLoading}
        breadcrumbsData={BreadcrumbsData}
        breadcrumbsTitle={'Task'}
        editLink={`/system-configuration/tasks/${id}/edit`}
        data={updatedTaskData}
        config={config}
        selectOptions={statusOption}
        isSelect={
          decodeToken
            ? +decodeToken?.id === +updatedTaskData?.assigned_to?.id
              ? true
              : false
            : false
        }
        setIsStatus={setIsStatus}
        isStatus={isStatus}
      />
    </div>
  );
};

export default ViewTasks;
