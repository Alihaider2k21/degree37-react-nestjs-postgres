import React from 'react';
import { useParams } from 'react-router';
import { API } from '../../../../../../api/api-routes';
import CreateAttachments from '../../../../../common/DocumentComponent/Attachments/CreateAttachments';
import TopBar from '../../../../../common/topbar/index';
import { DonorCentersBreadCrumbsData } from '../../../DonorCentersBreadCrumbsData';

export default function AttachmentsAdd() {
  const { id } = useParams();

  const BreadcrumbsData = [
    ...DonorCentersBreadCrumbsData,
    {
      label: 'View Donors Centers',
      class: 'disable-label',
      link: `/crm/donor_center/${id}`,
    },
    {
      label: 'Documents',
      class: 'disable-label',
      link: `/crm/donor-center/${id}/view/documents/notes`,
    },
    {
      label: 'Attachments',
      class: 'disable-label',
      link: `/crm/donor-center/${id}/view/documents/attachments`,
    },
    {
      label: 'Create Attachment',
      class: 'active-label',
      link: `#`,
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
      <CreateAttachments
        type="donor_centers"
        submitApi={API.crm.documents.attachments.createAttachment}
        categoryApi={API.systemConfiguration.crmAdministration.account.attachmentCategories.getAll()}
        subCategoryApi={API.systemConfiguration.crmAdministration.account.attachmentSubcategories.getAll()}
        listLink={`/crm/donor-center/${id}/view/documents/attachments`}
      />
    </div>
  );
}
