import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { API } from '../../../../../../api/api-routes';
import NotesCreate from '../../../../../common/DocumentComponent/Notes/NotesCreate.js';
import TopBar from '../../../../../common/topbar/index';
import { DonorCentersBreadCrumbsData } from '../../../DonorCentersBreadCrumbsData';

const NotesAdd = () => {
  const { id } = useParams();
  const BreadcrumbsData = [
    ...DonorCentersBreadCrumbsData,
    {
      label: 'View Donors Centers',
      class: 'disable-label',
      link: `/crm/donor_center/${id}`,
    },
    {
      label: 'Documents',
      class: 'disable-label',
      link: `/crm/donor-center/${id}/view/documents/notes`,
    },
    {
      label: 'Notes',
      class: 'disable-label',
      link: `/crm/donor-center/${id}/view/documents/notes`,
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
        noteable_type={'donor_centers'}
        categories={categories}
        subCategories={subCategories}
        notesListPath={`/crm/donor-center/${id}/view/documents/notes`}
      />
    </div>
  );
};

export default NotesAdd;
