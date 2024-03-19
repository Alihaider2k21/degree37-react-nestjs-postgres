import React from 'react';
import { useParams } from 'react-router-dom';

import DirectionCreate from './components/DirectionCreate';
import TopBar from '../../../../common/topbar/index';
import { LocationsBreadCrumbsData } from '../../LocationsBreadCrumbsData';

const DirectionAdd = () => {
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
      label: 'Create Direction',
      class: 'active-label',
      link: `#`,
    },
  ];

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Notes'}
        SearchValue={null}
        SearchOnChange={null}
        SearchPlaceholder={null}
      />
      <DirectionCreate
        directionsListPath={`/crm/locations/${locationId}/directions`}
      />
    </div>
  );
};

export default DirectionAdd;
