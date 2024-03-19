import React from 'react';
import TopBar from '../../../../common/topbar/index';
import LocationNotes from '../../../../../assets/images/LocationNotes.png';
import AccountViewNavigationTabs from '../../navigationTabs';
import ViewDirection from './components/ViewDirection';
import { Link, useParams } from 'react-router-dom';
import SvgComponent from '../../../../common/SvgComponent';
import { useEffect } from 'react';
import { fetchData } from '../../../../../helpers/Api';
import { useState } from 'react';
import { LocationsBreadCrumbsData } from '../../LocationsBreadCrumbsData';

export default function DirectionView() {
  const { locationId, directionId } = useParams();
  const [viewAddress, setViewAddress] = useState('');
  const [locations, setLocations] = useState('');
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
  ];

  useEffect(() => {
    fetchData(`/crm/locations/${locationId}`, 'GET')
      .then((res) => {
        if (res?.data) {
          let edit = res?.data;
          setViewAddress(`${edit?.address?.city}, ${edit?.address?.state}`);
          setLocations(edit?.name);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Notes'}
        SearchValue={null}
        SearchOnChange={null}
        SearchPlaceholder={null}
      />
      <div className="imageMainContent">
        <div className="d-flex align-items-center gap-3 pb-4 ">
          <div style={{ width: '62px', height: '62px' }}>
            <img
              src={LocationNotes}
              style={{ width: '100%' }}
              alt="CancelIcon"
            />
          </div>
          <div className="d-flex flex-column">
            <h4 className="">{locations}</h4>
            <span>{viewAddress}</span>
          </div>
        </div>
        <div className="directionTabs">
          <AccountViewNavigationTabs />
          <div className="buttons">
            <Link
              to={`/crm/locations/${locationId}/directions/${directionId}/edit`}
            >
              <span className="icon">
                <SvgComponent name="EditIcon" />
              </span>
              <span className="text" style={{ fontSize: '14px' }}>
                Edit Direction
              </span>
            </Link>
          </div>
        </div>
      </div>
      <ViewDirection
        editLink={`/crm/locations/${locationId}/directions/${directionId}/edit`}
      />
    </div>
  );
}
