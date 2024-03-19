import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import moment from 'moment';
import {
  CRM_DONORS_CENTERS,
  DONOR_CENTERS_TASKS_PATH,
} from '../../../../routes/path';
import ViewForm from '../../../common/ViewForm';
import { formatUser } from '../../../../helpers/formatUser';
import jwt from 'jwt-decode';
import { DonorCentersBreadCrumbsData } from '../DonorCentersBreadCrumbsData';

const DonorCentersViewTasks = () => {
  const { id, donor_center_id } = useParams();
  const [tasksData, setTasksData] = useState({});
  const [upatedTaskData, setUpdatedTaskData] = useState({});
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const accessToken = localStorage.getItem('token');
  const [isLoading, setIsLoading] = useState(true);
  const [decodeToken, setDecodeToken] = useState({});
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

    if (statusOptionItem) {
      setIsStatus({
        value: statusOptionItem.id,
        label: statusOptionItem.status,
      });
    }

    const updatedTaskData = {
      ...tasksData,
      taskable_type: 'Donor Center',
      status: statusString,
      due_date: tasksData.due_date
        ? moment(tasksData?.due_date).format('MM-DD-YYYY')
        : '',
      className: className,
      name: formatUser(tasksData.assigned_by, 1),
      assign_to: formatUser(tasksData.assigned_to, 1),
    };
    setUpdatedTaskData(updatedTaskData);
  }, [tasksData, statusOption]);
  const BreadcrumbsData = [
    ...DonorCentersBreadCrumbsData,
    {
      label: 'View Donors Center',
      class: 'active-label',
      link: CRM_DONORS_CENTERS.VIEW.replace(':id', donor_center_id),
    },
    {
      label: 'Tasks',
      class: 'active-label',
      link: DONOR_CENTERS_TASKS_PATH.LIST.replace(
        ':donor_center_id',
        donor_center_id
      ),
    },
    {
      label: 'View Task',
      class: 'active-label',
      link: DONOR_CENTERS_TASKS_PATH.VIEW.replace(
        ':donor_center_id',
        donor_center_id
      ).replace(':id', id),
    },
  ];
  const config = [
    {
      section: 'Task Details',
      fields: [
        { label: 'Associated With', field: 'taskable_type' },
        { label: 'Reference', field: 'taskable_id.name' },
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
        breadcrumbsData={BreadcrumbsData}
        breadcrumbsTitle={'Task'}
        editLink={DONOR_CENTERS_TASKS_PATH.EDIT.replace(
          ':donor_center_id',
          donor_center_id
        ).replace(':id', id)}
        isLoading={isLoading}
        fromView
        data={upatedTaskData}
        config={config}
        selectOptions={statusOption}
        isSelect={
          decodeToken
            ? +decodeToken?.id === +upatedTaskData?.assigned_to?.id
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

export default DonorCentersViewTasks;
