import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import {
  CRM_NON_COLLECTION_PROFILES_TASKS_PATH,
  CRM_NON_COLLECTION_PROFILES_PATH,
} from '../../../../routes/path';
import EditTask from '../../../common/tasks/EditTask';
import TopBar from '../../../common/topbar/index';
import { NonCollectionProfilesBreadCrumbsData } from '../NonCollectionProfilesBreadCrumbsData';

const NonCollectionProfilesEditTasks = () => {
  const { id, nonCollectionProfileId } = useParams();
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
    ...NonCollectionProfilesBreadCrumbsData,
    {
      label: 'View Non-Collection Profiles',
      class: 'active-label',
      link: CRM_NON_COLLECTION_PROFILES_PATH.VIEW.replace(
        ':id',
        nonCollectionProfileId
      ),
    },
    {
      label: 'Tasks',
      class: 'active-label',
      link: CRM_NON_COLLECTION_PROFILES_TASKS_PATH.LIST.replace(
        ':nonCollectionProfileId',
        nonCollectionProfileId
      ),
    },
    {
      label: 'Edit Task',
      class: 'active-label',
      link: CRM_NON_COLLECTION_PROFILES_TASKS_PATH.EDIT.replace(
        ':nonCollectionProfileId',
        nonCollectionProfileId
      ).replace(':id', id),
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
          taskableType={'Non-Collection Profile'}
          taskableId={nonCollectionProfileId}
          tasksId={id}
          taskableIdName={taskEditData?.taskable_id?.profile_name}
          taskListUrl={location?.state?.fromView ? -2 : -1}
        />
      )}
    </div>
  );
};

export default NonCollectionProfilesEditTasks;
