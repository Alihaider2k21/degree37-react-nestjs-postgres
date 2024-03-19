import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import moment from 'moment';
import ViewForm from '../../../../common/ViewForm';
import {
  DRIVES_TASKS_PATH,
  OPERATIONS_CENTER_DRIVES_PATH,
  OPERATIONS_CENTER_MANAGE_FAVORITES_PATH,
} from '../../../../../routes/path';
import { formatUser } from '../../../../../helpers/formatUser';
import jwt from 'jwt-decode';
import { makeAuthorizedApiRequest } from '../../../../../helpers/Api';
import DriveNavigationTabs from '../navigationTabs';
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import viewimage from '../../../../../assets/images/viewimage.png';

const DrivesViewTasks = () => {
  const { id, drive_id } = useParams();
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
  const navigate = useNavigate();
  const [driveData, setDriveData] = useState(null);

  const getDriveData = async (id) => {
    const result = await makeAuthorizedApiRequest(
      'GET',
      `${BASE_URL}/drives/${id}`
    );
    const { data } = await result.json();
    data?.[0] ? setDriveData(data[0]) : setDriveData(null);
  };

  useEffect(() => {
    getDriveData(drive_id);
  }, []);
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
          let { data, response } = await result.json();
          if (result.ok || result.status === 200) {
            setTasksData(data);
            if (response === 'Task is archived.') {
              toast.error('Task is archived.', {
                autoClose: 3000,
              });
            }
            setIsLoading(false);
          } else {
            toast.error('Error Fetching Tasks Details', {
              autoClose: 3000,
            });
            setIsLoading(false);
          }
        } else {
          toast.error('Error Fetching Tasks Details', {
            autoClose: 3000,
          });
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);

        console.log(error);
        toast.error('Error Fetching Tasks Details', {
          autoClose: 3000,
        });
      }
    };
    if (id) {
      getData(id);
    }
  }, [id, BASE_URL]);

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
      taskable_type: 'Drive',
      status: statusString,
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
      label: 'Drives',
      class: 'active-label',
      link: OPERATIONS_CENTER_DRIVES_PATH.LIST,
    },
    {
      label: 'View Drive',
      class: 'active-label',
      link: `/operations-center/operations/drives/${drive_id}/view/about`,
    },
    {
      label: 'View Task',
      class: 'active-label',
      link: DRIVES_TASKS_PATH.VIEW.replace(':drive_id', drive_id).replace(
        ':id',
        id
      ),
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
      {upatedTaskData?.name && (
        <ViewForm
          customTopBar={
            <div className="imageMainContent">
              <div className="d-flex align-items-center gap-3 ">
                <img
                  src={viewimage}
                  className="bg-white heroIconImg"
                  alt="CancelIcon"
                />
                <div className="d-flex flex-column">
                  <h4 className="">{driveData?.account?.name || ''}</h4>
                  <span>{driveData?.crm_locations?.name || ''}</span>
                </div>
              </div>
              <div className="d-flex align-items-center justify-between">
                <DriveNavigationTabs />
                <div className="d-flex align-items-center gap-3">
                  <button
                    className="btn btn-md btn-link p-0 editBtn"
                    color="primary"
                    onClick={() => {
                      navigate(
                        DRIVES_TASKS_PATH.EDIT.replace(
                          ':drive_id',
                          drive_id
                        ).replace(':id', id),
                        {
                          state: {
                            fromView: true,
                          },
                        }
                      );
                    }}
                  >
                    <FontAwesomeIcon
                      className="m-1"
                      width={15}
                      height={15}
                      icon={faPenToSquare}
                    />
                    Edit Task
                  </button>
                </div>
              </div>
            </div>
          }
          breadcrumbsData={BreadcrumbsData}
          breadcrumbsTitle={'Tasks'}
          fromView
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
      )}
    </div>
  );
};

export default DrivesViewTasks;
