import React from 'react';
import TopBar from '../../../../../common/topbar/index';
import LocationNotes from '../../../../../../assets/images/LocationNotes.png';
import ViewNotes from '../../../../../common/DocumentComponent/Notes/ViewNotes.js';
import { useParams } from 'react-router-dom';
import DriveNavigationTabs from '../../navigationTabs';

export default function NotesView() {
  const { id, noteId } = useParams();
  const BreadcrumbsData = [
    { label: 'Operations Center', class: 'disable-label', link: '/' },
    {
      label: 'Operations',
      class: 'disable-label',
      link: `/operations-center/operations/sessions`,
    },
    {
      label: 'Sessions',
      class: 'disable-label',
      link: `/operations-center/operations/sessions`,
    },
    {
      label: 'View Session',
      class: 'disable-label',
      link: `/operations-center/operations/sessions/${id}/view/about`,
    },
    {
      label: 'Documents',
      class: 'disable-label',
      link: `/operations-center/operations/sessions/${id}/view/documents/notes`,
    },
    {
      label: 'Notes',
      class: 'disable-label',
      link: `/operations-center/operations/sessions/${id}/view/documents/notes`,
    },
    {
      label: 'View Note',
      class: 'active-label',
      link: '#',
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
            <h4 className="">Metro High School</h4>
            <span>Metro, TX</span>
          </div>
        </div>
        <DriveNavigationTabs />
      </div>
      <ViewNotes
        editLink={`/operations-center/operations/sessions/${id}/view/documents/notes/${noteId}/edit`}
      />
    </div>
  );
}
