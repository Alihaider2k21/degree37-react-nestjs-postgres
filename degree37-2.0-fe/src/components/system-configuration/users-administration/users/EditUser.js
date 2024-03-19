import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import styles from './index.module.scss';
import FormInput from './FormInput';
import Topbar from '../../../common/topbar/index';
import { toast } from 'react-toastify';
import jwt from 'jwt-decode';
import moment from 'moment';
import SuccessPopUpModal from '../../../common/successModal';
import SuccessPopUpModalWONavigate from '../../../common/successModal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import SelectDropdown from '../../../common/selectDropdown';

const errorIniitialState = {
  first_name: '',
  last_name: '',
  email: '',
  is_active: '',
};

const userInitialState = {
  first_name: '',
  last_name: '',
  unique_identifier: '',
  email: '',
  gender: '',
  home_phone_number: '',
  work_phone_number: '',
  work_phone_extension: '',
  address: '',
  address_line_1: '',
  address_line_2: '',
  zip_code: '',
  city: '',
  state: '',
  is_active: true,
};

function isEmpty(value) {
  return value === '' || value === null || value === undefined;
}

const EditUser = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  console.log({ setSearchParams });

  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [roles, setRoles] = useState();
  const [tenantAdminEdit] = useState(searchParams.get('tenant'));
  const [predictions, setPredictions] = useState([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [user, setUser] = useState(userInitialState);
  const [errors, setErrors] = useState(errorIniitialState);
  const [changesMade, setChangesMade] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [updatedById, setUpdatedById] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState();
  const [showModalWitoutNavigate, setShowModalWitoutNavigate] = useState();
  const [archiveModal, setArchiveModal] = useState(false);
  const [showShowArchiveMessage, setShowArchiveMessage] = useState(false);
  const [selectedRole, setSelectedRole] = useState();
  const [gender, setGender] = useState('');
  const [roleError, setRoleError] = useState();
  const bearerToken = localStorage.getItem('token');
  const [tenantId, setTenantId] = useState('');
  const [existingTenant, setExistingTenant] = useState(null);
  const [tenantPopup, setTenantPopup] = useState(false);
  const [existingTenantRole, setExistingTenantRole] = useState();
  const [saveAndClose, setSaveAndClose] = useState(false);

  const getExistingTenant = async (tenantID) => {
    const result = await fetch(
      `${BASE_URL}/tenant-users?tenant_id=${tenantID}&limit=1000`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${bearerToken}`,
        },
      }
    );
    const data = await result.json();
    data.data.forEach((item) => {
      if (item.is_auto_created) {
        setExistingTenantRole({
          label: item.role.name,
          id: item.role.id,
        });
        setExistingTenant(item);
      }
    });
  };

  const handleConfirmArchive = async () => {
    const body = {
      is_archived: true,
      updated_by: updatedById,
    };
    const response = await fetch(`${BASE_URL}/user/archive/${user?.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${bearerToken}`,
      },
      body: JSON.stringify(body),
    });

    if (response.status === 404) {
      toast.error('User not found.');
      return;
    }
    if (response.status === 204) {
      setArchiveModal(false);
      setShowArchiveMessage(true);
      return;
    } else toast.error('Something went wrong.');
  };

  const getRolesDropdown = async () => {
    try {
      const result = await fetch(
        `${BASE_URL}/roles?limit=10000&tenant_id=${tenantId}`,
        {
          method: 'GET',
          headers: { authorization: `Bearer ${bearerToken}` },
        }
      );
      const data = await result.json();

      let formatRoles = data?.data?.map((role) => ({
        label: role?.name,
        value: role?.id,
      }));
      setRoles(formatRoles);
    } catch (error) {
      console.error('Error searching data:', error);
    }
  };

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
          setUser((prevData) => {
            const city = getAddressComponent(place, 'locality');
            const county = getAddressComponent(
              place,
              'administrative_area_level_2'
            );

            return {
              ...prevData,
              address_line_1: getAddressComponent(place, 'street_number'),
              address_line_2: getAddressComponent(place, 'route'),
              zip_code: getAddressComponent(place, 'postal_code'),
              city: city || county,
              state: getAddressComponent(place, 'administrative_area_level_1'),
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
    setUser((prevData) => ({
      ...prevData,
      address: prediction.description,
    }));
    getPlaceDetails(prediction.description);
    setPredictions([]);
  };

  useEffect(() => {
    const getData = async (id) => {
      if (id) {
        const result = await fetch(`${BASE_URL}/user/${id}`, {
          headers: { authorization: `Bearer ${bearerToken}` },
        });
        if (result?.status === 200) {
          let { data } = await result.json();

          await getRolesDropdown();
          setUser({
            ...data,
          });
          if (data?.date_of_birth) {
            setDateOfBirth(new Date(data?.date_of_birth));
          }
          if (data?.gender) {
            setGender({ value: data?.gender, label: data?.gender });
          }
          setTenantId(data?.tenant?.id);
          if (data?.role?.id && data?.role?.name) {
            setSelectedRole({
              value: data?.role?.id,
              label: data?.role?.name,
              tenantAdminRole: data?.role?.is_auto_created,
            });
          }

          getExistingTenant(data?.tenant?.id);
        } else {
          toast.error('Error Fetching User Details', { autoClose: 3000 });
        }
      } else {
        toast.error('Error getting user Details', { autoClose: 3000 });
      }
    };
    if (id) {
      getData(id);
    }
  }, [id, BASE_URL, tenantId]);

  useEffect(() => {
    const apiKey = process.env.REACT_APP_GOOGLE_MAP_API_KEY;
    if (!window.google || !window.google.maps) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.defer = true;
      script.async = true;
      document.head.appendChild(script);
    }
    const jwtToken = localStorage.getItem('token');
    if (jwtToken) {
      const decodeToken = jwt(jwtToken);
      if (decodeToken?.id) {
        setUpdatedById(decodeToken?.id);
      }
    }
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setChangesMade(true);
    if (
      [
        'home_phone_number',
        'work_phone_number',
        'work_phone_extension',
      ].includes(name)
    ) {
      setUser({ ...user, [name]: value.slice(0, 15) });
      return;
    }
    setUser({ ...user, [name]: value });
  };

  const handleCheckboxChange = (event) => {
    setUser({ ...user, is_active: event.target.checked });
    setChangesMade(true);
  };

  const handleFormInput = (e, key) => {
    const { value } = e.target;
    setChangesMade(true);
    if (key === 'address' && e.target.value.length >= 3) {
      getPlacePredictions(e.target.value);
      setUser((prevData) => ({
        ...prevData,
        address_line_1: '',
        address_line_2: '',
        city: '',
        zip_code: '',
        state: '',
      }));
    } else setUser({ ...user, [key]: value });
  };

  const handleInputBlur = (e, config_name = null, other = null) => {
    const { name, value } = e.target;
    let errorMessage = '';

    if (config_name) {
      if (!selectedRole) setRoleError('Required');
      return;
    }

    if (value.trim() === '') {
      errorMessage = 'required';
    }
    const setError = (fieldName, errorMsg) => {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [fieldName]: errorMsg,
      }));
    };

    switch (name) {
      case 'phone_number': {
        const regex = /^\(\d{3}\) \d{3}-\d{4}$/;
        const isValidPhoneNumber = regex.test(value);
        if (!value) {
          errorMessage = 'required';
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
          errorMessage = 'required';
        } else if (!isValidEmail) {
          errorMessage =
            'Please enter a valid email address, e.g: example@example.com';
        }
        setError(name, errorMessage);
        break;
      }
      default:
        if (other) {
          setError(other, errorMessage);
        } else {
          setError(name, errorMessage);
        }
        break;
    }
  };

  const BreadcrumbsData = [
    { label: 'System Configurations', class: 'disable-label', link: '/' },
    {
      label: 'User Administration',
      class: 'active-label',
      link: '/system-configuration/platform-admin/user-administration/users',
    },
    {
      label: 'Edit User',
      class: 'disable-label',
      link: `/system-configuration/platform-admin/user-administration/users/${id}/edit`,
    },
  ];

  const handleSubmit = async (e, fromSaveAndClose, changeTenantAdminRole) => {
    e.preventDefault();
    let tempErrorcheck = false;

    if (!selectedRole) {
      setRoleError('Required');
      toast.error('Please fill form properly.');
      return;
    }

    if (!changeTenantAdminRole && selectedRole.label == 'Tenant Admin') {
      setTenantPopup(true);
      return;
    }
    if (!changeTenantAdminRole) {
      for (const key in errors) {
        if (isEmpty(user[key])) {
          tempErrorcheck = true;
          setErrors({ ...errors, [key]: 'required' });
        }
      }
      if (tempErrorcheck) {
        return;
      }
    }

    const result = await fetch(BASE_URL + '/user', {
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${bearerToken}`,
      },
      method: 'PUT',
      body: JSON.stringify({
        ...user,
        date_of_birth: dateOfBirth,
        updated_by: +updatedById,
        business_unit: +user.business_unit?.id,
        gender: gender.value ? gender.value : null,
        role: selectedRole ? selectedRole.value : null,
        id: +user?.id,
        existingTenantRoleId: changeTenantAdminRole
          ? existingTenantRole?.value
          : null,
        existingTenantRole: changeTenantAdminRole
          ? existingTenantRole?.label
          : null,
        existingTenantRoleUserId: changeTenantAdminRole
          ? existingTenant?.id
          : null,
        existingTenant,
      }),
    });
    setTenantPopup(false);

    if (result.status === 204) {
      setChangesMade(false);
      if (selectedRole.label == 'Tenant Admin') {
        setSelectedRole({
          ...selectedRole,
          tenantAdminRole: true,
        });
      }

      if (saveAndClose) {
        setShowSuccessMessage(true);
      } else setShowModalWitoutNavigate(true);
    } else if (result.status === 409) {
      toast.error('Email already exists', { autoClose: 3000 });
    } else {
      let res = await result.json();
      if (Array.isArray(res?.message))
        toast.error(res?.message?.[0], {
          autoClose: 3000,
        });
      else
        toast.error(`Error with statusCode:${result.status}`, {
          autoClose: 3000,
        });
    }
  };

  const handleCancel = () => {
    if (changesMade) setShowCancelModal(true);
    else navigate(-1);
  };

  function handleKeyPress(event) {
    if (event.key === 'Enter') {
      getPlaceDetails();
    }
  }

  const roleChangeHandler = (e) => {
    setRoleError('');
    setSelectedRole(e);
  };

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
  ];

  const handleSetGender = (e) => {
    setGender(e);
    setErrors({ ...errors, gender: '' });
  };

  return (
    <>
      <div className="mainContent">
        <Topbar
          BreadCrumbsData={BreadcrumbsData}
          BreadCrumbsTitle={'User Administration'}
          SearchPlaceholder={null}
          SearchValue={null}
          SearchOnChange={null}
        />

        <div className="mainContentInner">
          <form className={styles.addUserRoles}>
            <div className="formGroup">
              <h5>Edit User</h5>
              <FormInput
                label="First Name"
                name="first_name"
                value={user.first_name}
                disabled={tenantAdminEdit}
                onChange={handleChange}
                //////required
                error={errors.first_name}
                errorHandler={handleInputBlur}
              />

              <FormInput
                label="Last Name"
                name="last_name"
                value={user.last_name}
                disabled={tenantAdminEdit}
                onChange={handleChange}
                //////required
                error={errors.last_name}
                errorHandler={handleInputBlur}
              />

              <FormInput
                label="Unique Identifier"
                name="unique_identifier"
                value={user.unique_identifier}
                onChange={handleChange}
                //////required
                disabled
                readOnly
                error={errors.unique_identifier}
                errorHandler={handleInputBlur}
              />

              <FormInput
                label="Email"
                name="email"
                value={user.email}
                readOnly
                disabled
                onChange={handleChange}
                error={errors.email}
                errorHandler={handleInputBlur}
                ///required
              />

              <div className="form-field">
                <div className="field">
                  <DatePicker
                    dateFormat="MM/dd/yyyy"
                    className="custom-datepicker"
                    placeholderText="Date Of Birth*"
                    selected={dateOfBirth}
                    disabled={tenantAdminEdit}
                    name="date_of_birth"
                    onChange={setDateOfBirth}
                    maxDate={new Date()}
                    minDate={moment().subtract(120, 'years').toDate()}
                    showYearDropdown
                    yearDropdownItemNumber={120}
                    scrollableYearDropdown
                  />
                </div>
              </div>

              <div className={`form-field`}>
                <div className={`field d-flex`}>
                  <SelectDropdown
                    styles={{ root: 'w-100' }}
                    placeholder={'Gender* '}
                    defaultValue={gender}
                    selectedValue={gender}
                    removeDivider
                    disabled={tenantAdminEdit}
                    showLabel
                    onChange={handleSetGender}
                    options={genderOptions}
                  />
                </div>
                {errors?.gender && (
                  <div className="error">
                    <p className={styles.error}>{errors?.gender}</p>
                  </div>
                )}
              </div>

              <FormInput
                label="Home Phone Number"
                name="home_phone_number"
                disabled={tenantAdminEdit}
                value={user.home_phone_number}
                onChange={handleChange}
              />

              <FormInput
                label="Work Phone Number"
                name="work_phone_number"
                disabled={tenantAdminEdit}
                value={user.work_phone_number}
                onChange={handleChange}
              />
              <FormInput
                label="Work Phone Extension"
                name="work_phone_extension"
                value={user.work_phone_extension}
                onChange={handleChange}
                disabled={tenantAdminEdit}
              />

              <div className={`form-field`}>
                <div className={`field d-flex`}>
                  <SelectDropdown
                    styles={{ root: 'w-100' }}
                    placeholder={'Admin Role* '}
                    defaultValue={selectedRole}
                    selectedValue={selectedRole}
                    disabled={selectedRole?.tenantAdminRole}
                    removeDivider
                    showLabel
                    onChange={roleChangeHandler}
                    options={roles?.map((item) => {
                      return { value: item.value, label: item.label };
                    })}
                  />
                </div>
                {roleError && (
                  <div className="error ">
                    <p className={styles.error}>{roleError}</p>
                  </div>
                )}
              </div>

              {/* <div className={`field form-floating w-50 ps-2`}>
              <select
                className={`form-select form-control ${
                  selectedRole
                    ? ` ${styles.select}`
                    : ` ${styles.disabledcolor} ${styles.devicetypeinputfields}`
                }`}
                id="floatingSelect"
                name="function_id"
                onChange={roleChangeHandler}
                defaultValue={selectedRole}
                value={selectedRole}
                onBlur={(e) => handleInputBlur(e, true)}
              >
                <option disabled value="" selected>
                  Admin Role*
                </option>
                {roles && roles.length ? (
                  roles.map((item) => {
                    return (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    );
                  })
                ) : (
                  <option disabled value="">
                    No Option
                  </option>
                )}
              </select>
              {roles ? (
                <label
                  className="ms-2"
                  style={{ fontSize: '15px', top: '-1%' }}
                >
                  Admin Role*
                </label>
              ) : (
                ''
              )}
            </div> */}

              <div className="form-field w-100">
                <div className="field">
                  <input
                    type="text"
                    className="form-control"
                    placeholder=" "
                    disabled={tenantAdminEdit}
                    value={user.address}
                    name="address"
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

                {/* <ul className="list-group">
                {predictions.map((prediction) => (
                  <li
                    key={prediction.place_id}
                    onClick={() => handlePredictionClick(prediction)}
                    className="list-group-item bg-light text-dark small border-0"
                    style={{ cursor: "pointer" }}
                  >
                    {prediction.description}
                  </li>
                ))}
              </ul> */}
              </div>

              <div className="form-field ">
                <div className="field">
                  <input
                    type="text"
                    className="form-control"
                    placeholder=" "
                    disabled={tenantAdminEdit}
                    value={user.address_line_1}
                    name="address"
                    required
                    onChange={(e) => {
                      handleFormInput(e, 'address_line_1');
                    }}
                    onKeyDown={handleKeyPress}
                  />
                  <label>Address Line 1</label>
                </div>
                {/* <ul className="list-group">
                {predictions?.length > 0 &&
                  predictions?.map((prediction) => (
                    <li
                      key={prediction.place_id}
                      onClick={() => handlePredictionClick(prediction)}
                      className="list-group-item bg-light text-dark small border-0"
                      style={{ cursor: "pointer" }}
                    >
                      {prediction.description}
                    </li>
                  ))}
              </ul> */}
              </div>

              <FormInput
                label="Address Line 2"
                name="address_line_2"
                disabled={tenantAdminEdit}
                value={user.address_line_2}
                onChange={handleChange}
              />
              <FormInput
                label="Zip Code"
                // disabled
                disabled={tenantAdminEdit}
                // readOnly
                name="zip_code"
                value={user.zip_code}
                onChange={handleChange}
              />

              <FormInput
                label="City"
                // disabled
                // readOnly
                name="city"
                disabled={tenantAdminEdit}
                value={user.city}
                onChange={handleChange}
              />
              <FormInput
                label="State"
                name="state"
                // disabled
                // readOnly
                disabled={tenantAdminEdit}
                value={user.state}
                onChange={handleChange}
              />

              <br />

              <div className="form-field w-100 checkbox mt-3">
                <span className="toggle-text">
                  {user?.is_active ? 'Active' : 'Inactive'}
                </span>
                <label htmlFor="toggle" className="switch">
                  <input
                    checked={user.is_active}
                    onChange={handleCheckboxChange}
                    type="checkbox"
                    id="toggle"
                    disabled={tenantAdminEdit}
                    className="toggle-input"
                    name="is_active"
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
          </form>
          <div className="form-footer position-absolute">
            {user?.id && (
              <>
                {' '}
                <div className="archived" onClick={() => setArchiveModal(true)}>
                  Archive
                </div>
                <button
                  className="btn btn-secondary border-0"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={(e) => {
                    setSaveAndClose(true);
                    handleSubmit(e, true);
                  }}
                >
                  Save & Close
                </button>
                <button
                  type="button"
                  className={` ${`btn btn-primary`}`}
                  onClick={handleSubmit}
                >
                  Save Changes
                </button>
              </>
            )}
          </div>
          <SuccessPopUpModal
            title="Confirmation"
            message={'Are you sure you want to archive?'}
            modalPopUp={archiveModal}
            setModalPopUp={setArchiveModal}
            showActionBtns={false}
            isArchived={true}
            archived={handleConfirmArchive}
          />
          <SuccessPopUpModal
            title="Success!"
            message={'User is archived.'}
            modalPopUp={showShowArchiveMessage}
            showActionBtns={true}
            redirectPath={
              '/system-configuration/platform-admin/user-administration/users'
            }
            isReplace
            isNavigate={true}
            isArchived={false}
            setModalPopUp={setShowArchiveMessage}
          />

          <SuccessPopUpModal
            title="Confirmation"
            message={'Unsaved changes will be lost, do you wish to proceed?'}
            modalPopUp={showCancelModal}
            setModalPopUp={setShowCancelModal}
            showActionBtns={false}
            isArchived={true}
            archived={() =>
              navigate(
                '/system-configuration/platform-admin/user-administration/users'
              )
            }
          />
          <SuccessPopUpModal
            title="Success!"
            message={'User updated.'}
            modalPopUp={showSuccessMessage}
            showActionBtns={true}
            redirectPath={-1}
            isNavigate={true}
            isArchived={false}
            setModalPopUp={setShowSuccessMessage}
          />
          <SuccessPopUpModalWONavigate
            title="Success!"
            message={'User updated.'}
            modalPopUp={showModalWitoutNavigate}
            showActionBtns={true}
            isNavigate={true}
            isArchived={false}
            setModalPopUp={setShowModalWitoutNavigate}
          />
        </div>
      </div>
      <section
        className={`popup ${styles.communicationMessagePopup} full-section ${
          tenantPopup ? 'active' : ''
        }`}
      >
        <div
          className="popup-inner"
          style={{
            width: '800px',
            height: '400px',
            minWidth: '800px',
            padding: '60px 0px',
          }}
        >
          <form className="content">
            <h3>Change Existing Tenant Role</h3>
            <div className="d-flex justify-content-around w-100 my-5">
              <div>
                <h4 className="mb-0">
                  {existingTenant?.first_name} {existingTenant?.last_name}
                </h4>
                <p style={{ color: 'black' }}>{existingTenant?.email}</p>
              </div>

              <div className={`form-field field d-flex`}>
                <SelectDropdown
                  styles={{ root: 'w-100' }}
                  placeholder={'Admin Role* '}
                  defaultValue={existingTenantRole}
                  selectedValue={existingTenantRole}
                  disabled={selectedRole?.tenantAdminRole}
                  removeDivider
                  showLabel
                  onChange={(val) => {
                    setExistingTenantRole(val);
                  }}
                  options={roles?.map((item) => {
                    return { value: item.value, label: item.label };
                  })}
                />
              </div>
            </div>
            <div className="d-flex justify-content-around w-100">
              <button
                className="btn btn-secondary"
                onClick={(e) => {
                  e.preventDefault();
                  setTenantPopup(false);
                }}
              >
                Close
              </button>
              <button
                type="button"
                className={` ${`btn btn-primary`}`}
                onClick={(e) => {
                  if (existingTenantRole.label == 'Tenant Admin') {
                    toast.error("Change Tenant Admin's role ");
                  } else {
                    handleSubmit(e, null, true);
                  }
                }}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default EditUser;
