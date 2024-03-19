import React from 'react';
import { useParams } from 'react-router';
import { API } from '../../../../../../api/api-routes';
import EditAttachments from '../../../../../common/DocumentComponent/Attachments/EditAttachments';
import TopBar from '../../../../../common/topbar/index';
import { VolunteersBreadCrumbsData } from '../../VolunteersBreadCrumbsData';

export default function AttachmentsEdit() {
  const { volunteerId, attachId } = useParams();
  const BreadcrumbsData = [
    ...VolunteersBreadCrumbsData,
    {
      label: 'View Volunteer',
      class: 'disable-label',
      link: `/crm/contacts/volunteers/${volunteerId}/view`,
    },
    {
      label: 'Documents',
      class: 'disable-label',
      link: `/crm/contacts/volunteer/${volunteerId}/view/documents/notes`,
    },
    {
      label: 'Attachments',
      class: 'disable-label',
      link: `/crm/contacts/volunteer/${volunteerId}/view/documents/attachments`,
    },
    {
      label: 'Edit Attachment',
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
      <EditAttachments
        type="crm_volunteer"
        attachId={attachId}
        editApi={API.crm.documents.attachments.updateAttachment}
        categoryApi={API.systemConfiguration.crmAdministration.contact.attachmentCategories.getAll()}
        subCategoryApi={API.systemConfiguration.crmAdministration.contact.attachmentSubcategories.getAll()}
        listLink={`/crm/contacts/volunteer/${volunteerId}/view/documents/attachments`}
        archiveApi={API.crm.documents.attachments.archiveAttachment}
      />
    </div>
  );
}
