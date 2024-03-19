import React, { useState } from 'react';
import LocationNotes from '../../../../../assets/images/LocationNotes.png';
import DirectionList from './components/DirectionList';
import TopBar from '../../../../common/topbar/index';
import LocationAboutNavigationTabs from '../../navigationTabs';
import './index.scss';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { fetchData } from '../../../../../helpers/Api';
import { LocationsBreadCrumbsData } from '../../LocationsBreadCrumbsData';

export default function DirectionsList() {
  const [search, setSearch] = useState('');
  const { locationId } = useParams();
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

  const searchFieldChange = (e) => {
    setSearch(e.target.value);
  };
  console.log({ search });
  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Notes'}
        SearchValue={search}
        SearchOnChange={searchFieldChange}
        SearchPlaceholder={'Search'}
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
        <LocationAboutNavigationTabs />
      </div>
      <DirectionList search={search} />
    </div>
  );
}
