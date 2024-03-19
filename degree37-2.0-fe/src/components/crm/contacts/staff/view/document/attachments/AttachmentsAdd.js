import React from 'react';
import { useParams } from 'react-router';
import { API } from '../../../../../../../api/api-routes';
import CreateAttachments from '../../../../../../common/DocumentComponent/Attachments/CreateAttachments';
import TopBar from '../../../../../../common/topbar/index';
import { StaffBreadCrumbsData } from '../../../StaffBreadCrumbsData';

export default function AttachmentsAdd() {
  const { id } = useParams();

  const BreadcrumbsData = [
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
      class: 'disable-label',
      link: `/crm/contacts/staff/${id}/view/documents/attachments`,
    },
    {
      label: 'Add Attachment',
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
        type="staff"
        submitApi={API.crm.documents.attachments.createAttachment}
        categoryApi={API.systemConfiguration.crmAdministration.contact.attachmentCategories.getAll()}
        subCategoryApi={API.systemConfiguration.crmAdministration.contact.attachmentSubcategories.getAll()}
        listLink={`/crm/contacts/staff/${id}/view/documents/attachments`}
      />
    </div>
  );
}
