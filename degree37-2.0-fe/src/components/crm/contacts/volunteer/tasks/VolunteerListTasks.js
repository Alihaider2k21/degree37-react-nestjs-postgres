import React, { useEffect } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { CRM_VOLUNTEER_TASKS_PATH } from '../../../../../routes/path';
import ListTask from '../../../../common/tasks/ListTask';
import VolunteerNavigation from '../../volunteers/VolunteerNavigation';
import { VolunteersBreadCrumbsData } from '../../volunteers/VolunteersBreadCrumbsData';

const VolunteerListTasks = () => {
  const { volunteerId } = useParams();
  const context = useOutletContext();
  console.log(context);
  useEffect(() => {
    context.setBreadCrumbsState([
      ...VolunteersBreadCrumbsData,
      {
        label: 'View Volunteers',
        class: 'active-label',
        link: `/crm/contacts/volunteers/${volunteerId}/view`,
      },
      {
        label: 'Tasks',
        class: 'active-label',
        link: CRM_VOLUNTEER_TASKS_PATH.LIST.replace(
          ':volunteerId',
          volunteerId
        ),
      },
    ]);
  }, []);

  return (
    <ListTask
      search={context?.search}
      taskableType={'crm_volunteer'}
      taskableId={volunteerId}
      show={false}
      breadCrumbsData={context?.breadCrumbsData}
      customTopBar={<VolunteerNavigation />}
      createTaskUrl={CRM_VOLUNTEER_TASKS_PATH.CREATE.replace(
        ':volunteerId',
        volunteerId
      )}
    />
  );
};

export default VolunteerListTasks;
