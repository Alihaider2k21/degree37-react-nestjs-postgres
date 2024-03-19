import React from 'react';
import { useParams } from 'react-router';
import { API } from '../../../../../../api/api-routes';
// import viewimage from '../../../../../../assets/images/viewimage.png';
import ViewAttachments from '../../../../../common/DocumentComponent/Attachments/ViewAttachments';
// import TopBar from '../../../../../common/topbar/index';
// import NCENavigationTabs from '../../navigationTabs.jsx';
import TopTabsNce from '../../TopTabsNce';
import ViewForm from '../../ViewForm';

export default function AttachmentsView() {
  const { id, attachId } = useParams();

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
      class: 'disable-label',
      link: `/operations-center/operations/non-collection-events/${id}/view/documents/attachments`,
    },
    {
      label: 'View Attachment',
      class: 'active-label',
      link: '#',
    },
  ];
  return (
    <div className="">
      <ViewForm
        breadcrumbsData={BreadcrumbsData}
        breadcrumbsTitle={'Notes'}
        SearchValue={null}
        SearchOnChange={null}
        SearchPlaceholder={null}
        customTopBar={
          <>
            <TopTabsNce />
          </>
        }
      />
      {/* <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Attachments'}
        SearchValue={null}
        SearchOnChange={null}
        SearchPlaceholder={null}
      /> */}
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
      <ViewAttachments
        viewApi={API.crm.documents.attachments.getAttachmentByID}
        attachId={attachId}
        editLink={`/operations-center/operations/non-collection-events/${id}/view/documents/attachments/${attachId}/edit`}
      />
    </div>
  );
}
