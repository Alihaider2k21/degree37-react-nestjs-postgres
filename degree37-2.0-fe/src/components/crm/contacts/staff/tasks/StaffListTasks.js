import React, { useEffect } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { STAFF_TASKS_PATH } from '../../../../../routes/path';
import ListTask from '../../../../common/tasks/ListTask';
import StaffNavigation from '../StaffNavigation';
import { StaffBreadCrumbsData } from '../StaffBreadCrumbsData';

const StaffListTasks = () => {
  const { staff_id } = useParams();
  const context = useOutletContext();
  useEffect(() => {
    context.setBreadCrumbsState([
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
    ]);
  }, []);

  return (
    <ListTask
      show={false}
      search={context?.search}
      taskableType={'staff'}
      customTopBar={<StaffNavigation />}
      taskableId={staff_id}
      breadCrumbsData={context?.breadCrumbsData}
      createTaskUrl={STAFF_TASKS_PATH.CREATE.replace(':staff_id', staff_id)}
    />
  );
};

export default StaffListTasks;
