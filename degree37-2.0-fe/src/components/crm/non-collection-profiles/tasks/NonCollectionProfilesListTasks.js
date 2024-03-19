import React from 'react';
import { useParams } from 'react-router-dom';
import {
  CRM_NON_COLLECTION_PROFILES_TASKS_PATH,
  CRM_NON_COLLECTION_PROFILES_PATH,
} from '../../../../routes/path';
import ListTask from '../../../common/tasks/ListTask';
import TopTabsNCP from '../topTabsNCP';
import { NonCollectionProfilesBreadCrumbsData } from '../NonCollectionProfilesBreadCrumbsData';

const NonCollectionProfilesListTasks = () => {
  const { nonCollectionProfileId } = useParams();
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
  ];

  return (
    <ListTask
      taskableType={'crm_non_collection_profiles'}
      customTopBar={<TopTabsNCP NCPID={nonCollectionProfileId} />}
      taskableId={nonCollectionProfileId}
      breadCrumbsData={BreadcrumbsData}
      createTaskUrl={CRM_NON_COLLECTION_PROFILES_TASKS_PATH.CREATE.replace(
        ':nonCollectionProfileId',
        nonCollectionProfileId
      )}
    />
  );
};

export default NonCollectionProfilesListTasks;
