import React from 'react';
import { useParams } from 'react-router-dom';
import {
  CRM_DONORS_CENTERS,
  DONOR_CENTERS_TASKS_PATH,
} from '../../../../routes/path';
import ListTask from '../../../common/tasks/ListTask';

import TopTabsDonorCenters from '../topTabsDonorCenters';
import { DonorCentersBreadCrumbsData } from '../DonorCentersBreadCrumbsData';
const DonorCentersListTasks = () => {
  const { donor_center_id } = useParams();
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
  ];

  return (
    <ListTask
      taskableType={'donor_centers'}
      taskableId={donor_center_id}
      customTopBar={<TopTabsDonorCenters donorCenterId={donor_center_id} />}
      breadCrumbsData={BreadcrumbsData}
      createTaskUrl={DONOR_CENTERS_TASKS_PATH.CREATE.replace(
        ':donor_center_id',
        donor_center_id
      )}
    />
  );
};
export default DonorCentersListTasks;
