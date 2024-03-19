import React from 'react';
import TopBar from '../../../../common/topbar/index';
import ViewNotes from '../../../../common/DocumentComponent/Notes/ViewNotes.js';
import { useParams } from 'react-router-dom';
import TopTabsNCP from '../../topTabsNCP.js';
import { NonCollectionProfilesBreadCrumbsData } from '../../NonCollectionProfilesBreadCrumbsData';

export default function NotesView() {
  const { id, noteId } = useParams();
  const BreadcrumbsData = [
    ...NonCollectionProfilesBreadCrumbsData,
    {
      label: 'View Non-Collection Profile',
      class: 'disable-label',
      link: `/crm/non-collection-profiles/${id}/about`,
    },
    {
      label: 'Documents',
      class: 'disable-label',
      link: `/crm/non-collection-profiles/${id}/documents/notes`,
    },
    {
      label: 'Notes',
      class: 'disable-label',
      link: `/crm/non-collection-profiles/${id}/documents/notes`,
    },
    {
      label: 'View Note',
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
      <TopTabsNCP
        NCPID={id}
        // editLink={`/crm/non-collection-profiles/${id}/edit`}
        // editName={'Edit Note'}
        activePath={`notes/${noteId}/view`}
      />
      <ViewNotes
        editLink={`/crm/non-collection-profiles/${id}/documents/notes/${noteId}/edit`}
      />
    </div>
  );
}
