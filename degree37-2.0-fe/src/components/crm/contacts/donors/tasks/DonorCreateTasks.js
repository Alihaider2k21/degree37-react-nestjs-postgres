import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DONOR_TASKS_PATH } from '../../../../../routes/path';
import CreateTask from '../../../../common/tasks/CreateTask';
import TopBar from '../../../../common/topbar/index';
import { DonorBreadCrumbsData } from '../../donor/DonorBreadCrumbsData';

const DonorCreateTasks = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [asigneeUser, setAssigneeUser] = useState([]);
  const { id, donorId } = useParams();

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
    ...DonorBreadCrumbsData,
    {
      label: 'View Donor',
      class: 'active-label',
      link: `/crm/contacts/donor/${donorId}/view`,
    },
    {
      label: 'Tasks',
      class: 'active-label',
      link: DONOR_TASKS_PATH.LIST.replace(':donorId', donorId),
    },
    {
      label: 'Create Task',
      class: 'active-label',
      link: DONOR_TASKS_PATH.CREATE.replace(':donorId', donorId),
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
        taskableType={'donors'}
        taskableId={id}
        taskListUrl={DONOR_TASKS_PATH.LIST.replace(':donorId', donorId)}
      />
    </div>
  );
};

export default DonorCreateTasks;
