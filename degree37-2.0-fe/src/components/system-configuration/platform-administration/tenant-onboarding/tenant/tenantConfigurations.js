import React, { useState, useEffect } from 'react';
import jwt from 'jwt-decode';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import TopBar from '../../../../common/topbar/index';
import AddConfigurations from '../../../../common/configuration/configuration';
import CancelModalPopUp from '../../../../common/cancelModal';
import SuccessPopUpModal from '../../../../common/successModal';
import axios from 'axios';

const AddTenantConfigurations = () => {
  const { tid } = useParams();
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const [showModel, setShowModel] = useState(false);
  const [closeModal, setCloseModal] = useState(false);

  const [addTenant, setAddTenant] = useState({
    bbcs_client_evironment: {
      element_name: '',
      end_point_url: '',
      secret_key: '',
      secret_value: '',
    },
    google_api: {
      element_name: '',
      end_point_url: '',
      secret_key: '',
      secret_value: '',
    },
    daily_story_api: {
      element_name: '',
      end_point_url: '',
      secret_key: '',
      secret_value: '',
    },
    quick_pass_api: {
      element_name: '',
      end_point_url: '',
      secret_key: '',
      secret_value: '',
    },
    allow_email: false,
    tenant_name: '',
  });

  const [id, setId] = useState('');
  const jwtToken = localStorage.getItem('token');

  useEffect(() => {
    if (jwtToken) {
      // setToken(jwtToken);
      const decodeToken = jwt(jwtToken);
      if (decodeToken?.id) {
        setId(decodeToken?.id);
      }
    }
    const getData = async (id) => {
      if (id) {
        const result = await axios.get(`${BASE_URL}/tenants/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        let { data, status, status_code } = await result.data;
        if ((status === 'success', status_code === 200)) {
          const responseData = data;
          const addTenantUpdates = {
            tenant_name: responseData?.tenant_name,
            allow_email: responseData?.allow_email,
          };

          const configurations = responseData?.configuration_detail || [];

          configurations.forEach((config) => {
            const {
              element_name,
              id,
              end_point_url,
              secret_key,
              secret_value,
            } = config;

            addTenantUpdates[element_name] = {
              element_name,
              id,
              end_point_url,
              secret_key: secret_key,
              secret_value: secret_value,
            };
          });

          setAddTenant((prevState) => ({
            ...prevState,
            ...addTenantUpdates,
          }));
        } else {
          toast.error('Error Fetching Tenant Details', { autoClose: 3000 });
        }
      } else {
        toast.error('Error getting Tenant Details', { autoClose: 3000 });
      }
    };

    if (tid) {
      getData(tid);
    }
  }, [tid, BASE_URL]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      bbcs_client_evironment,
      google_api,
      daily_story_api,
      quick_pass_api,
      tenant_name,
      allow_email,
    } = addTenant;

    const shouldSendTenantConfig =
      Object.values(bbcs_client_evironment).some((value) => value !== '') ||
      Object.values(google_api).some((value) => value !== '') ||
      Object.values(daily_story_api).some((value) => value !== '') ||
      Object.values(quick_pass_api).some((value) => value !== '');

    const body = {
      tenant_name,
      created_by: +id,
      allow_email: allow_email ?? false,
      ...(shouldSendTenantConfig && {
        configuration_detail: [
          // Only add those objects that have at least one key with a value
          ...(Object.values(bbcs_client_evironment).some(
            (value) => value !== ''
          )
            ? [
                {
                  ...bbcs_client_evironment,
                  created_by: +id,
                  element_name: 'bbcs_client_evironment',
                },
              ]
            : []),
          ...(Object.values(google_api).some((value) => value !== '')
            ? [{ ...google_api, created_by: +id, element_name: 'google_api' }]
            : []),
          ...(Object.values(daily_story_api).some((value) => value !== '')
            ? [
                {
                  ...daily_story_api,
                  created_by: +id,
                  element_name: 'daily_story_api',
                },
              ]
            : []),
          ...(Object.values(quick_pass_api).some((value) => value !== '')
            ? [
                {
                  ...quick_pass_api,
                  created_by: +id,
                  element_name: 'quick_pass_api',
                },
              ]
            : []),
        ],
      }),
    };

    try {
      let response = await axios.put(
        `${BASE_URL}/tenants/${tid}/configurations`,
        body,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      response = await response.data;
      if (
        response?.status == 200 ||
        response?.status == 204 ||
        response?.status === 'success'
      ) {
        setShowModel(true);
        // Handle successful response
        // toast.success(`Tenant Configurations Saved.`, {
        //   autoClose: 3000,
        // });
        // window.location.reload();
      } else if (response.status === 400) {
        const error = await response?.data;
        toast.error(`${error?.message}`, { autoClose: 3000 });
        // Handle bad request
      } else {
        const error = await response?.data;
        toast.error(`${error?.message}`, { autoClose: 3000 });
      }
    } catch (error) {
      toast.error(`${error?.message}`, { autoClose: 3000 });
    }
  };

  const BreadcrumbsData = [
    { label: 'Dashboard', class: 'disable-label', link: '/dashboard' },
    {
      label: 'Tenant Management',
      class: 'disable-label',
      link: '/system-configuration/platform-admin/tenant-management',
    },
    {
      label: 'Add Configurations',
      class: 'disable-label',
      link: `/system-configuration/platform-admin/tenant-management/${id}/configuration`,
    },
  ];
  return (
    <div className="mainContent">
      {showModel === true ? (
        <SuccessPopUpModal
          title="Success!"
          message="Tenant Configuration added."
          modalPopUp={showModel}
          isNavigate={true}
          setModalPopUp={setShowModel}
          showActionBtns={true}
          redirectPath={
            '/system-configuration/platform-admin/tenant-management'
          }
        />
      ) : null}
      {closeModal === true ? (
        <CancelModalPopUp
          title="Confirmation"
          message="Unsaved changes will be lost, do you wish to proceed?"
          modalPopUp={closeModal}
          isNavigate={true}
          setModalPopUp={setCloseModal}
          redirectPath={
            '/system-configuration/platform-admin/tenant-management'
          }
        />
      ) : null}
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Tenants Onboarding'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />
      <div className="mainContentInner">
        <form className="addTenant">
          <AddConfigurations
            viewEdit={true}
            addTenant={addTenant}
            setAddTenant={setAddTenant}
          />
        </form>
        <div className="form-footer">
          <button
            className="btn btn-secondary"
            onClick={() => setCloseModal(true)}
          >
            Cancel
          </button>

          <button
            type="button"
            className={`btn btn-primary`}
            onClick={handleSubmit}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTenantConfigurations;
