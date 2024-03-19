import React from 'react';
import ViewNotes from '../../../../common/DocumentComponent/Notes/ViewNotes';
import { useParams } from 'react-router-dom';

export default function NotesView() {
  const { account_id, noteId } = useParams();

  return (
    <div className="mainContent">
      <ViewNotes
        editLink={`/crm/accounts/${account_id}/view/documents/notes/${noteId}/edit`}
      />
    </div>
  );
}
