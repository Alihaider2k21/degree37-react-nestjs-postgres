import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { API } from '../../../../../../api/api-routes';
import LocationNotes from '../../../../../../assets/images/LocationNotes.png';
import ListNotes from '../../../../../common/DocumentComponent/Notes/ListNotes.js';
import TopBar from '../../../../../common/topbar/index';
import LocationAboutNavigationTabs from '../../../navigationTabs';
import './index.scss';
import { fetchData } from '../../../../../../helpers/Api';
import { LocationsBreadCrumbsData } from '../../../LocationsBreadCrumbsData';

export default function NotesList() {
  const [search, setSearch] = useState('');
  const [viewAddress, setViewAddress] = useState('');
  const [locations, setLocations] = useState('');
  const { id } = useParams();
  const BreadcrumbsData = [
    ...LocationsBreadCrumbsData,
    {
      label: 'View Location',
      class: 'disable-label',
      link: `/crm/locations/${id}/view`,
    },
    {
      label: 'Documents',
      class: 'active-label',
      link: `/crm/locations/${id}/view/documents/notes`,
    },
    {
      label: 'Notes',
      class: 'active-label',
      link: `/crm/locations/${id}/view/documents/notes`,
    },
  ];

  const searchFieldChange = (e) => {
    setSearch(e.target.value);
  };
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    fetchData(`/crm/locations/${id}`, 'GET')
      .then((res) => {
        if (res?.data) {
          let edit = res?.data;
          setViewAddress(`${edit?.address?.city}, ${edit?.address?.state}`);
          setLocations(edit?.name);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  useEffect(() => {
    getCategory();
    getsubCategory();
  }, []);
  const getCategory = async () => {
    try {
      const response =
        await API.systemConfiguration.crmAdministration.location.noteCategories.getAll();
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
        await API.systemConfiguration.crmAdministration.location.noteSubcategories.getAll();
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
      <div className="imageMainContent">
        <div className="d-flex align-items-center gap-3 ">
          <div style={{ width: '62px', height: '62px' }}>
            <img
              src={LocationNotes}
              style={{ width: '100%' }}
              alt="CancelIcon"
            />
          </div>

          <div className="d-flex flex-column">
            <h4 className="">{locations}</h4>
            <span>{viewAddress}</span>
          </div>
        </div>
        <LocationAboutNavigationTabs />
      </div>
      <ListNotes
        search={search}
        notesListPath={`/crm/locations/${id}/view/documents/notes`}
        attachmentsListPath={`/crm/locations/${id}/view/documents/attachments`}
        addNotesLink={`/crm/locations/${id}/view/documents/notes/create`}
        noteable_type={'crm_locations'}
        categories={categories}
        subCategories={subCategories}
      />
    </div>
  );
}
