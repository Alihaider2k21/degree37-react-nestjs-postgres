import React from 'react';
import { useParams } from 'react-router-dom';
import {
  OPERATIONS_CENTER_NON_COLLECTION_EVENTS_TASKS,
  OPERATIONS_CENTER_NCE,
  OPERATIONS_CENTER_MANAGE_FAVORITES_PATH,
  OPERATIONS_CENTER_DRIVES_PATH,
} from '../../../../../routes/path';
import ListTask from '../../../../common/tasks/ListTask';
// import NCENavigationTabs from '../navigationTabs';
// import LocationNotes from '../../../../../assets/images/LocationNotes.png';
import TopTabsNce from '../TopTabsNce';

const NonCollectionEventsListTasks = () => {
  const { id } = useParams();

  const BreadcrumbsData = [
    {
      label: 'Operations Center',
      class: 'active-label',
      link: OPERATIONS_CENTER_MANAGE_FAVORITES_PATH.LIST,
    },
    {
      label: 'Operations',
      class: 'active-label',
      link: OPERATIONS_CENTER_DRIVES_PATH.LIST,
    },
    {
      label: 'Non-Collection Events',
      class: 'active-label',
      link: OPERATIONS_CENTER_NCE.LIST.replace(':id', id),
    },
    {
      label: 'View Non-Collection Event',
      class: 'active-label',
      link: OPERATIONS_CENTER_NCE.VIEW.replace(':id', id),
    },
    {
      label: 'Tasks',
      class: 'active-label',
      link: OPERATIONS_CENTER_NON_COLLECTION_EVENTS_TASKS.LIST.replace(
        ':id',
        id
      ),
    },
  ];

  return (
    <ListTask
      taskableType={'oc_non_collection_events'}
      taskableId={id}
      customTopBar={
        <>
          <TopTabsNce />
        </>
      }
      tasksNotGeneric
      calendarIconShowHeader
      hideAssociatedWith
      breadCrumbsData={BreadcrumbsData}
      createTaskUrl={OPERATIONS_CENTER_NON_COLLECTION_EVENTS_TASKS.CREATE.replace(
        ':id',
        id
      )}
    />
  );
};

export default NonCollectionEventsListTasks;
