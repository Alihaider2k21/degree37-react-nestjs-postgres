import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { API } from '../../../../../../api/api-routes';
// import viewimage from '../../../../../../assets/images/viewimage.png';
import ListAttachments from '../../../../../common/DocumentComponent/Attachments/ListAttachments';
// import TopBar from '../../../../../common/topbar/index';
import TopTabsNce from '../../TopTabsNce';
import ViewForm from '../../ViewForm';
// import NCENavigationTabs from '../../navigationTabs.jsx';

export default function AttachmentsList() {
  const { id } = useParams();
  const [search, setSearch] = useState('');

  const BreadcrumbsData = [
    { label: 'Operations Center', class: 'disable-label', link: '/' },
    {
      label: 'Operations',
      class: 'disable-label',
      link: '/operations-center/operations/non-collection-events',
    },
    {
      label: 'Non-Collection Events',
      class: 'disable-label',
      link: '/operations-center/operations/non-collection-events',
    },
    {
      label: 'View Non-Collection Event',
      class: 'disable-label',
      link: `/operations-center/operations/non-collection-events/${id}/view/about`,
    },
    {
      label: 'Documents',
      class: 'disable-label',
      link: `/operations-center/operations/non-collection-events/${id}/view/documents/notes`,
    },
    {
      label: 'Attachments',
      class: 'active-label',
      link: '#',
    },
  ];
  const searchFieldChange = (e) => {
    setSearch(e.target.value);
  };
  return (
    // <div className="mainContent">
    <div>
      <ViewForm
        breadcrumbsData={BreadcrumbsData}
        breadcrumbsTitle={'Attachments'}
        SearchValue={search}
        SearchOnChange={searchFieldChange}
        SearchPlaceholder={'Search'}
        customTopBar={
          <>
            <TopTabsNce />
          </>
        }
      />
      {/* <div className="imageMainContent">
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
        <NCENavigationTabs />
      </div> */}
      <ListAttachments
        search={search}
        type="oc_non_collection_events"
        categoryApi={API.systemConfiguration.operationAdministrations.notesAttachment.attachmentCategories.getAll()}
        subCategoryApi={API.systemConfiguration.operationAdministrations.notesAttachment.attachmentSubcategories.getAll()}
        listApi={API.crm.documents.attachments.getAllAttachment}
        archiveApi={API.crm.documents.attachments.archiveAttachment}
        viewEditApi={`/operations-center/operations/non-collection-events/${id}/view/documents/attachments`}
        notesApi={`/operations-center/operations/non-collection-events/${id}/view/documents/notes`}
        attachmentApi={`/operations-center/operations/non-collection-events/${id}/view/documents/attachments`}
        createApi={`/operations-center/operations/non-collection-events/${id}/view/documents/attachments/create`}
      />
    </div>
    // </div>
  );
}
