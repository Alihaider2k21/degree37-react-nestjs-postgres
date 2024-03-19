import React, { useEffect, useState } from 'react';
import CreateTask from '../../../common/tasks/CreateTask';
import TopBar from '../../../common/topbar/index';
import { ACCOUNT_TASKS_PATH } from '../../../../routes/path';
import { useParams } from 'react-router-dom';
import { CRMAccountsBreadCrumbsData } from '../AccountsBreadCrumbsData';

const AccountCreateTasks = () => {
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
    ...CRMAccountsBreadCrumbsData,
    {
      label: 'View Account',
      class: 'active-label',
      link: `/crm/accounts/${params?.account_id}/view/about`,
    },
    {
      label: 'Tasks',
      class: 'active-label',
      link: ACCOUNT_TASKS_PATH.LIST.replace(':account_id', params?.account_id),
    },
    {
      label: 'Create Task',
      class: 'active-label',
      link: ACCOUNT_TASKS_PATH.CREATE.replace(
        ':account_id',
        params?.account_id
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
        taskableType={'accounts'}
        taskableId={params?.account_id}
        taskListUrl={ACCOUNT_TASKS_PATH.LIST.replace(
          ':account_id',
          params?.account_id
        )}
      />
    </div>
  );
};

export default AccountCreateTasks;
