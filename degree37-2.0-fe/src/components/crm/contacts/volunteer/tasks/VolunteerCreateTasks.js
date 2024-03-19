import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CRM_VOLUNTEER_TASKS_PATH } from '../../../../../routes/path';
import CreateTask from '../../../../common/tasks/CreateTask';
import TopBar from '../../../../common/topbar/index';
import { VolunteersBreadCrumbsData } from '../../volunteers/VolunteersBreadCrumbsData';

const VolunteerCreateTasks = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [asigneeUser, setAssigneeUser] = useState([]);
  const { volunteerId } = useParams();

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
    ...VolunteersBreadCrumbsData,
    {
      label: 'View Volunteers',
      class: 'active-label',
      link: `/crm/contacts/volunteers/${volunteerId}/view`,
    },
    {
      label: 'Tasks',
      class: 'active-label',
      link: CRM_VOLUNTEER_TASKS_PATH.LIST.replace(':volunteerId', volunteerId),
    },
    {
      label: 'Create Task',
      class: 'active-label',
      link: CRM_VOLUNTEER_TASKS_PATH.CREATE.replace(
        ':volunteerId',
        volunteerId
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
        formHeading={'Create Task'}
        assignedUserOptions={asigneeUser}
        taskStatusOptions={taskStatusList}
        taskableType={'crm_volunteer'}
        taskableId={volunteerId}
        taskListUrl={CRM_VOLUNTEER_TASKS_PATH.LIST.replace(
          ':volunteerId',
          volunteerId
        )}
      />
    </div>
  );
};

export default VolunteerCreateTasks;
