import React from 'react';
// import TopBar from '../../../../../common/topbar/index';
// import LocationNotes from '../../../../../../assets/images/LocationNotes.png';
import ViewNotes from '../../../../../common/DocumentComponent/Notes/ViewNotes.js';
import { useParams } from 'react-router-dom';
// import DriveNavigationTabs from '../../navigationTabs';
import ViewForm from '../../ViewForm';
import TopTabsNce from '../../TopTabsNce';

export default function NotesView() {
  const { id, noteId } = useParams();
  const BreadcrumbsData = [
    { label: 'Operations Center', class: 'disable-label', link: '/' },
    {
      label: 'Operations',
      class: 'disable-label',
      link: '/operations-center/operations/non-collection-events',
    },
    {
      label: 'Non-Collection Events',
      class: 'disable-label',
      link: '/operations-center/operations/non-collection-events',
    },
    {
      label: 'View Non-Collection Event',
      class: 'disable-label',
      link: `/operations-center/operations/non-collection-events/${id}/view/about`,
    },
    {
      label: 'Documents',
      class: 'disable-label',
      link: `/operations-center/operations/non-collection-events/${id}/view/documents/notes`,
    },
    {
      label: 'Notes',
      class: 'disable-label',
      link: `/operations-center/operations/non-collection-events/${id}/view/documents/notes`,
    },
    {
      label: 'View Note',
      class: 'active-label',
      link: '#',
    },
  ];

  return (
    <div className="">
      {/* <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Notes'}
        SearchValue={null}
        SearchOnChange={null}
        SearchPlaceholder={null}
      /> */}
      <ViewForm
        breadcrumbsData={BreadcrumbsData}
        breadcrumbsTitle={'Notes'}
        SearchValue={null}
        SearchOnChange={null}
        SearchPlaceholder={null}
        customTopBar={
          <>
            <TopTabsNce />
          </>
        }
      />
      {/* <div className="imageMainContent">
        <div className="d-flex align-items-center gap-3 ">
          <div style={{ width: '62px', height: '62px' }}>
            <img
              src={LocationNotes}
              style={{ width: '100%' }}
              alt="non-collection-eventslIcon"
            />
          </div>
          <div className="d-flex flex-column">
            <h4 className="">Metro High School</h4>
            <span>Metro, TX</span>
          </div>
        </div>
        <DriveNavigationTabs />
      </div> */}
      <ViewNotes
        editLink={`/operations-center/operations/non-collection-events/${id}/view/documents/notes/${noteId}/edit`}
      />
    </div>
  );
}
