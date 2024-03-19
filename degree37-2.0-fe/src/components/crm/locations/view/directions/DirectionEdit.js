import React from 'react';

import EditDirection from './components/EditDirection';
import TopBar from '../../../../common/topbar/index';
import { useParams } from 'react-router-dom';
import { LocationsBreadCrumbsData } from '../../LocationsBreadCrumbsData';

const DirectionEdit = () => {
  const { locationId } = useParams();
  const BreadcrumbsData = [
    ...LocationsBreadCrumbsData,
    {
      label: 'View Location',
      class: 'disable-label',
      link: `/crm/locations/${locationId}/view`,
    },
    {
      label: 'Directions',
      class: 'active-label',
      link: `/crm/locations/${locationId}/directions`,
    },
    {
      label: 'Edit Direction',
      class: 'active-label',
      link: `#`,
    },
  ];
  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Directions'}
        SearchValue={null}
        SearchOnChange={null}
        SearchPlaceholder={null}
      />
      <EditDirection
        directionsListPath={`/crm/locations/${locationId}/directions`}
      />
    </div>
  );
};

export default DirectionEdit;
