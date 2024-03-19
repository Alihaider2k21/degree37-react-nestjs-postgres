import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import moment from 'moment';
import jwt from 'jwt-decode';
import { formatUser } from '../../../../../helpers/formatUser';
import ViewForm from '../../../../common/ViewForm';
import {
  OPERATIONS_CENTER_NON_COLLECTION_EVENTS_TASKS,
  OPERATIONS_CENTER_NCE,
  OPERATIONS_CENTER_MANAGE_FAVORITES_PATH,
  OPERATIONS_CENTER_DRIVES_PATH,
} from '../../../../../routes/path';
// import NCENavigationTabs from '../navigationTabs';
// import LocationNotes from '../../../../../assets/images/LocationNotes.png';
import TopTabsNce from '../TopTabsNce';
import SvgComponent from '../../../../common/SvgComponent';

const NonCollectionEventsViewTasks = () => {
  const { id, taskId } = useParams();
  const [tasksData, setTasksData] = useState({});
  const [upatedTaskData, setUpdatedTaskData] = useState({});
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const accessToken = localStorage.getItem('token');
  const [decodeToken, setDecodeToken] = useState({});
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
  useEffect(() => {
    if (accessToken) {
      setDecodeToken(jwt(accessToken));
    }
    const updateStatus = async () => {
      let body = {
        status: +isStatus?.value,
      };
      try {
        const response = await fetch(`${BASE_URL}/tasks/${taskId}`, {
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
  }, [isStatus, taskId, BASE_URL, accessToken]);

  useEffect(() => {
    const accessToken = localStorage.getItem('token');
    const getData = async (taskId) => {
      try {
        setIsLoading(true);
        if (taskId) {
          const result = await fetch(`${BASE_URL}/tasks/${taskId}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          let { data, response } = await result.json();
          console.log({ data });

          if (result?.ok || result?.status === 200) {
            setTasksData(data);
            if (response === 'Task is archived.') {
              toast.error('Task is archived.', {
                autoClose: 3000,
              });
            }
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
    if (taskId) {
      getData(taskId);
    }
  }, [taskId, BASE_URL]);

  useEffect(() => {
    const statusOptionItem =
      statusOption?.find((option) => option?.id === tasksData?.status) || '';
    const statusString = statusOptionItem?.status || '';
    const className = statusOptionItem?.className || '';
    if (statusOptionItem) {
      setIsStatus({
        value: statusOptionItem?.id,
        label: statusOptionItem?.status,
      });
    }
    const updatedTaskData = {
      ...tasksData,
      status: statusString,
      taskable_type: 'Non-Collection Events',
      due_date: tasksData?.due_date
        ? moment(tasksData?.due_date).format('MM-DD-YYYY')
        : '',
      className: className,
      name: formatUser(tasksData?.assigned_by, 1),
      assign_to: formatUser(tasksData?.assigned_to, 1),
    };
    setUpdatedTaskData(updatedTaskData);
  }, [tasksData, statusOption]);

  const BreadcrumbsData = [
    {
      label: 'Operations Center',
      class: 'active-label',
      link: OPERATIONS_CENTER_MANAGE_FAVORITES_PATH.LIST,
    },
    {
      label: 'Operations',
      class: 'active-label',
      link: OPERATIONS_CENTER_DRIVES_PATH.LIST,
    },
    {
      label: 'Non-Collection Events',
      class: 'active-label',
      link: OPERATIONS_CENTER_NCE.LIST,
    },
    {
      label: 'View Non-Collection Event',
      class: 'active-label',
      link: OPERATIONS_CENTER_NCE.VIEW.replace(':id', id),
    },
    {
      label: 'View Task',
      class: 'active-label',
      link: OPERATIONS_CENTER_NON_COLLECTION_EVENTS_TASKS.VIEW.replace(
        ':id',
        id
      ).replace(':taskId', taskId),
    },
  ];
  const config = [
    {
      section: 'Task Details',
      fields: [
        // { label: 'Associated With', field: 'taskable_type' },
        // { label: 'Reference', field: 'taskable_id.name' },
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
        customTopBar={
          <TopTabsNce
            marginBtmZero
            custLeftComp={
              <div className="buttons">
                <Link
                  to={OPERATIONS_CENTER_NON_COLLECTION_EVENTS_TASKS.EDIT.replace(
                    ':id',
                    id
                  ).replace(':taskId', taskId)}
                  state={{ fromView: true }}
                >
                  <span className="icon">
                    <SvgComponent name="EditIcon" />
                  </span>
                  <span
                    className="text"
                    style={{
                      fontSize: '14px',
                      color: 'rgb(56, 125, 229)',
                      fontWeight: '400',
                      transition: 'inherit',
                    }}
                  >
                    {'Edit Task'}
                  </span>
                </Link>
              </div>
            }
          />
        }
        breadcrumbsData={BreadcrumbsData}
        breadcrumbsTitle={'Task'}
        data={upatedTaskData}
        config={config}
        selectOptions={statusOption}
        isLoading={isLoading}
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

export default NonCollectionEventsViewTasks;
