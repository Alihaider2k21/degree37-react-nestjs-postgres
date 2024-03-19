import React from 'react';
import { useParams } from 'react-router';
import { API } from '../../../../../../api/api-routes';
import CreateAttachments from '../../../../../common/DocumentComponent/Attachments/CreateAttachments';
import TopBar from '../../../../../common/topbar/index';
import { VolunteersBreadCrumbsData } from '../../VolunteersBreadCrumbsData';

export default function AttachmentsAdd() {
  const { volunteerId } = useParams();

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
        type="crm_volunteer"
        submitApi={API.crm.documents.attachments.createAttachment}
        categoryApi={API.systemConfiguration.crmAdministration.contact.attachmentCategories.getAll()}
        subCategoryApi={API.systemConfiguration.crmAdministration.contact.attachmentSubcategories.getAll()}
        listLink={`/crm/contacts/volunteer/${volunteerId}/view/documents/attachments`}
      />
    </div>
  );
}
