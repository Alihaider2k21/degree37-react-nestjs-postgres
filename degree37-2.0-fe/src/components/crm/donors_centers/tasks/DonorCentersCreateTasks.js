import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  CRM_DONORS_CENTERS,
  DONOR_CENTERS_TASKS_PATH,
} from '../../../../routes/path';
import CreateTask from '../../../common/tasks/CreateTask';
import TopBar from '../../../common/topbar/index';
import { DonorCentersBreadCrumbsData } from '../DonorCentersBreadCrumbsData';
const DonorCentersCreateTasks = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [asigneeUser, setAssigneeUser] = useState([]);
  const { donor_center_id } = useParams();
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
    ...DonorCentersBreadCrumbsData,
    {
      label: 'View Donors Center',
      class: 'active-label',
      link: CRM_DONORS_CENTERS.VIEW.replace(':id', donor_center_id),
    },
    {
      label: 'Tasks',
      class: 'active-label',
      link: DONOR_CENTERS_TASKS_PATH.LIST.replace(
        ':donor_center_id',
        donor_center_id
      ),
    },
    {
      label: 'Create Task',
      class: 'active-label',
      link: DONOR_CENTERS_TASKS_PATH.CREATE.replace(
        ':donor_center_id',
        donor_center_id
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
        taskableType={'donor_centers'}
        taskableId={donor_center_id}
        taskListUrl={DONOR_CENTERS_TASKS_PATH.LIST.replace(
          ':donor_center_id',
          donor_center_id
        )}
      />
    </div>
  );
};
export default DonorCentersCreateTasks;
