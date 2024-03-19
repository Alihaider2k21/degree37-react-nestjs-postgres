import React, { useEffect, useState } from 'react';
import EditTask from '../common/tasks/EditTask';
import TopBar from '../common/topbar/index';
import { useParams } from 'react-router-dom';

const EditTasks = () => {
  const { id } = useParams();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [asigneeUser, setAssigneeUser] = useState([]);
  const [taskEditData, setTaskEditData] = useState();

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
    { label: 'Dashboard', class: 'disable-label', link: '/' },
    {
      label: 'Task',
      class: 'active-label',
      link: '/system-configuration/tasks',
    },
    {
      label: 'Edit Task',
      class: 'active-label',
      link: `/system-configuration/tasks/${id}/edit`,
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
          taskableType={null}
          taskableId={null}
          tasksId={id}
          taskListUrl={-1}
        />
      )}
    </div>
  );
};

export default EditTasks;
