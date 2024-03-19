import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { API } from '../../../../../../../api/api-routes.js';
import NotesCreate from '../../../../../../common/DocumentComponent/Notes/NotesCreate.js';
import TopBar from '../../../../../../common/topbar/index.js';
import { DonorBreadCrumbsData } from '../../../../donor/DonorBreadCrumbsData.js';

// const BASE_URL = process.env.REACT_APP_BASE_URL;

const NotesAdd = () => {
  const { donorId } = useParams();
  const BreadcrumbsData = [
    ...DonorBreadCrumbsData,
    {
      label: 'View Donors',
      class: 'disable-label',
      link: `/crm/contacts/donor/${donorId}/view`,
    },
    {
      label: 'Documents',
      class: 'disable-label',
      link: `/crm/contacts/donor/${donorId}/view/documents/notes`,
    },
    {
      label: 'Notes',
      class: 'disable-label',
      link: `/crm/contacts/donor/${donorId}/view/documents/notes`,
    },
    {
      label: 'Add Note',
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
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Notes'}
        SearchValue={null}
        SearchOnChange={null}
        SearchPlaceholder={null}
      />
      <NotesCreate
        noteable_type={'donors'}
        categories={categories}
        subCategories={subCategories}
        notesListPath={`/crm/contacts/donor/${donorId}/view/documents/notes`}
      />
    </div>
  );
};

export default NotesAdd;
