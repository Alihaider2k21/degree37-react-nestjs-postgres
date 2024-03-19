import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { API } from '../../../../../../api/api-routes';
import viewimage from '../../../../../../assets/images/viewimage.png';
import ListAttachments from '../../../../../common/DocumentComponent/Attachments/ListAttachments';
import TopBar from '../../../../../common/topbar/index';
import SessionsNavigationTabs from '../../navigationTabs';
import {
  OPERATIONS_CENTER,
  OPERATIONS_CENTER_DRIVES_PATH,
  OPERATIONS_CENTER_SESSIONS_DOCUMENT_ATTACHMENT_PATH,
  OPERATIONS_CENTER_SESSIONS_DOCUMENT_NOTE_PATH,
  OPERATIONS_CENTER_SESSIONS_PATH,
} from '../../../../../../routes/path';

export default function AttachmentsList() {
  const { id } = useParams();
  const [search, setSearch] = useState('');

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
  ];
  const searchFieldChange = (e) => {
    setSearch(e.target.value);
  };
  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Attachments'}
        SearchValue={search}
        SearchOnChange={searchFieldChange}
        SearchPlaceholder={'Search'}
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
      <ListAttachments
        search={search}
        type="sessions"
        categoryApi={API.systemConfiguration.operationAdministrations.notesAttachment.attachmentCategories.getAll()}
        subCategoryApi={API.systemConfiguration.operationAdministrations.notesAttachment.attachmentSubcategories.getAll()}
        listApi={API.crm.documents.attachments.getAllAttachment}
        archiveApi={API.crm.documents.attachments.archiveAttachment}
        viewEditApi={`/operations-center/operations/sessions/${id}/view/documents/attachments`}
        notesApi={`/operations-center/operations/sessions/${id}/view/documents/notes`}
        attachmentApi={`/operations-center/operations/sessions/${id}/view/documents/attachments`}
        createApi={`/operations-center/operations/sessions/${id}/view/documents/attachments/create`}
      />
    </div>
  );
}
