import React from 'react';
import { useParams } from 'react-router-dom';
import { API } from '../../../../../api/api-routes';
import ListAttachments from '../../../../common/DocumentComponent/Attachments/ListAttachments';

export default function AttachmentsList({ search }) {
  const { account_id } = useParams();

  return (
    <div className="mainContent">
      <ListAttachments
        type="accounts"
        search={search}
        categoryApi={API.systemConfiguration.crmAdministration.account.attachmentCategories.getAll()}
        subCategoryApi={API.systemConfiguration.crmAdministration.account.attachmentSubcategories.getAll()}
        listApi={API.crm.documents.attachments.getAllAttachment}
        archiveApi={API.crm.documents.attachments.archiveAttachment}
        viewEditApi={`/crm/accounts/${account_id}/view/documents/attachments`}
        notesApi={`/crm/accounts/${account_id}/view/documents/notes`}
        attachmentApi={`/crm/accounts/${account_id}/view/documents/attachments`}
        createApi={`/crm/accounts/${account_id}/view/documents/attachments/create`}
      />
    </div>
  );
}
