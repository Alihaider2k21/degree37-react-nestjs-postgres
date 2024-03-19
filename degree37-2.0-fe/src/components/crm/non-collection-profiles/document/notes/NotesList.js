import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { API } from '../../../../../api/api-routes';
import ListNotes from '../../../../common/DocumentComponent/Notes/ListNotes.js';
import TopBar from '../../../../common/topbar/index';
import './index.scss';
import TopTabsNCP from '../../topTabsNCP.js';
import { NonCollectionProfilesBreadCrumbsData } from '../../NonCollectionProfilesBreadCrumbsData';

export default function NotesList() {
  const [search, setSearch] = useState('');
  const { id } = useParams();
  const BreadcrumbsData = [
    ...NonCollectionProfilesBreadCrumbsData,
    {
      label: 'View Non-Collection Profile',
      class: 'disable-label',
      link: `/crm/non-collection-profiles/${id}/about`,
    },
    {
      label: 'Documents',
      class: 'disable-label',
      link: `/crm/non-collection-profiles/${id}/documents/notes`,
    },
    {
      label: 'Notes',
      class: 'active-label',
      link: `/crm/non-collection-profiles/${id}/documents/notes`,
    },
  ];

  const searchFieldChange = (e) => {
    setSearch(e.target.value);
  };
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  useEffect(() => {
    getCategory();
    getsubCategory();
  }, []);
  const getCategory = async () => {
    try {
      const response =
        await API.systemConfiguration.crmAdministration.account.noteCategories.getAll();
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
        await API.systemConfiguration.crmAdministration.account.noteSubcategories.getAll();
      if (response?.data) {
        const category = response?.data?.data?.data;
        setSubCategories(category);
      }
    } catch (error) {
      toast.error(error);
    }
  };
  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Notes'}
        SearchValue={search}
        SearchOnChange={searchFieldChange}
        SearchPlaceholder={'Search'}
      />
      <TopTabsNCP
        NCPID={id}
        // editLink={`/crm/non-collection-profiles/${id}/edit`}
        // editName={'Edit NCP'}
        endPath={'notes'}
      />
      <ListNotes
        notesListPath={`/crm/non-collection-profiles/${id}/documents/notes`}
        attachmentsListPath={`/crm/non-collection-profiles/${id}/documents/attachments`}
        addNotesLink={`/crm/non-collection-profiles/${id}/documents/notes/create`}
        noteable_type={'crm_non_collection_profiles'}
        categories={categories}
        search={search}
        subCategories={subCategories}
      />
    </div>
  );
}
