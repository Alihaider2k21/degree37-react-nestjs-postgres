import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { API } from '../../../../../api/api-routes';
import NotesCreate from '../../../../common/DocumentComponent/Notes/NotesCreate.js';
import TopBar from '../../../../common/topbar/index';
import { NonCollectionProfilesBreadCrumbsData } from '../../NonCollectionProfilesBreadCrumbsData';

const NotesAdd = () => {
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
      class: 'disable-label',
      link: `/crm/non-collection-profiles/${id}/documents/notes`,
    },
    {
      label: 'Create Note',
      class: 'active-label',
      link: `#`,
    },
  ];
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
        SearchValue={null}
        SearchOnChange={null}
        SearchPlaceholder={null}
      />
      <NotesCreate
        noteable_type={'crm_non_collection_profiles'}
        categories={categories}
        subCategories={subCategories}
        notesListPath={`/crm/non-collection-profiles/${id}/documents/notes`}
      />
    </div>
  );
};

export default NotesAdd;
