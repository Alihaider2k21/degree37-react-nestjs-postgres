import React from 'react';
import TopBar from '../../../../../common/topbar/index';
import LocationNotes from '../../../../../../assets/images/LocationNotes.png';
import AccountViewNavigationTabs from '../../../navigationTabs';
import ViewNotes from '../../../../../common/DocumentComponent/Notes/ViewNotes.js';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { fetchData } from '../../../../../../helpers/Api';
import { useState } from 'react';
import { LocationsBreadCrumbsData } from '../../../LocationsBreadCrumbsData';

export default function NotesView() {
  const { id, noteId } = useParams();
  const [viewAddress, setViewAddress] = useState('');
  const [locations, setLocations] = useState('');
  const BreadcrumbsData = [
    ...LocationsBreadCrumbsData,
    {
      label: 'View Location',
      class: 'disable-label',
      link: `/crm/locations/${id}/view`,
    },
    {
      label: 'Documents',
      class: 'disable-label',
      link: `/crm/locations/${id}/view/documents/notes`,
    },
    {
      label: 'Notes',
      class: 'disable-label',
      link: `/crm/locations/${id}/view/documents/notes`,
    },
    {
      label: 'View Note',
      class: 'active-label',
      link: '#',
    },
  ];

  useEffect(() => {
    fetchData(`/crm/locations/${id}`, 'GET')
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
        <div className="d-flex align-items-center gap-3 ">
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
        <AccountViewNavigationTabs />
      </div>
      <ViewNotes
        editLink={`/crm/locations/${id}/view/documents/notes/${noteId}/edit`}
      />
    </div>
  );
}
