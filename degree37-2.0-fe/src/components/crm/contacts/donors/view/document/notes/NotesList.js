import React, { useEffect, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { API } from '../../../../../../../api/api-routes';
import ListNotes from '../../../../../../common/DocumentComponent/Notes/ListNotes';

import './index.scss';

import { DonorBreadCrumbsData } from '../../../../donor/DonorBreadCrumbsData';

export default function NotesList() {
  const context = useOutletContext();
  const { donorId: id } = useParams();
  useEffect(() => {
    context.setBreadCrumbsState([
      ...DonorBreadCrumbsData,
      {
        label: 'View Donors',
        class: 'disable-label',
        link: `/crm/contacts/donor/${id}/view`,
      },
      {
        label: 'Documents',
        class: 'disable-label',
        link: `/crm/contacts/donor/${id}/view/documents/notes`,
      },
      {
        label: 'Notes',
        class: 'active-label',
        link: `/crm/contacts/donor/${id}/view/documents/notes`,
      },
    ]);
  }, []);
  const [search, setSearch] = useState('');
  const searchFieldChange = (e) => {
    setSearch(e.target.value);
  };
  console.log(searchFieldChange);
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
    // <div className="mainContent">
    //   <TopBar
    //     BreadCrumbsData={BreadcrumbsData}
    //     BreadCrumbsTitle={'Notes'}
    //     SearchValue={search}
    //     SearchOnChange={searchFieldChange}
    //     SearchPlaceholder={'Search'}
    //   />
    //   <DonorNavigation />
    <ListNotes
      search={search}
      notesListPath={`/crm/contacts/donor/${id}/view/documents/notes`}
      attachmentsListPath={`/crm/contacts/donor/${id}/view/documents/attachments`}
      addNotesLink={`/crm/contacts/donor/${id}/view/documents/notes/create`}
      noteable_type={'donors'}
      categories={categories}
      subCategories={subCategories}
    />
    // </div>
  );
}
