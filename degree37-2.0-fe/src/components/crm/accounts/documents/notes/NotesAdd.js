import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { API } from '../../../../../api/api-routes';
import NotesCreate from '../../../../common/DocumentComponent/Notes/NotesCreate';
import TopBar from '../../../../common/topbar/index';
import { CRMAccountsBreadCrumbsData } from '../../AccountsBreadCrumbsData';
const NotesAdd = () => {
  const { id } = useParams();
  const BreadcrumbsData = [
    ...CRMAccountsBreadCrumbsData,
    {
      label: 'View Account',
      class: 'disable-label',
      link: `/crm/accounts/${id}/view/about`,
    },
    {
      label: 'Document',
      class: 'disable-label',
      link: `/crm/accounts/${id}/view/documents/notes`,
    },
    {
      label: 'Notes',
      class: 'disable-label',
      link: `/crm/accounts/${id}/view/documents/notes`,
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
        await API.systemConfiguration.crmAdministration.account.noteCategories.getAll();
      if (response?.data?.data?.data) {
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
      if (response?.data?.data?.data) {
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
        noteable_type={'accounts'}
        categories={categories}
        subCategories={subCategories}
        notesListPath={`/crm/accounts/${id}/view/documents/notes`}
      />
    </div>
  );
};

export default NotesAdd;
