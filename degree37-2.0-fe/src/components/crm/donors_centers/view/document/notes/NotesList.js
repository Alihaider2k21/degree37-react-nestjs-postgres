import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { API } from '../../../../../../api/api-routes';
import ListNotes from '../../../../../common/DocumentComponent/Notes/ListNotes.js';
import TopBar from '../../../../../common/topbar/index';
import './index.scss';
import TopTabsDonorCenters from '../../../topTabsDonorCenters';
import { DonorCentersBreadCrumbsData } from '../../../DonorCentersBreadCrumbsData';
export default function NotesList() {
  const [search, setSearch] = useState('');
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
      class: 'active-label',
      link: `/crm/donor-center/${id}/view/documents/notes`,
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
      <TopTabsDonorCenters donorCenterId={id} />
      <ListNotes
        search={search}
        notesListPath={`/crm/donor-center/${id}/view/documents/notes`}
        attachmentsListPath={`/crm/donor-center/${id}/view/documents/attachments`}
        addNotesLink={`/crm/donor-center/${id}/view/documents/notes/create`}
        noteable_type={'donor_centers'}
        categories={categories}
        subCategories={subCategories}
      />
    </div>
  );
}
