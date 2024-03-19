import React from 'react';
import { useParams } from 'react-router-dom';
import {
  OPERATIONS_CENTER_NCE,
  OPERATIONS_CENTER_MANAGE_FAVORITES_PATH,
  OPERATIONS_CENTER_DRIVES_PATH,
  OPERATIONS_CENTER_NON_COLLECTION_EVENTS_STAFFING,
} from '../../../../../routes/path';
import TopTabsNce from '../TopTabsNce';
import ListStaffing from '../../../../common/staffing/ListStaffing';

const NonCollectionEventsListStaffing = () => {
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
      label: 'Staffing',
      class: 'active-label',
      link: OPERATIONS_CENTER_NON_COLLECTION_EVENTS_STAFFING.LIST.replace(
        ':id',
        id
      ),
    },
  ];

  return (
    <ListStaffing
      taskableType={'non_collection_events'}
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
    />
  );
};

export default NonCollectionEventsListStaffing;
