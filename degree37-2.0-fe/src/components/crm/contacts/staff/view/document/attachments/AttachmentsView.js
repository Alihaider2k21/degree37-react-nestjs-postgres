import React, { useEffect } from 'react';
import { useParams, useOutletContext } from 'react-router';
import { API } from '../../../../../../../api/api-routes';
import ViewAttachments from '../../../../../../common/DocumentComponent/Attachments/ViewAttachments';

import { StaffBreadCrumbsData } from '../../../StaffBreadCrumbsData';

export default function AttachmentsView() {
  const { id, attachId } = useParams();
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
        label: 'Attachments',
        class: 'disable-label',
        link: `/crm/contacts/staff/${id}/view/documents/attachments`,
      },
      {
        label: 'View Attachment',
        class: 'active-label',
        link: `#`,
      },
    ]);
  }, []);

  return (
    <ViewAttachments
      viewApi={API.crm.documents.attachments.getAttachmentByID}
      attachId={attachId}
      editLink={`/crm/contacts/staff/${id}/view/documents/attachments/${attachId}/edit`}
    />
  );
}
