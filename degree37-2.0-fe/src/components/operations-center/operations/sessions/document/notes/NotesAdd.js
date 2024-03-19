import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { API } from '../../../../../../api/api-routes';
import NotesCreate from '../../../../../common/DocumentComponent/Notes/NotesCreate.js';
import TopBar from '../../../../../common/topbar/index';

const NotesAdd = () => {
  const { id } = useParams();
  const BreadcrumbsData = [
    { label: 'Operations Center', class: 'disable-label', link: '/' },
    {
      label: 'Operations',
      class: 'disable-label',
      link: `/operations-center/operations/sessions`,
    },
    {
      label: 'Sessions',
      class: 'disable-label',
      link: `/operations-center/operations/sessions`,
    },
    {
      label: 'View Session',
      class: 'disable-label',
      link: `/operations-center/operations/sessions/${id}/view/about`,
    },
    {
      label: 'Documents',
      class: 'disable-label',
      link: `/operations-center/operations/sessions/${id}/view/documents/notes`,
    },
    {
      label: 'Notes',
      class: 'disable-label',
      link: `/operations-center/operations/sessions/${id}/view/documents/notes`,
    },
    {
      label: 'Create Note',
      class: 'active-label',
      link: '#',
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
        await API.systemConfiguration.operationAdministrations.notesAttachment.noteCategories.getAll();
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
        await API.systemConfiguration.operationAdministrations.notesAttachment.noteSubcategories.getAll();
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
        noteable_type={'sessions'}
        categories={categories}
        subCategories={subCategories}
        notesListPath={`/operations-center/operations/sessions/${id}/view/documents/notes`}
      />
    </div>
  );
};

export default NotesAdd;
