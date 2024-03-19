import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { API } from '../../../../../../api/api-routes';
import EditNotes from '../../../../../common/DocumentComponent/Notes/EditNotes.js';
import TopBar from '../../../../../common/topbar/index';

const NotesEdit = () => {
  const { id } = useParams();
  const BreadcrumbsData = [
    { label: 'Operations Center', class: 'disable-label', link: '/' },
    {
      label: 'Operations',
      class: 'disable-label',
      link: '/operations-center/operations/non-collection-events',
    },
    {
      label: 'Non-Collection Events',
      class: 'disable-label',
      link: '/operations-center/operations/non-collection-events',
    },
    {
      label: 'View Non-Collection Event',
      class: 'disable-label',
      link: `/operations-center/operations/non-collection-events/${id}/view/about`,
    },
    {
      label: 'Documents',
      class: 'disable-label',
      link: `/operations-center/operations/non-collection-events/${id}/view/documents/notes`,
    },
    {
      label: 'Notes',
      class: 'disable-label',
      link: `/operations-center/operations/non-collection-events/${id}/view/documents/notes`,
    },
    {
      label: 'Edit Note',
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
    <div className="">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Notes'}
        SearchValue={null}
        SearchOnChange={null}
        SearchPlaceholder={null}
      />
      <EditNotes
        noteable_type={'oc_non_collection_events'}
        notesListPath={`/operations-center/operations/non-collection-events/${id}/view/documents/notes`}
        categories={categories}
        subCategories={subCategories}
      />
    </div>
  );
};

export default NotesEdit;
