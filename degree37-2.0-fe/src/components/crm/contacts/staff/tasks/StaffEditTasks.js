import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { STAFF_TASKS_PATH } from '../../../../../routes/path';
import EditTask from '../../../../common/tasks/EditTask';
import TopBar from '../../../../common/topbar/index';
import { formatUser } from '../../../../../helpers/formatUser';
import { StaffBreadCrumbsData } from '../StaffBreadCrumbsData';

const StaffEditTasks = () => {
  const { id, staff_id } = useParams();
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
    ...StaffBreadCrumbsData,
    {
      label: 'View Staff',
      class: 'active-label',
      link: `/crm/contacts/staff/${staff_id}/view`,
    },
    {
      label: 'Tasks',
      class: 'active-label',
      link: STAFF_TASKS_PATH.LIST.replace(':staff_id', staff_id),
    },
    {
      label: 'Edit Task',
      class: 'active-label',
      link: STAFF_TASKS_PATH.EDIT.replace(':staff_id', staff_id).replace(
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
          taskableType={'Staff'}
          taskableId={staff_id}
          taskableIdName={formatUser(taskEditData?.taskable_id, 1)}
          tasksId={id}
          taskListUrl={location?.state?.fromView ? -2 : -1}
        />
      )}
    </div>
  );
};

export default StaffEditTasks;
