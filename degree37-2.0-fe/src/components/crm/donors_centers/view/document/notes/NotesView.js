import React from 'react';
import TopBar from '../../../../../common/topbar/index';
import ViewNotes from '../../../../../common/DocumentComponent/Notes/ViewNotes.js';
import { useParams } from 'react-router-dom';
import TopTabsDonorCenters from '../../../topTabsDonorCenters';
import { DonorCentersBreadCrumbsData } from '../../../DonorCentersBreadCrumbsData';

export default function NotesView() {
  const { id, noteId } = useParams();
  const BreadcrumbsData = [
    ...DonorCentersBreadCrumbsData,
    {
      label: 'View Donors Centers',
      class: 'disable-label',
      link: `/crm/donor_center/${id}`,
    },
    {
      label: 'Documents',
      class: 'disable-label',
      link: `/crm/donor-center/${id}/view/documents/notes`,
    },
    {
      label: 'Notes',
      class: 'disable-label',
      link: `/crm/donor-center/${id}/view/documents/notes`,
    },
    {
      label: 'Create Note',
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
      <TopTabsDonorCenters donorCenterId={id} hideSession={true} />
      <ViewNotes
        editLink={`/crm/donor-center/${id}/view/documents/notes/${noteId}/edit`}
      />
    </div>
  );
}
