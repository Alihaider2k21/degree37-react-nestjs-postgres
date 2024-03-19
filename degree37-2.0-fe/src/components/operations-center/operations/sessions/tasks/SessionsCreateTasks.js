import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  OPERATIONS_CENTER_DRIVES_PATH,
  OPERATIONS_CENTER_MANAGE_FAVORITES_PATH,
  OPERATIONS_CENTER_SESSIONS_PATH,
  SESSION_TASKS_PATH,
} from '../../../../../routes/path';
import TopBar from '../../../../common/topbar/index';
import CreateTask from '../../../../common/tasks/CreateTask';

const SessionsCreateTasks = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [asigneeUser, setAssigneeUser] = useState([]);
  const params = useParams();

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

    getAssigneeUsers();
  }, [BASE_URL]);

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
        params?.session_id
      ).replace(':slug', 'about'),
    },
    // {
    //   label: 'Tasks',
    //   class: 'active-label',
    //   link: SESSION_TASKS_PATH.LIST.replace(':session_id', params?.session_id),
    // },
    {
      label: 'Add Task',
      class: 'active-label',
      link: SESSION_TASKS_PATH.CREATE.replace(
        ':session_id',
        params?.session_id
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
      <CreateTask
        formHeading={'Add Task'}
        assignedUserOptions={asigneeUser}
        taskStatusOptions={taskStatusList}
        taskableType={'sessions'}
        taskableId={params?.session_id}
        taskListUrl={SESSION_TASKS_PATH.LIST.replace(
          ':session_id',
          params?.session_id
        )}
      />
    </div>
  );
};

export default SessionsCreateTasks;
