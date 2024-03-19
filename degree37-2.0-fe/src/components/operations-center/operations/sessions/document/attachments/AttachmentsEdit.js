import React from 'react';
import { useParams } from 'react-router';
import { API } from '../../../../../../api/api-routes';
import EditAttachments from '../../../../../common/DocumentComponent/Attachments/EditAttachments';
import TopBar from '../../../../../common/topbar/index';
import {
  OPERATIONS_CENTER,
  OPERATIONS_CENTER_DRIVES_PATH,
  OPERATIONS_CENTER_SESSIONS_DOCUMENT_ATTACHMENT_PATH,
  OPERATIONS_CENTER_SESSIONS_DOCUMENT_NOTE_PATH,
  OPERATIONS_CENTER_SESSIONS_PATH,
} from '../../../../../../routes/path';

export default function AttachmentsEdit() {
  const { id, attachId } = useParams();
  const BreadcrumbsData = [
    {
      label: 'Operations Center',
      class: 'disable-label',
      link: OPERATIONS_CENTER.DASHBOARD,
    },
    {
      label: 'Operations',
      class: 'disable-label',
      link: OPERATIONS_CENTER_DRIVES_PATH.LIST,
    },
    {
      label: 'Sessions',
      class: 'disable-label',
      link: OPERATIONS_CENTER_SESSIONS_PATH.LIST,
    },
    {
      label: 'View Session',
      class: 'disable-label',
      link: OPERATIONS_CENTER_SESSIONS_PATH.VIEW.replace(':id', id),
    },
    {
      label: 'Documents',
      class: 'disable-label',
      link: OPERATIONS_CENTER_SESSIONS_DOCUMENT_NOTE_PATH.LIST.replace(
        ':id',
        id
      ),
    },
    {
      label: 'Attachments',
      class: 'active-label',
      link: OPERATIONS_CENTER_SESSIONS_DOCUMENT_ATTACHMENT_PATH.LIST.replace(
        ':id',
        id
      ),
    },
    {
      label: 'Edit Attachment',
      class: 'active-label',
      link: OPERATIONS_CENTER_SESSIONS_DOCUMENT_ATTACHMENT_PATH.EDIT.replace(
        ':id',
        id
      ).replace(':attachId', attachId),
    },
  ];
  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Attachments'}
        SearchValue={null}
        SearchOnChange={null}
        SearchPlaceholder={null}
      />
      <EditAttachments
        type="sessions"
        attachId={attachId}
        editApi={API.crm.documents.attachments.updateAttachment}
        categoryApi={API.systemConfiguration.operationAdministrations.notesAttachment.attachmentCategories.getAll()}
        subCategoryApi={API.systemConfiguration.operationAdministrations.notesAttachment.attachmentSubcategories.getAll()}
        listLink={`/operations-center/operations/sessions/${id}/view/documents/attachments`}
        archiveApi={API.crm.documents.attachments.archiveAttachment}
      />
    </div>
  );
}
