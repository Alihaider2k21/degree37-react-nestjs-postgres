import React, { useEffect } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { API } from '../../../../../../../api/api-routes';
import ListAttachments from '../../../../../../common/DocumentComponent/Attachments/ListAttachments';

import { StaffBreadCrumbsData } from '../../../StaffBreadCrumbsData';

export default function AttachmentsList() {
  const { id } = useParams();
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
        class: 'active-label',
        link: `/crm/contacts/staff/${id}/view/documents/attachments`,
      },
    ]);
  }, []);

  return (
    <ListAttachments
      search={context?.search}
      type="staff"
      categoryApi={API.systemConfiguration.crmAdministration.contact.attachmentCategories.getAll()}
      subCategoryApi={API.systemConfiguration.crmAdministration.contact.attachmentSubcategories.getAll()}
      listApi={API.crm.documents.attachments.getAllAttachment}
      archiveApi={API.crm.documents.attachments.archiveAttachment}
      viewEditApi={`/crm/contacts/staff/${id}/view/documents/attachments`}
      notesApi={`/crm/contacts/staff/${id}/view/documents/notes`}
      attachmentApi={`/crm/contacts/staff/${id}/view/documents/attachments`}
      createApi={`/crm/contacts/staff/${id}/view/documents/attachments/create`}
    />
  );
}
