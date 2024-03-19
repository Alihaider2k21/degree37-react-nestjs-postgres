import React, { useEffect } from 'react';
import { useParams, useOutletContext } from 'react-router';
import { API } from '../../../../../../api/api-routes';
import ViewAttachments from '../../../../../common/DocumentComponent/Attachments/ViewAttachments';

import { VolunteersBreadCrumbsData } from '../../VolunteersBreadCrumbsData';

export default function AttachmentsView() {
  const { volunteerId } = useParams();
  const { attachId } = useParams();
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
        label: 'Attachments',
        class: 'disable-label',
        link: `/crm/contacts/volunteer/${volunteerId}/view/documents/attachments`,
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
      editLink={`/crm/contacts/volunteer/${volunteerId}/view/documents/attachments/${attachId}/edit`}
    />
  );
}
