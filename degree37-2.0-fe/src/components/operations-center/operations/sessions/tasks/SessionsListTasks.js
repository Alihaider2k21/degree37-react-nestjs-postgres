import React from 'react';
import { useParams } from 'react-router-dom';
import {
  OPERATIONS_CENTER_DRIVES_PATH,
  OPERATIONS_CENTER_MANAGE_FAVORITES_PATH,
  OPERATIONS_CENTER_SESSIONS_PATH,
  SESSION_TASKS_PATH,
} from '../../../../../routes/path';
import ListTask from '../../../../common/tasks/ListTask';
import SessionsNavigationTabs from '../navigationTabs';
import Session from '../Session';

const SessionsListTasks = () => {
  const params = useParams();
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
      label: 'Sessions',
      class: 'active-label',
      link: OPERATIONS_CENTER_SESSIONS_PATH.LIST,
    },
    {
      label: 'View Session',
      class: 'active-label',
      link: OPERATIONS_CENTER_SESSIONS_PATH.VIEW.replace(
        ':id',
        params?.session_id
      ).replace(':slug', 'about'),
    },
    {
      label: 'Tasks',
      class: 'active-label',
      link: SESSION_TASKS_PATH.LIST.replace(':session_id', params?.session_id),
    },
  ];

  return (
    <ListTask
      taskableType={'sessions'}
      customTopBar={
        <div className="mainContentInner bg-white pb-0 mb-3">
          <Session />
          <SessionsNavigationTabs />
        </div>
      }
      taskableId={params?.session_id}
      hideAssociatedWith
      calendarIconShowHeader
      tasksNotGeneric
      breadCrumbsData={BreadcrumbsData}
      createTaskUrl={SESSION_TASKS_PATH.CREATE.replace(
        ':session_id',
        params?.session_id
      )}
    />
  );
};

export default SessionsListTasks;
