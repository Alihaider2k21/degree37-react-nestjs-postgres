import React from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { DONOR_TASKS_PATH } from '../../../../../routes/path';
import ListTask from '../../../../common/tasks/ListTask';
import DonorNavigation from '../DonorNavigation';
import { DonorBreadCrumbsData } from '../../donor/DonorBreadCrumbsData';
import { useEffect } from 'react';

const DonorListTasks = () => {
  const { donorId } = useParams();
  const context = useOutletContext();
  useEffect(() => {
    context.setBreadCrumbsState([
      ...DonorBreadCrumbsData,
      {
        label: 'View Donor',
        class: 'active-label',
        link: `/crm/contacts/donor/${donorId}/view`,
      },
      {
        label: 'Tasks',
        class: 'active-label',
        link: DONOR_TASKS_PATH.LIST.replace(':donorId', donorId),
      },
    ]);
  }, []);
  // const BreadcrumbsData = [
  //   ...DonorBreadCrumbsData,
  //   {
  //     label: 'View Donor',
  //     class: 'active-label',
  //     link: `/crm/contacts/donor/${donorId}/view`,
  //   },
  //   {
  //     label: 'Tasks',
  //     class: 'active-label',
  //     link: DONOR_TASKS_PATH.LIST.replace(':donorId', donorId),
  //   },
  // ];

  return (
    <ListTask
      taskableType={'donors'}
      show={false}
      search={context?.search}
      taskableId={donorId}
      customTopBar={<DonorNavigation />}
      breadCrumbsData={context?.breadCurmbState}
      createTaskUrl={DONOR_TASKS_PATH.CREATE.replace(':donorId', donorId)}
    />
  );
};

export default DonorListTasks;
