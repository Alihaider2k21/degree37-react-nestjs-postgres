import React, { useEffect } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import ViewNotes from '../../../../../common/DocumentComponent/Notes/ViewNotes';

import { VolunteersBreadCrumbsData } from '../../VolunteersBreadCrumbsData';

export default function NotesView() {
  const { volunteerId } = useParams();
  const { noteId } = useParams();
  const context = useOutletContext();
  useEffect(() => {
    context.setBreadCrumbsState([
      ...VolunteersBreadCrumbsData,
      {
        label: 'View Volunteer',
        class: 'disable-label',
        link: `/crm/contacts/volunteers/${volunteerId}/view`,
      },
      {
        label: 'Documents',
        class: 'disable-label',
        link: `/crm/contacts/volunteer/${volunteerId}/view/documents/notes`,
      },
      {
        label: 'Notes',
        class: 'disable-label',
        link: `/crm/contacts/volunteer/${volunteerId}/view/documents/notes`,
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
      editLink={`/crm/contacts/volunteer/${volunteerId}/view/documents/notes/${noteId}/edit`}
    />
  );
}
