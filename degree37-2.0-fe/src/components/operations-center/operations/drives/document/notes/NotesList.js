import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { API } from '../../../../../../api/api-routes';
import LocationNotes from '../../../../../../assets/images/LocationNotes.png';
import ListNotes from '../../../../../common/DocumentComponent/Notes/ListNotes.js';
import TopBar from '../../../../../common/topbar/index';

import './index.scss';
import DriveNavigationTabs from '../../navigationTabs';
import NavigationTopBar from '../../../../../common/NavigationTopBar';
import { makeAuthorizedApiRequest } from '../../../../../../helpers/Api';

export default function NotesList() {
  const [search, setSearch] = useState('');
  const { id } = useParams();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [driveData, setDriveData] = useState(null);
  const BreadcrumbsData = [
    { label: 'Operations Center', class: 'disable-label', link: '/' },
    {
      label: 'Operations',
      class: 'disable-label',
      link: '/operations-center/operations/drives',
    },
    {
      label: 'Drives',
      class: 'disable-label',
      link: '/operations-center/operations/drives',
    },
    {
      label: 'View Drive',
      class: 'disable-label',
      link: `/operations-center/operations/drives/${id}/view/about`,
    },
    {
      label: 'Documents',
      class: 'disable-label',
      link: `/operations-center/operations/drives/${id}/view/documents/notes`,
    },

    {
      label: 'Notes',
      class: 'active-label',
      link: '#',
    },
  ];

  const getDriveData = async (id) => {
    const result = await makeAuthorizedApiRequest(
      'GET',
      `${BASE_URL}/drives/${id}`
    );
    const { data } = await result.json();
    data[0] ? setDriveData(data[0]) : setDriveData(null);
  };

  console.log({ driveData });

  useEffect(() => {
    getDriveData(id);
  }, []);
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
        SearchValue={search}
        SearchOnChange={searchFieldChange}
        SearchPlaceholder={'Search'}
      />
      <div className="imageMainContent">
        <NavigationTopBar img={LocationNotes} data={driveData} />
        <DriveNavigationTabs />
      </div>
      <ListNotes
        search={search}
        notesListPath={`/operations-center/operations/drives/${id}/view/documents/notes`}
        attachmentsListPath={`/operations-center/operations/drives/${id}/view/documents/attachments`}
        addNotesLink={`/operations-center/operations/drives/${id}/view/documents/notes/create`}
        noteable_type={'drives'}
        categories={categories}
        subCategories={subCategories}
      />
    </div>
  );
}
