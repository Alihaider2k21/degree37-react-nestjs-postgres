import React from 'react';
import { useParams } from 'react-router';
import { API } from '../../../../../../api/api-routes';
import viewimage from '../../../../../../assets/images/viewimage.png';
import ViewAttachments from '../../../../../common/DocumentComponent/Attachments/ViewAttachments';
import TopBar from '../../../../../common/topbar/index';
import SessionsNavigationTabs from '../../navigationTabs.jsx';
import {
  OPERATIONS_CENTER,
  OPERATIONS_CENTER_DRIVES_PATH,
  OPERATIONS_CENTER_SESSIONS_DOCUMENT_ATTACHMENT_PATH,
  OPERATIONS_CENTER_SESSIONS_DOCUMENT_NOTE_PATH,
  OPERATIONS_CENTER_SESSIONS_PATH,
} from '../../../../../../routes/path.js';

export default function AttachmentsView() {
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
      label: 'View Attachment',
      class: 'active-label',
      link: OPERATIONS_CENTER_SESSIONS_DOCUMENT_ATTACHMENT_PATH.VIEW.replace(
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
      <div className="imageMainContent">
        <div className="d-flex align-items-center gap-3 ">
          <img
            src={viewimage}
            className="bg-white heroIconImg"
            alt="CancelIcon"
          />
          <div className="d-flex flex-column">
            <h4 className="">Metro High School</h4>
            <span>Metro, TX</span>
          </div>
        </div>
        <SessionsNavigationTabs />
      </div>
      <ViewAttachments
        viewApi={API.crm.documents.attachments.getAttachmentByID}
        attachId={attachId}
        editLink={`/operations-center/operations/sessions/${id}/view/documents/attachments/${attachId}/edit`}
      />
    </div>
  );
}
