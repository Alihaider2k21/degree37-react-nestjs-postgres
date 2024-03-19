import React, { useState, useEffect } from 'react';
import './index.scss';

import { useOutletContext, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { API } from '../../../../../../api/api-routes';
import ListNotes from '../../../../../common/DocumentComponent/Notes/ListNotes';
import { VolunteersBreadCrumbsData } from '../../VolunteersBreadCrumbsData';

export default function NotesList() {
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
        label: 'Notes',
        class: 'active-label',
        link: `/crm/contacts/volunteer/${volunteerId}/view/documents/notes`,
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
      notesListPath={`/crm/contacts/volunteer/${volunteerId}/view/documents/notes`}
      attachmentsListPath={`/crm/contacts/volunteer/${volunteerId}/view/documents/attachments`}
      addNotesLink={`/crm/contacts/volunteer/${volunteerId}/view/documents/notes/create`}
      noteable_type={'crm_volunteer'}
      categories={categories}
      subCategories={subCategories}
    />
  );
}