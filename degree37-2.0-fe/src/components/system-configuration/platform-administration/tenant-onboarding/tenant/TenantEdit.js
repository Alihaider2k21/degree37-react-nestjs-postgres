import React, { useState, useEffect } from 'react';
// import Cookies from "js-cookie";
import jwt from 'jwt-decode';
import { toast } from 'react-toastify';
import TopBar from '../../../../common/topbar/index';
import { useNavigate, useParams } from 'react-router-dom';
import AddConfigurations from '../../../../common/configuration/configuration';
import CancelIconImage from '../../../../../assets/images/ConfirmCancelIcon.png';
import SuccessPopUpModal from '../../../../common/successModal';
import CancelModalPopUp from '../../../../common/cancelModal';
import FormInput from '../../../../common/form/FormInput';

const loadGoogleMapsScript = (apiKey, mapsLoaded) => {
  if (!mapsLoaded) {
    return new Promise((resolve) => {
      if (!window.google || !window.google.maps) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMaps`;
        script.defer = true;
        script.async = true;
        document.head.appendChild(script);
        window.initGoogleMaps = resolve; // Assign the resolve function to the global scope
      } else {
        resolve();
      }
    });
  } else {
    return Promise.resolve(); // Already loaded, resolve immediately
  }
};

const EditTenant = () => {
  const urlRegex = /^(https?:\/\/)/i;
  // const [responseStatus, setResponseStatus] = useState(false);
  const [showModel, setShowModel] = useState(false);
  const [closeModal, setCloseModal] = useState(false);
  const [close, setClose] = useState(false);
  // const [isArchived, setIsArchived] = useState(false);

  const [addTenant, setAddTenant] = useState({
    allow_donor_minimum_age: '',
    tenant_name: '',
    tenant_domain: '',
    admin_domain: '',
    email: '',
    tenant_code: '',
    phone_number: '',
    tenant_timezone: '',
    is_active: false,
    password: '',
    confirm_password: '',
    address: '',
    address1: '',
    address2: '',
    zip_code: '',
    city: '',
    state: '',
    country: '',
    county: '',
    latitude: '',
    longitude: '',
    allow_email: false,
    address_id: null,
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
  });

  const [errors, setErrors] = useState({
    allow_donor_minimum_age: '',
    tenant_name: '',
    tenant_domain: '',
    admin_domain: '',
    email: '',
    tenant_code: '',
    phone_number: '',
    tenant_timezone: '',
    password: '',
    confirm_password: '',
    address: '',
    address1: '',
    address2: '',
    zip_code: '',
    city: '',
    state: '',
    country: '',
    county: '',
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
  });

  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  // const [redirect, setRedirect] = useState(false);
  const [userId, setUserId] = useState('');
  const [token, setToken] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [applications, setApplications] = useState([]);
  const [selectedAppIds, setSelectedAppIds] = useState([]);
  const jwtToken = localStorage.getItem('token');

  useEffect(() => {
    return () => {
      // Cleanup function to be executed on unmount (optional)
      const apiKey = process.env.REACT_APP_GOOGLE_MAP_API_KEY;
      if (!mapsLoaded) {
        loadGoogleMapsScript(apiKey, mapsLoaded).then(() =>
          setMapsLoaded(true)
        );
      }
    };
  }, []);

  useEffect(() => {
    const getApplications = async () => {
      const result = await fetch(`${BASE_URL}/application`, {
        headers: { authorization: `Bearer ${jwtToken}` },
      });
      const { data } = await result.json();
      const uniqueNamesSet = new Set();
      const uniqueApplications = data.filter((app) => {
        if (!uniqueNamesSet.has(app?.name)) {
          uniqueNamesSet.add(app?.name);
          return true;
        }
        return false;
      });

      // console.log(uniqueApplications);
      setApplications(uniqueApplications);
    };
    getApplications();
  }, []);

  useEffect(() => {
    if (jwtToken) {
      setToken(jwtToken);
      const decodeToken = jwt(jwtToken);
      if (decodeToken?.id) {
        setUserId(decodeToken?.id);
      }
    }

    // Add a cleanup function to remove the event listener when the component is unmounted
    const handleBeforeUnload = (e) => {
      if (unsavedChanges) {
        // Show a generic message to prevent the user from accidentally leaving the page
        e.preventDefault();
        e.returnValue = '';
      }
    };

    const apiKey = process.env.REACT_APP_GOOGLE_MAP_API_KEY;
    if (!window.google || !window.google.maps) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.defer = true;
      script.async = true;
      document.head.appendChild(script);
    }

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [token, unsavedChanges]);

  // const handleCancelClick = () => {
  //   if (unsavedChanges) {
  //     setShowConfirmationDialog(true);
  //   } else {
  //     navigate("/system-configuration/platform-admin/tenant-management");
  //   }
  // };

  const handleConfirmationResult = (confirmed) => {
    setShowConfirmationDialog(false);
    if (confirmed) {
      navigate('/system-configuration/platform-admin/tenant-management');
    }
  };

  const handleCheckboxChange = (appId) => {
    if (selectedAppIds.includes(appId)) {
      setSelectedAppIds(selectedAppIds.filter((id) => id !== appId));
    } else {
      setSelectedAppIds([...selectedAppIds, appId]);
    }
  };

  const handleInputBlur = (e, config_name = null, state_name = null) => {
    setUnsavedChanges(true);
    const { name, value } = e.target;
    let errorMessage = '';

    if (value.trim() === '') {
      errorMessage = 'Required';
    }
    const setError = (fieldName, errorMsg) => {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [fieldName]: errorMsg,
      }));
    };

    switch (name) {
      case 'tenant_name':
        if (value.length > 50) {
          setError(name, 'Maximum 50 characters are allowed');
        } else {
          setError(name, '');
        }
        break;
      case 'tenant_domain':
        if (!value) {
          setError(
            'tenant_domain',
            'Please provide a correct domain, e.g: www.example.com'
          );
        } else if (!urlRegex.test(addTenant.tenant_domain)) {
          setError(
            'tenant_domain',
            'Please provide a correct domain, e.g: www.example.com'
          );
        } else {
          setError('tenant_domain', '');
        }
        break;

      case 'admin_domain':
        if (!value) {
          setError(
            'admin_domain',
            'Please provide a correct domain, e.g: www.example.com'
          );
        } else if (!urlRegex.test(addTenant.admin_domain)) {
          setError(
            'admin_domain',
            'Please provide a correct domain, e.g: www.example.com'
          );
        } else {
          setError('admin_domain', '');
        }
        break;

      case 'password':
        if (value.length < 8) {
          errorMessage = 'Password should be at least 8 characters long.';
        } else if (!/[A-Z]/.test(value)) {
          errorMessage =
            'Password should contain at least one uppercase letter.';
        } else if (!/[a-z]/.test(value)) {
          errorMessage =
            'Password should contain at least one lowercase letter.';
        } else if (!/[0-9]/.test(value)) {
          errorMessage =
            'Password should contain at least one numeric character.';
        } else if (!/[^A-Za-z0-9]/.test(value)) {
          errorMessage =
            'Password should contain at least one special character.';
        }
        setError(name, errorMessage);
        break;

      case 'confirm_password':
        if (!value) {
          setError(
            'confirm_password',
            "Confirm password didn't match with password."
          );
        } else if (addTenant.password !== value) {
          setError(
            'confirm_password',
            "Confirm password didn't match with password."
          );
        } else {
          setError(name, '');
        }
        break;

      case 'phone_number': {
        const regex = /^\(\d{3}\) \d{3}-\d{4}$/;
        const isValidPhoneNumber = regex.test(value);
        if (!value) {
          errorMessage =
            'Please enter a valid phone number in the format (123) 456-7890.';
        } else if (!isValidPhoneNumber) {
          errorMessage =
            'Please enter a valid phone number in the format (123) 456-7890.';
        }
        setError(name, errorMessage);
        break;
      }

      case 'email': {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValidEmail = emailRegex.test(value);
        if (!value) {
          errorMessage =
            'Please enter a valid email address, e.g: mailto:example@example.com';
        } else if (!isValidEmail) {
          errorMessage =
            'Please enter a valid email address, e.g: mailto:example@example.com';
        }
        setError(name, errorMessage);
        break;
      }
      default:
        if (config_name) {
          if (name === 'end_point_url') {
            if (!value) {
              errorMessage =
                'Please provide a correct endpoint URL, e.g: www.example.com';
            } else if (!urlRegex.test(value)) {
              errorMessage =
                'Please provide a correct endpoint URL, e.g: www.example.com';
            } else {
              errorMessage = '';
            }
          }

          setError(config_name, {
            ...errors[config_name],
            [name]: errorMessage,
          });
        } else if (state_name) {
          setError(state_name, errorMessage);
        } else {
          setError(name, errorMessage);
        }
        break;
    }
  };

  const handleFormInput = (e, key, config_name = null) => {
    setUnsavedChanges(true);
    const { value, name } = e.target;
    if (name === 'address' && e.target.value.length >= 3) {
      getPlacePredictions(e.target.value);
      setAddTenant((prevData) => ({
        ...prevData,
        address1: '',
        address2: '',
        city: '',
        zip_code: '',
        state: '',
      }));
    }

    if (config_name) {
      if (config_name === 'bbcs_client_evironment') {
        setAddTenant((prevData) => ({
          ...prevData,
          bbcs_client_evironment: {
            ...prevData.bbcs_client_evironment,
            [key]: value,
          },
        }));
      } else if (config_name === 'google_api') {
        setAddTenant((prevData) => ({
          ...prevData,
          google_api: {
            ...prevData.google_api,
            [key]: value,
          },
        }));
      } else if (config_name === 'daily_story_api') {
        setAddTenant((prevData) => ({
          ...prevData,
          daily_story_api: {
            ...prevData.daily_story_api,
            [key]: value,
          },
        }));
      } else if (config_name === 'quick_pass_api') {
        setAddTenant((prevData) => ({
          ...prevData,
          quick_pass_api: {
            ...prevData.quick_pass_api,
            [key]: value,
          },
        }));
      }
    } else {
      if (key === 'allow_email' || key === 'is_active') {
        setAddTenant((prevData) => ({
          ...prevData,
          [key]: e.target.checked,
        }));
      } else {
        setAddTenant((prevData) => ({
          ...prevData,
          [key]: value,
        }));
      }
    }
  };

  const BASE_URL = process.env.REACT_APP_BASE_URL;
  useEffect(() => {
    const getTenantData = async (id) => {
      const result = await fetch(`${BASE_URL}/tenants/${id}`, {
        headers: { authorization: `Bearer ${jwtToken}` },
      });
      const { data } = await result.json();

      const address = data?.addresses?.[0];
      const addTenantUpdates = {
        tenant_name: data?.tenant_name,
        tenant_domain: data?.tenant_domain,
        admin_domain: data?.admin_domain,
        email: data?.email,
        tenant_code: data?.tenant_code,
        phone_number: data?.phone_number,
        tenant_timezone: data?.tenant_timezone,
        is_active: data?.is_active,
        allow_email: data?.allow_email,
        password: '',
        confirm_password: '',
        address_id: address?.id || null,
        address1: address?.address1 || '',
        address2: address?.address2 || '',
        zip_code: address?.zip_code || '',
        longitude: address?.coordinates?.y,
        latitude: address?.coordinates?.x,
        city: address?.city || '',
        state: address?.state || '',
        country: address?.country || '',
        county: address?.county || '',
        allow_donor_minimum_age: data?.allow_donor_minimum_age || '',
      };

      const configurations = data?.configuration_detail || [];

      configurations.forEach((config) => {
        const { element_name, id, end_point_url, secret_key, secret_value } =
          config;

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

      setSelectedAppIds(data?.applications?.map((app) => app?.id));
    };

    if (id) {
      getTenantData(id);
    }
  }, [id, BASE_URL]);

  const saveChanges = async (e) => {
    await handleSubmitForm(e);
  };

  const saveAndClose = async (e) => {
    await handleSubmitForm(e);
    // setRedirect(true);
    // setShowModel(true)
  };
  // useEffect(() => {
  //   if (redirect === true) {
  //     navigate("/system-configuration/platform-admin/tenant-management");
  //   }
  // }, [redirect === true && responseStatus === true]);

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    const {
      bbcs_client_evironment,
      google_api,
      daily_story_api,
      quick_pass_api,
      tenant_name,
      tenant_domain,
      admin_domain,
      email,
      tenant_code,
      message,
      phone_number,
      tenant_timezone,
      is_active,
      address1,
      address2,
      zip_code,
      city,
      state,
      country,
      county,
      longitude,
      latitude,
      allow_email,
      address_id,
      allow_donor_minimum_age,
    } = addTenant;

    const shouldSendTenantConfig =
      Object.values(bbcs_client_evironment).some((value) => value !== '') ||
      Object.values(google_api).some((value) => value !== '') ||
      Object.values(daily_story_api).some((value) => value !== '') ||
      Object.values(quick_pass_api).some((value) => value !== '');

    const body = {
      tenant_name,
      tenant_domain,
      admin_domain,
      email,
      tenant_code,
      message,
      phone_number,
      tenant_timezone,
      is_active,
      address1,
      address2,
      address_id,
      zip_code,
      city,
      state,
      country,
      county,
      allow_donor_minimum_age: +allow_donor_minimum_age,
      coordinates: { latitude: latitude, longitude: longitude },
      // created_by: +userId,
      updated_by: +userId,
      allow_email,
      applications: selectedAppIds.map((strNumber) => parseInt(strNumber)),
      ...(shouldSendTenantConfig && {
        tenant_config: [
          // Only add those objects that have at least one key with a value
          ...(Object.values(bbcs_client_evironment).some(
            (value) => value !== ''
          )
            ? [
                {
                  ...bbcs_client_evironment,
                  // created_by: +userId,
                  updated_by: +userId,
                  element_name: 'bbcs_client_evironment',
                },
              ]
            : []),
          ...(Object.values(google_api).some((value) => value !== '')
            ? [
                {
                  ...google_api,
                  // created_by: +userId,
                  updated_by: +userId,
                  element_name: 'google_api',
                },
              ]
            : []),
          ...(Object.values(daily_story_api).some((value) => value !== '')
            ? [
                {
                  ...daily_story_api,
                  // created_by: +userId,
                  updated_by: +userId,
                  element_name: 'daily_story_api',
                },
              ]
            : []),
          ...(Object.values(quick_pass_api).some((value) => value !== '')
            ? [
                {
                  ...quick_pass_api,
                  // created_by: +userId,
                  updated_by: +userId,
                  element_name: 'quick_pass_api',
                },
              ]
            : []),
        ],
      }),
    };

    try {
      const response = await fetch(`${BASE_URL}/tenants/${id}/edit`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(body),
      });
      let data = await response.json();
      if (data?.status === 'success') {
        // setModalPopUp(true);
        //  data = await response.json();
        // Handle successful response
        // toast.success(`Tenant updated.`, { autoClose: 3000 });
        setShowModel(true);
        // setResponseStatus(true);
      } else if (data?.statusCode === 404) {
        // setModalPopUp(false);
        // const error = await response.json();
        const showMessage = Array.isArray(data?.message)
          ? data?.message[0]
          : data?.message;

        toast.error(`${showMessage}`, { autoClose: 3000 });
        // toast.error(`${data?.message}`, { autoClose: 3000 });
        // Handle bad request
      } else {
        const showMessage = Array.isArray(data?.message)
          ? data?.message[0]
          : data?.message;

        toast.error(`${showMessage}`, { autoClose: 3000 });
      }
    } catch (error) {
      const showMessage = Array.isArray(error?.message)
        ? error?.message[0]
        : error?.message;
      toast.error(`${showMessage}`, { autoClose: 3000 });
    }
  };

  let isDisabled =
    addTenant.tenant_name &&
    addTenant.tenant_domain &&
    addTenant.admin_domain &&
    addTenant.email &&
    addTenant.tenant_code &&
    addTenant.phone_number &&
    addTenant.tenant_timezone &&
    addTenant.address1 &&
    addTenant.zip_code &&
    addTenant.city &&
    addTenant.state &&
    !errors.tenant_name &&
    !errors.tenant_domain &&
    !errors.admin_domain &&
    !errors.email &&
    !errors.tenant_code &&
    !errors.phone_number &&
    !errors.tenant_timezone &&
    !errors.address1 &&
    !errors.zip_code &&
    !errors.city &&
    !errors.state;

  isDisabled = Boolean(isDisabled);

  const BreadcrumbsData = [
    { label: 'Dashboard', class: 'disable-label', link: '/dashboard' },
    {
      label: 'Tenant Management',
      class: 'disable-label',
      link: '/system-configuration/platform-admin/tenant-management',
    },
    {
      label: 'Edit Tenant',
      class: 'disable-label',
      link: `/system-configuration/platform-admin/tenant-management/${id}/edit`,
    },
  ];

  const [predictions, setPredictions] = useState([]);
  const getPlacePredictions = (input) => {
    const autocompleteService =
      new window.google.maps.places.AutocompleteService();
    autocompleteService.getPlacePredictions(
      {
        input,
        componentRestrictions: { country: 'US' }, // Limit results to the United States
      },
      (predictions, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setPredictions(predictions);
        } else {
          setPredictions([]);
        }
      }
    );
  };

  const getPlaceDetails = (address) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: address }, (results, status) => {
      if (status === window.google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          const place = results[0];
          setAddTenant((prevData) => {
            const city = getAddressComponent(place, 'locality');
            const county = getAddressComponent(
              place,
              'administrative_area_level_2'
            );
            return {
              ...prevData,
              address1: getAddressComponent(place, 'street_number'),
              address2: getAddressComponent(place, 'route'),
              zip_code: getAddressComponent(place, 'postal_code'),
              city: city || county,
              state: getAddressComponent(place, 'administrative_area_level_1'),
              county: county,
              country: getAddressComponent(place, 'country'),
              latitude: place.geometry.location.lat().toString(),
              longitude: place.geometry.location.lng().toString(),
            };
          });
          setAddTenant((prevData) => {
            const route = getAddressComponent(place, 'route');
            return {
              ...prevData,
              address2: route,
            };
          });
        }
      }
    });
  };

  const getAddressComponent = (place, type) => {
    const addressComponent = place.address_components.find((component) =>
      component.types.includes(type)
    );
    return addressComponent ? addressComponent.long_name : '';
  };

  const handlePredictionClick = (prediction) => {
    setAddTenant((prevData) => ({
      ...prevData,
      address: prediction.description,
    }));

    getPlaceDetails(prediction.description);
    setPredictions([]);
  };
  function handleKeyPress(event) {
    if (event.key === 'Enter') {
      getPlaceDetails();
    }
  }
  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Tenants Onboarding'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />
      {showModel === true && close === true ? (
        <SuccessPopUpModal
          title="Success!"
          message="Role updated."
          modalPopUp={showModel}
          isNavigate={true}
          setModalPopUp={setShowModel}
          showActionBtns={true}
          redirectPath={
            '/system-configuration/platform-admin/tenant-management'
          }
        />
      ) : null}
      {showModel === true && close === false ? (
        <SuccessPopUpModal
          title="Success!"
          message="Tenant updated."
          modalPopUp={showModel}
          isNavigate={true}
          setModalPopUp={setShowModel}
          showActionBtns={true}
          // redirectPath={'/system-configuration/platform-admin/roles-admin'}
        />
      ) : null}
      {/* {isArchived === true ? (
        <SuccessPopUpModal
          title="Success!"
          message="Role is archived."
          modalPopUp={showModel}
          isNavigate={true}
          setModalPopUp={setShowModel}
          showActionBtns={true}
          redirectPath={"/system-configuration/platform-admin/roles-admin"}
        />
      ) : null} */}
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
      <div className="mainContentInner form-container">
        <form className="addTenant formGroup">
          <div className="formGroup">
            <h5>Edit Tenant</h5>
            <div className="form-field">
              <div className="field">
                <input
                  type="text"
                  className="form-control"
                  value={addTenant.tenant_name}
                  name="tenant_name"
                  onBlur={handleInputBlur}
                  placeholder=" "
                  onChange={(e) => {
                    handleFormInput(e, 'tenant_name');
                  }}
                  required
                />

                <label>Tenant Name*</label>
              </div>
              {errors.tenant_name && (
                <div className="error">
                  <div className="error">
                    <p>{errors.tenant_name}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="form-field">
              <div className="field">
                <input
                  type="text"
                  className="form-control"
                  placeholder=" "
                  value={addTenant.tenant_domain}
                  name="tenant_domain"
                  onBlur={handleInputBlur}
                  onChange={(e) => {
                    // const inputValue = e.target.value;
                    handleFormInput(e, 'tenant_domain');
                  }}
                  required
                />
                <label>Tenant Domain*</label>
              </div>
              {errors.tenant_domain && (
                <div className="error">
                  <p>{errors.tenant_domain}</p>
                </div>
              )}
            </div>
            <div className="form-field">
              <div className="field">
                <input
                  type="email"
                  className="form-control"
                  placeholder=" "
                  value={addTenant.admin_domain}
                  name="admin_domain"
                  onBlur={handleInputBlur}
                  required
                  onChange={(e) => {
                    handleFormInput(e, 'admin_domain');
                  }}
                />
                <label>Admin Domain*</label>
              </div>
              {errors.admin_domain && (
                <div className="error">
                  <p>{errors.admin_domain}</p>
                </div>
              )}
            </div>
            <div className="form-field">
              <div className="field">
                <input
                  type="email"
                  className="form-control"
                  placeholder=" "
                  value={addTenant.email}
                  name="email"
                  onBlur={handleInputBlur}
                  required
                  disabled
                  onChange={(e) => {
                    handleFormInput(e, 'email');
                  }}
                />
                <label>Email*</label>
              </div>
              {errors.email && (
                <div className="error">
                  <p>{errors.email}</p>
                </div>
              )}
            </div>
            <div className="form-field">
              <div className="field">
                <input
                  type="email"
                  className="form-control"
                  placeholder=" "
                  value={addTenant.tenant_code}
                  name="tenant_code"
                  onBlur={handleInputBlur}
                  required
                  onChange={(e) => {
                    handleFormInput(e, 'tenant_code');
                  }}
                />
                <label>Tenant Code*</label>
              </div>
              {errors.tenant_code && (
                <div className="error">
                  <p>{errors.tenant_code}</p>
                </div>
              )}
            </div>
            <div className="form-field">
              <FormInput
                classes={{ root: 'w-100 mb-0' }}
                label="Phone Number*"
                name="phone_number"
                variant="phone"
                displayName="Phone Number*"
                value={addTenant.phone_number}
                onChange={(e) => {
                  handleFormInput(e, 'phone_number');
                  handleInputBlur(e);
                }}
                error={errors.phone_number}
                required={false}
                onBlur={handleInputBlur}
              />
            </div>
            <div className="form-field w-100">
              <div className="field">
                <input
                  type="text"
                  className="form-control"
                  placeholder=" "
                  value={addTenant.address}
                  name="address"
                  // onBlur={handleInputBlur}
                  required
                  onChange={(e) => {
                    handleFormInput(e, 'address');
                  }}
                  onKeyDown={handleKeyPress}
                />
                <label>Select Location</label>
              </div>
              <ul className="list-group">
                {predictions.map((prediction) => (
                  <li
                    key={prediction.place_id}
                    onClick={() => handlePredictionClick(prediction)}
                    className="list-group-item bg-light text-dark small border-0"
                    style={{ cursor: 'pointer' }}
                  >
                    {prediction.description}
                  </li>
                ))}
              </ul>
            </div>
            <div className="form-field">
              <div className="field">
                <input
                  type="text"
                  className="form-control"
                  placeholder=" "
                  value={addTenant.address1}
                  name="address1"
                  onBlur={handleInputBlur}
                  required
                  onChange={(e) => {
                    handleFormInput(e, 'address1');
                  }}
                />
                <label>Address Line 1*</label>
              </div>
              {errors.address1 && (
                <div className="error">
                  <p>{errors.address1}</p>
                </div>
              )}
            </div>
            <div className="form-field">
              <div className="field">
                <input
                  type="text"
                  className="form-control"
                  placeholder=" "
                  value={addTenant.address2}
                  required
                  name="address2"
                  onChange={(e) => {
                    handleFormInput(e, 'address2');
                  }}
                />
                <label>Address Line 2</label>
              </div>
            </div>
            <div className="form-field">
              <div className="field">
                <input
                  type="text"
                  className="form-control"
                  placeholder=" "
                  defaultValue={addTenant.zip_code}
                  // readOnly
                  name="zip_code"
                  onBlur={handleInputBlur}
                  onChange={(e) => {
                    handleFormInput(e, 'zip_code');
                    handleInputBlur(e);
                  }}
                  // readOnly
                  required
                />
                <label>Zip Code*</label>
              </div>
              {errors.zip_code && (
                <div className="error">
                  <p>{errors.zip_code}</p>
                </div>
              )}
            </div>
            <div className="form-field">
              <div className="field">
                <input
                  type="text"
                  className="form-control"
                  placeholder=" "
                  defaultValue={addTenant.city}
                  // readOnly
                  required
                  name="city"
                  onBlur={handleInputBlur}
                  onChange={(e) => {
                    handleFormInput(e, 'city');
                    handleInputBlur(e);
                  }}
                  // disabled
                />
                <label>City*</label>
                {errors.city && (
                  <div className="error">
                    <p>{errors.city}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="form-field">
              <div className="field">
                <input
                  type="text"
                  className="form-control"
                  placeholder=" "
                  defaultValue={addTenant.state}
                  // readOnly
                  required
                  onBlur={handleInputBlur}
                  onChange={(e) => {
                    handleFormInput(e, 'state');
                    handleInputBlur(e);
                  }}
                  name="state"
                  // disabled
                />
                <label>State*</label>
                {errors.state && (
                  <div className="error">
                    <p>{errors.state}</p>
                  </div>
                )}
              </div>
            </div>
            <input
              hidden
              type="text"
              defaultValue={addTenant.longitude}
              readOnly
              name="longitude"
            />
            <input
              hidden
              type="text"
              defaultValue={addTenant.latitude}
              readOnly
              name="latitude"
            />
            <input
              hidden
              type="text"
              defaultValue={addTenant.country}
              readOnly
              name="country"
            />
            <input
              hidden
              type="text"
              defaultValue={addTenant.county}
              name="county"
              readOnly
            />
            <div className="form-field">
              <div className="field d-flex">
                <label
                  style={
                    addTenant.tenant_timezone !== ''
                      ? { display: 'none' }
                      : { display: '' }
                  }
                >
                  Select Time Zone*
                </label>
                <select
                  className="form-select bg-white"
                  value={addTenant.tenant_timezone}
                  onBlur={(e) => handleInputBlur(e, null, 'tenant_timezone')}
                  onChange={(e) => {
                    handleFormInput(e, 'tenant_timezone');
                  }}
                  required
                >
                  <option value="" disabled>
                    Select a Timezone
                  </option>
                  <option value="UTC-5">Eastern Standard Time (EST)</option>
                  <option value="UTC-4">Eastern Daylight Time (EDT)</option>
                  <option value="UTC-6">Central Standard Time (CST)</option>
                  <option value="UTC-5">Central Daylight Time (CDT)</option>
                  <option value="UTC-7">Mountain Standard Time (MST)</option>
                  <option value="UTC-6">Mountain Daylight Time (MDT)</option>
                  <option value="UTC-8">Pacific Standard Time (PST)</option>
                  <option value="UTC-7">Pacific Daylight Time (PDT)</option>
                  <option value="UTC-9">Alaska Standard Time (AKST)</option>
                  <option value="UTC-8">Alaska Daylight Time (AKDT)</option>
                  <option value="UTC-10">
                    Hawaii-Aleutian Standard Time (HAST)
                  </option>
                  <option value="UTC-9">
                    Hawaii-Aleutian Daylight Time (HADT)
                  </option>
                  <option value="UTC-11">Samoa Standard Time (SST)</option>
                  <option value="UTC+13">Samoa Daylight Time (SDT)</option>
                  <option value="UTC-4">Atlantic standard Time (AST)</option>
                </select>
              </div>
              {errors.tenant_timezone && (
                <div className="error">
                  <p>{errors.tenant_timezone}</p>
                </div>
              )}
            </div>
            <div className="form-field">
              <div className="field">
                <input
                  type="number"
                  min={0}
                  className="form-control"
                  placeholder=" "
                  defaultValue={addTenant.allow_donor_minimum_age}
                  value={addTenant.allow_donor_minimum_age}
                  autoComplete="off"
                  required
                  name="allow_donor_minimum_age"
                  onBlur={handleInputBlur}
                  onChange={(e) => {
                    handleFormInput(e, 'allow_donor_minimum_age');
                    handleInputBlur(e);
                  }}
                />
                <label>Donor minimum age</label>
              </div>
              {errors.allow_donor_minimum_age && (
                <div className="error">
                  <p>{errors.allow_donor_minimum_age}</p>
                </div>
              )}
            </div>
            <div className="form-field checkbox w-100">
              <span className="toggle-text">
                {addTenant.is_active ? 'Active' : 'Inactive'}
              </span>
              <label htmlFor="toggle" className="switch">
                <input
                  type="checkbox"
                  id="toggle"
                  className="toggle-input"
                  checked={addTenant.is_active}
                  name="is_active"
                  onChange={(e) => {
                    handleFormInput(e, 'is_active');
                  }}
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
          <div className="formGroup">
            <h5>Product Licensing*</h5>
            {applications?.length
              ? applications?.map((app, index) => {
                  return (
                    <div className="form-field checkbox" key={index}>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value={app.id}
                        id={`flexCheckDefault${app?.id}`}
                        checked={selectedAppIds?.includes(app.id)}
                        onChange={() => handleCheckboxChange(app.id)}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="flexCheckDefault"
                      >
                        {app?.name === 'CRM'
                          ? 'Client Relationship Manager - CRM'
                          : app?.name}
                      </label>
                    </div>
                  );
                })
              : ''}
          </div>
          <AddConfigurations
            viewEdit={false}
            addTenant={addTenant}
            setAddTenant={setAddTenant}
          />
        </form>

        <section
          className={`popup full-section ${
            showConfirmationDialog ? 'active' : ''
          }`}
        >
          <div className="popup-inner">
            <div className="icon">
              <img src={CancelIconImage} alt="CancelIcon" />
            </div>
            <div className="content">
              <h3>Confirmation</h3>
              <p>Unsaved changes will be lost. Do you want to continue?</p>
              <div className="buttons">
                <button
                  className="btn btn-secondary"
                  onClick={() => handleConfirmationResult(false)}
                >
                  No
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => handleConfirmationResult(true)}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className="form-footer">
          <button
            className="btn btn-secondary"
            onClick={() => {
              setCloseModal(true);
            }}
          >
            Cancel
          </button>

          <button
            type="button"
            className={` ${
              !isDisabled ? `btn btn-secondary` : `btn btn-primary`
            }`}
            onClick={saveChanges}
            disabled={!isDisabled}
          >
            Save Changes
          </button>

          <button
            type="button"
            className={` ${
              !isDisabled ? `btn btn-secondary` : `btn btn-primary`
            }`}
            onClick={(e) => {
              saveAndClose(e);
              setClose(true);
            }}
            disabled={!isDisabled}
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTenant;
