import React, { useEffect } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { API } from '../../../../../../api/api-routes';
import ListAttachments from '../../../../../common/DocumentComponent/Attachments/ListAttachments';
import { VolunteersBreadCrumbsData } from '../../VolunteersBreadCrumbsData';

export default function AttachmentsList() {
  const { volunteerId } = useParams();
  const context = useOutletContext();
  useEffect(() => {
    context.setBreadCrumbsState([
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
        class: 'active-label',
        link: `/crm/contacts/volunteer/${volunteerId}/view/documents/attachments`,
      },
    ]);
  }, []);

  return (
    <ListAttachments
      search={context?.search}
      type="crm_volunteer"
      categoryApi={API.systemConfiguration.crmAdministration.contact.attachmentCategories.getAll()}
      subCategoryApi={API.systemConfiguration.crmAdministration.contact.attachmentSubcategories.getAll()}
      listApi={API.crm.documents.attachments.getAllAttachment}
      archiveApi={API.crm.documents.attachments.archiveAttachment}
      viewEditApi={`/crm/contacts/volunteer/${volunteerId}/view/documents/attachments`}
      notesApi={`/crm/contacts/volunteer/${volunteerId}/view/documents/notes`}
      attachmentApi={`/crm/contacts/volunteer/${volunteerId}/view/documents/attachments`}
      createApi={`/crm/contacts/volunteer/${volunteerId}/view/documents/attachments/create`}
    />
  );
}
