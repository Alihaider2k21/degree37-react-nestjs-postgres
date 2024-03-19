import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  CRM_NON_COLLECTION_PROFILES_TASKS_PATH,
  CRM_NON_COLLECTION_PROFILES_PATH,
} from '../../../../routes/path';
import CreateTask from '../../../common/tasks/CreateTask';
import TopBar from '../../../common/topbar/index';
import { NonCollectionProfilesBreadCrumbsData } from '../NonCollectionProfilesBreadCrumbsData';

const NonCollectionProfilesCreateTasks = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [asigneeUser, setAssigneeUser] = useState([]);
  const { nonCollectionProfileId } = useParams();

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
      label: 'Create Task',
      class: 'active-label',
      link: CRM_NON_COLLECTION_PROFILES_TASKS_PATH.CREATE.replace(
        ':nonCollectionProfileId',
        nonCollectionProfileId
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
        taskableType={'crm_non_collection_profiles'}
        taskableId={nonCollectionProfileId}
        taskListUrl={CRM_NON_COLLECTION_PROFILES_TASKS_PATH.LIST.replace(
          ':nonCollectionProfileId',
          nonCollectionProfileId
        )}
      />
    </div>
  );
};

export default NonCollectionProfilesCreateTasks;
