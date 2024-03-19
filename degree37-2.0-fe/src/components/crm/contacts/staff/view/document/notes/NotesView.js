import React, { useEffect } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import ViewNotes from '../../../../../../common/DocumentComponent/Notes/ViewNotes';
import { StaffBreadCrumbsData } from '../../../StaffBreadCrumbsData';

export default function NotesView() {
  const { id, noteId } = useParams();
  const context = useOutletContext();
  useEffect(() => {
    context.setBreadCrumbsState([
      ...StaffBreadCrumbsData,
      {
        label: 'View Staff',
        class: 'disable-label',
        link: `/crm/contacts/staff/${id}/view`,
      },
      {
        label: 'Documents',
        class: 'disable-label',
        link: `/crm/contacts/staff/${id}/view/documents/notes`,
      },
      {
        label: 'Notes',
        class: 'disable-label',
        link: `/crm/contacts/staff/${id}/view/documents/notes`,
      },
      {
        label: 'View Note',
        class: 'active-label',
        link: `#`,
      },
    ]);
  }, []);

  return (
    <ViewNotes
      editLink={`/crm/contacts/staff/${id}/view/documents/notes/${noteId}/edit`}
    />
  );
}
