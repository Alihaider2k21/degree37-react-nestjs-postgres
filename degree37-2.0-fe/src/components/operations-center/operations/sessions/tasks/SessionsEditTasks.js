import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import {
  OPERATIONS_CENTER_DRIVES_PATH,
  OPERATIONS_CENTER_MANAGE_FAVORITES_PATH,
  OPERATIONS_CENTER_SESSIONS_PATH,
  SESSION_TASKS_PATH,
} from '../../../../../routes/path';
import TopBar from '../../../../common/topbar/index';
import EditTask from '../../../../common/tasks/EditTask';

const SessionsEditTasks = () => {
  const { id, session_id } = useParams();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [asigneeUser, setAssigneeUser] = useState([]);
  const [taskEditData, setTaskEditData] = useState();
  const location = useLocation();

  useEffect(() => {
    const getAssigneeUsers = async () => {
      const accessToken = localStorage.getItem('token');
      const result = await fetch(`${BASE_URL}/user/all-users`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await result.json();
      if (data?.data) {
        setAssigneeUser(data?.data);
      }
    };

    const getTaskById = async () => {
      const accessToken = localStorage.getItem('token');
      const result = await fetch(`${BASE_URL}/tasks/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await result.json();

      if (data?.data) {
        setTaskEditData(data?.data);
      }
    };

    getAssigneeUsers();
    if (id) {
      getTaskById();
    }
  }, [id, BASE_URL]);

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
      label: 'Sessions',
      class: 'active-label',
      link: OPERATIONS_CENTER_SESSIONS_PATH.LIST,
    },
    {
      label: 'View Session',
      class: 'active-label',
      link: OPERATIONS_CENTER_SESSIONS_PATH.VIEW.replace(
        ':id',
        session_id
      ).replace(':slug', 'about'),
    },
    // {
    //   label: 'Tasks',
    //   class: 'active-label',
    //   link: SESSION_TASKS_PATH.LIST.replace(':session_id', session_id),
    // },
    {
      label: 'Edit Task',
      class: 'active-label',
      link: SESSION_TASKS_PATH.EDIT.replace(':session_id', session_id).replace(
        ':id',
        id
      ),
    },
  ];
  const taskStatusList = [
    {
      id: 1,
      name: 'Not Started',
    },
    {
      id: 2,
      name: 'In Process',
    },
    {
      id: 3,
      name: 'Deferred',
    },
    {
      id: 4,
      name: 'Completed',
    },
    {
      id: 5,
      name: 'Cancelled',
    },
  ];

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Task'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />
      {taskEditData && (
        <EditTask
          formHeading={'Edit Task'}
          assignedUserOptions={asigneeUser}
          taskStatusOptions={taskStatusList}
          taskEditData={taskEditData}
          taskableType={'Session'}
          taskableId={session_id}
          tasksId={id}
          hideTopRefEdit
          taskableIdName={taskEditData?.taskable_id?.name}
          taskListUrl={location?.state?.fromView ? -2 : -1}
        />
      )}
    </div>
  );
};

export default SessionsEditTasks;
