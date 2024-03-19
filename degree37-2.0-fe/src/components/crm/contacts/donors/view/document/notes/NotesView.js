import React from 'react';

import { useOutletContext, useParams } from 'react-router-dom';
import ViewNotes from '../../../../../../common/DocumentComponent/Notes/ViewNotes';

import { DonorBreadCrumbsData } from '../../../../donor/DonorBreadCrumbsData';
import { useEffect } from 'react';

export default function NotesView() {
  const { donorId: id, noteId } = useParams();
  const context = useOutletContext();
  useEffect(() => {
    context.setBreadCrumbsState([
      ...DonorBreadCrumbsData,
      {
        label: 'View Donors',
        class: 'disable-label',
        link: `/crm/contacts/donor/${id}/view`,
      },
      {
        label: 'Documents',
        class: 'disable-label',
        link: `/crm/contacts/donor/${id}/view/documents/notes`,
      },
      {
        label: 'Notes',
        class: 'disable-label',
        link: `/crm/contacts/donor/${id}/view/documents/notes`,
      },
      {
        label: 'View Note',
        class: 'active-label',
        link: `#`,
      },
    ]);
  }, []);
  // const BreadcrumbsData = [
  //   ...DonorBreadCrumbsData,
  //   {
  //     label: 'View Donors',
  //     class: 'disable-label',
  //     link: `/crm/contacts/donor/${id}/view`,
  //   },
  //   {
  //     label: 'Documents',
  //     class: 'disable-label',
  //     link: `/crm/contacts/donor/${id}/view/documents/notes`,
  //   },
  //   {
  //     label: 'Notes',
  //     class: 'disable-label',
  //     link: `/crm/contacts/donor/${id}/view/documents/notes`,
  //   },
  //   {
  //     label: 'View Note',
  //     class: 'active-label',
  //     link: `#`,
  //   },
  // ];

  return (
    // <div className="mainContent">
    //   <TopBar
    //     BreadCrumbsData={BreadcrumbsData}
    //     BreadCrumbsTitle={'Notes'}
    //     SearchValue={null}
    //     SearchOnChange={null}
    //     SearchPlaceholder={null}
    //   />
    //   <DonorNavigation />
    <ViewNotes
      editLink={`/crm/contacts/donor/${id}/view/documents/notes/${noteId}/edit`}
    />
    // </div>
  );
}
