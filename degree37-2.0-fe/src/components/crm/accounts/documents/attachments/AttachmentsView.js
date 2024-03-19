import React from 'react';
import { useParams } from 'react-router';
import { API } from '../../../../../api/api-routes';
import ViewAttachments from '../../../../common/DocumentComponent/Attachments/ViewAttachments';

export default function AttachmentsView() {
  const { account_id, attachId } = useParams();

  return (
    <div className="mainContent">
      <ViewAttachments
        viewApi={API.crm.documents.attachments.getAttachmentByID}
        attachId={attachId}
        editLink={`/crm/accounts/${account_id}/view/documents/attachments/${attachId}/edit`}
      />
    </div>
  );
}
