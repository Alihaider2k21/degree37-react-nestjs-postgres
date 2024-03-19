import React, { useEffect, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { API } from '../../../../../../../api/api-routes';
import ListNotes from '../../../../../../common/DocumentComponent/Notes/ListNotes';

import { StaffBreadCrumbsData } from '../../../StaffBreadCrumbsData';

export default function NotesList() {
  const { id } = useParams();
  const context = useOutletContext();
  useEffect(() => {
    context.setBreadCrumbsState([
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
        label: 'Notes',
        class: 'active-label',
        link: `/crm/contacts/staff/${id}/view/documents/notes`,
      },
    ]);
  }, []);

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  useEffect(() => {
    getCategory();
    getsubCategory();
  }, []);
  const getCategory = async () => {
    try {
      const response =
        await API.systemConfiguration.crmAdministration.contact.noteCategories.getAll();
      if (response?.data) {
        const category = response?.data?.data?.data;

        setCategories(category);
      }
    } catch (error) {
      toast.error(error);
    }
  };
  const getsubCategory = async () => {
    try {
      const response =
        await API.systemConfiguration.crmAdministration.contact.noteSubcategories.getAll();
      if (response?.data) {
        const category = response?.data?.data?.data;
        setSubCategories(category);
      }
    } catch (error) {
      toast.error(error);
    }
  };
  return (
    <ListNotes
      search={context?.search}
      notesListPath={`/crm/contacts/staff/${id}/view/documents/notes`}
      attachmentsListPath={`/crm/contacts/staff/${id}/view/documents/attachments`}
      addNotesLink={`/crm/contacts/staff/${id}/view/documents/notes/create`}
      noteable_type={'staff'}
      categories={categories}
      subCategories={subCategories}
    />
  );
}
