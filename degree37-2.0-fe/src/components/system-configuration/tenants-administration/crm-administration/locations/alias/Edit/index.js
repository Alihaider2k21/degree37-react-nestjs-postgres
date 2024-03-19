import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import TopBar from '../../../../../../common/topbar/index';
import FilterTab from '../components/FilterTab';
import AliasForm from '../components/AliasForm';
import SuccessPopUpModal from '../../../../../../common/successModal';
import CancelModalPopUp from '../../../../../../common/cancelModal';

const TabNavigation = [
  {
    link: '#',
    title: 'Room Sizes',
  },
  {
    link: '#',
    title: 'Attachment Categories',
  },
  {
    link: '#',
    title: 'Attachment Subcategories',
  },
  {
    link: '#',
    title: 'Note Categories',
  },
  {
    link: '#',
    title: 'Note Subcategories',
  },
];

function HandleError(text) {
  if (!text || text === '') {
    return 'Alias name is required';
  }
  if (text?.length < 3) {
    return 'Alias name should be atleast 3 characters longer';
  }
  if (text?.length > 50) {
    return 'Maximum 50 characters are allowed';
  }
  return null;
}

const AliasEditCreate = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const bearerToken = localStorage.getItem('token');
  /* states */
  const { state } = useLocation();
  const [searchText, setSearchText] = useState('');
  const [showModel, setShowModel] = useState(false);
  const [error, setError] = useState();
  const [alias, setAlias] = useState();
  const [closeModal, setCloseModal] = useState(false);
  const BreadcrumbsData = [
    {
      label: 'System Configurations',
      class: 'disable-label',
      link: '#',
    },
    {
      label: 'CRM Administration',
      class: 'disable-label',
      link: '#',
    },
    {
      label: 'Location',
      class: 'disable-label',
      link: '#',
    },
    {
      label: 'Set Alias',
      class: 'active-label',
      link: '/system-configuration/tenant-admin/crm-admin/locations/alias/edit',
    },
  ];

  const searchFieldChange = (e) => {
    setSearchText(e.target.value);
  };

  if (searchText) {
    console.log(searchText);
  }

  const handleChange = (e) => {
    setError();
    setAlias({
      ...alias,
      text: e.target.value,
    });
  };

  const postData = async () => {
    try {
      const body = {
        text: alias?.text,
        type: 'LOCATION',
      };
      let response = await fetch(`${BASE_URL}/crm-admin/alias`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${bearerToken}`,
        },
        body: JSON.stringify(body),
      });
      response = await response.json();
      if (response?.status_code === 201) {
        setShowModel(true);
      }
    } catch (error) {
      toast.error(`${error?.message}`, { autoClose: 3000 });
    }
  };

  const handleSubmit = () => {
    const errorMessage = HandleError(alias?.text);
    if (errorMessage) {
      setError(errorMessage);
    } else {
      postData();
    }
  };

  useEffect(() => {
    if (state && state?.alias) {
      setAlias(state?.alias);
    }
  }, [state]);

  return (
    <>
      <div className="mainContent">
        <TopBar
          BreadCrumbsData={BreadcrumbsData}
          BreadCrumbsTitle={'Alias'}
          SearchPlaceholder={'Search'}
          SearchValue={null}
          SearchOnChange={searchFieldChange}
        />
        {/* filter bar */}
        <FilterTab navLinks={TabNavigation} />
        {/* Alias Form */}
        <AliasForm
          isEdit={true}
          value={alias?.text}
          handleChange={handleChange}
          error={error}
        />
        <div className="form-footer">
          <button
            className="btn btn-secondary"
            onClick={() => setCloseModal(true)}
          >
            Cancel
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => handleSubmit()}
          >
            Save
          </button>
        </div>
      </div>
      <CancelModalPopUp
        title="Confirmation"
        message="Unsaved changes will be lost, do you wish to proceed?"
        modalPopUp={closeModal}
        isNavigate={true}
        setModalPopUp={setCloseModal}
        redirectPath={
          '/system-configuration/tenant-admin/crm-admin/locations/alias'
        }
      />
      <SuccessPopUpModal
        title="Success!"
        message="Alias set."
        modalPopUp={showModel}
        isNavigate={true}
        setModalPopUp={setShowModel}
        showActionBtns={true}
        redirectPath={
          '/system-configuration/tenant-admin/crm-admin/locations/alias'
        }
      />
    </>
  );
};

export default AliasEditCreate;
