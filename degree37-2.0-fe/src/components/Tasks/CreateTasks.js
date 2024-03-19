import React, { useEffect, useState } from 'react';
import CreateTask from '../common/tasks/CreateTask';
import TopBar from '../common/topbar/index';

const CreateTasks = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [asigneeUser, setAssigneeUser] = useState([]);

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
    { label: 'Dashboard', class: 'disable-label', link: '/' },
    {
      label: 'Task',
      class: 'active-label',
      link: '/system-configuration/tasks',
    },
    {
      label: 'Create Task',
      class: 'active-label',
      link: '/system-configuration/tasks/create',
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
        formHeading={'Create Task'}
        assignedUserOptions={asigneeUser}
        taskStatusOptions={taskStatusList}
        taskableType={null}
        taskableId={null}
        taskListUrl={'/system-configuration/tasks'}
      />
    </div>
  );
};

export default CreateTasks;
