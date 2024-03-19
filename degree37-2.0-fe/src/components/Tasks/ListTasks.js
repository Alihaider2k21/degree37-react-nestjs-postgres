import React from 'react';
// import { useParams } from 'react-router-dom';
import ListTask from '../common/tasks/ListTask';

const ListTasks = () => {
  // const { id } = useParams();
  const BreadcrumbsData = [
    {
      label: 'Tasks',
      class: 'active-label',
      link: '/system-configuration/tasks',
    },
  ];

  return (
    <ListTask
      taskableType={null}
      taskableId={null}
      breadCrumbsData={BreadcrumbsData}
      createTaskUrl={'/system-configuration/tasks/create'}
    />
  );
};

export default ListTasks;
