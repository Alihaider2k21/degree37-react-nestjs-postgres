import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.scss';
import jwt from 'jwt-decode';
import FormInput from './FormInput';
import FormInputPhoneMak from '../../../common/form/FormInput';
import Topbar from '../../../common/topbar/index';
import * as yup from 'yup';
import moment from 'moment';
import { toast } from 'react-toastify';
import SuccessPopUpModal from '../../../common/successModal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import SelectDropdown from '../../../common/selectDropdown';
const errorIniitialState = {
  first_name: '',
  last_name: '',
  unique_identifier: '',
  email: '',
  password: '',
  confirm_password: '',
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
  address1: '',
  address2: '',
  zip_code: '',
  city: '',
  longitude: '',
  latitude: '',
  country: '',
  county: '',
  state: '',
  password: '',
  confirm_password: '',
  is_active: true,
};
const phone_regex = /^\(\d{3}\) \d{3}-\d{4}$/;
const validationSchema = yup.object({
  first_name: yup.string().required('First name is required.'),
  last_name: yup.string().required('Last name is required.'),
  unique_identifier: yup.string().required('Unique identifier is required.'),
  email: yup.string().required('Email is required.'),
  password: yup.string().required('Password is required.'),
  confirm_password: yup.string().required('Confirm password is required.'),
  date_of_birth: yup.string().required('Date of birth is required.'),
  gender: yup.mixed().required('Gender is required.'),
  // gender2: yup.mixed(),
  home_phone_number: yup
    .string()
    .matches(phone_regex, {
      message:
        'Please enter a valid phone number in the format (123) 456-7890.',
      excludeEmptyString: true,
    })
    .required('Home phone no is required.'),
  work_phone_number: yup
    .string()
    .matches(phone_regex, {
      message:
        'Please enter a valid phone number in the format (123) 456-7890.',
      excludeEmptyString: true,
    })
    .notRequired(),
  role: yup.mixed().required('Admin role is required.'),
  address_line_1: yup.string().required('Address line 1 is required.'),
  address_line_2: yup.string().required('Address line 2 is required.'),
  zip_code: yup.string().required('Zip code is required.'),
  city: yup.string().required('City is required.'),
  state: yup.string().required('State is required.'),
});

const AddUser = () => {
  const navigate = useNavigate();
  const [id, setId] = useState('');

  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [roles, setRoles] = useState([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [dateOfBirth, setDateOfBirth] = useState();
  const [changesMade, setChangesMade] = useState(false);
  const [user, setUser] = useState(userInitialState);
  const [errors, setErrors] = useState(errorIniitialState);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [gender, setGender] = useState(null);
  const [roleError, setRoleError] = useState();
  const bearerToken = localStorage.getItem('token');

  const getRolesDropdown = async () => {
    try {
      const result = await fetch(`${BASE_URL}/roles`, {
        method: 'GET',
        headers: { authorization: `Bearer ${bearerToken}` },
      });
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

  function handleKeyPress(event) {
    if (event.key === 'Enter') {
      getPlaceDetails();
    }
  }

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
    setChangesMade(true);
    setUser({ ...user, is_active: event.target.checked });
  };

  const handleFormInput = (e, key, config_name = null) => {
    const { value, name } = e.target;
    setChangesMade(true);

    if (name === 'address' && e.target.value.length >= 3) {
      getPlacePredictions(e.target.value);
      setUser((prevData) => ({
        ...prevData,
        address1: '',
        address2: '',
        city: '',
        zip_code: '',
        state: '',
      }));
    }

    if (config_name && value.trim() !== '') {
      if (config_name === 'google_api') {
        setUser((prevData) => ({
          ...prevData,
          google_api: {
            ...prevData.google_api,
            [key]: value,
          },
        }));
      }
    } else {
      setUser((prevData) => ({
        ...prevData,
        [key]: value,
      }));
    }
  };

  useEffect(() => {
    const updatedErrors = { ...errors };
    Object.keys(errors).forEach((key) => {
      if (user?.[key]) updatedErrors[key] = '';
    });
    setErrors(updatedErrors);
  }, [user]);

  const handleInputBlur = (e, config_name = null, other = null) => {
    const { name, value } = e.target;
    let errorMessage = '';

    if (value.trim() === '') {
      errorMessage = 'required.';
    }
    if (config_name) {
      if (!selectedRole) setRoleError('required.');
      return;
    }
    const setError = (fieldName, errorMsg) => {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [fieldName]: errorMsg,
      }));
    };

    switch (name) {
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
        if (user.password !== value) {
          setError(
            'confirm_password',
            "Confirm password didn't match with password."
          );
        } else {
          setError(name, errorMessage);
        }
        break;

      case 'home_phone_number': {
        const regex = /^\(\d{3}\) \d{3}-\d{4}$/;
        const isValidPhoneNumber = regex.test(value);
        if (!isValidPhoneNumber) {
          errorMessage =
            'Please enter a valid phone number in the format (123) 456-7890.';
        }
        setError(name, errorMessage);
        break;
      }

      case 'address1': {
        if (!value) {
          errorMessage = 'required.';
        }
        setError(name, errorMessage);
        setError('address_line_1', errorMessage);
        break;
      }

      case 'address2': {
        if (!value) {
          errorMessage = 'required.';
        }
        setError(name, errorMessage);
        setError('address_line_2', errorMessage);
        break;
      }

      case 'email': {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValidEmail = emailRegex.test(value);
        if (!value) {
          errorMessage = 'required.';
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
      label: 'Create New User',
      class: 'disable-label',
      link: '/system-configuration/platform-admin/user-administration/users/create',
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    validationSchema
      .validate(
        {
          first_name: user.first_name,
          last_name: user.last_name,
          unique_identifier: user.unique_identifier,
          email: user.email,
          password: user.password,
          confirm_password: user.confirm_password,
          date_of_birth: dateOfBirth,
          gender: gender,
          home_phone_number: user.home_phone_number,
          work_phone_number: user.work_phone_number,
          role: selectedRole,
          address_line_1: user.address1,
          address_line_2: user.address2,
          zip_code: user.zip_code,
          city: user.city,
          state: user.city,
        },
        { abortEarly: false }
      )
      .then(async () => {
        const result = await fetch(BASE_URL + '/user', {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${bearerToken}`,
          },
          method: 'POST',
          body: JSON.stringify({
            ...user,
            created_by: +id,
            date_of_birth: dateOfBirth,
            gender: gender ? gender.value : null,
            role: selectedRole ? selectedRole.value : null,
            address_line_1: user.address1,
            address_line_2: user.address2,
          }),
        });
        const data = await result?.json();
        if (data?.status_code === 201) {
          setShowSuccessMessage(true);
          setChangesMade(false);
          setUser(userInitialState);
          setErrors(errorIniitialState);
          setDateOfBirth();
        } else if (data?.statusCode === 400) {
          toast.error(data?.message[0], {
            autoClose: 3000,
          });
        } else if (data?.statusCode === 409) {
          toast.error(data?.message, {
            autoClose: 3000,
          });
        } else {
          toast.error(`Error with statusCode:${result.status}`, {
            autoClose: 3000,
          });
        }
      })
      .catch((validationErrors) => {
        const newErrors = {};
        validationErrors?.inner?.forEach((error) => {
          if (error?.path === 'role') setRoleError('Role is required.');
          else if (error?.path === 'address_line_1')
            newErrors['address1'] = error.message;
          else if (error?.path === 'address_line_2')
            newErrors['address2'] = error.message;
          else newErrors[error?.path] = error.message;
        });
        setErrors(newErrors);
      });
  };

  const handleCancel = () => {
    if (changesMade) setShowCancelModal(true);
    else navigate(-1);
  };

  useEffect(() => {
    getRolesDropdown();
    const jwtToken = localStorage.getItem('token');
    if (jwtToken) {
      const decodeToken = jwt(jwtToken);
      if (decodeToken?.id) {
        setId(decodeToken?.id);
      }
    }
    const apiKey = process.env.REACT_APP_GOOGLE_MAP_API_KEY;
    if (!window.google || !window.google.maps) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.defer = true;
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  const handleDateOfBirth = (date) => {
    setDateOfBirth(date);
    setErrors({ ...errors, date_of_birth: '' });
  };

  const handleSetGender = (e) => {
    setGender(e);
    setErrors({ ...errors, gender: '' });
  };

  const roleChangeHandler = (e) => {
    setRoleError('');
    setChangesMade(true);
    setSelectedRole(e);
  };

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
  ];

  return (
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
            <h5>Create New User</h5>

            <FormInput
              label="First Name"
              name="first_name"
              value={user.first_name}
              onChange={handleChange}
              required
              error={errors.first_name}
              errorHandler={handleInputBlur}
            />

            <FormInput
              label="Last Name"
              name="last_name"
              value={user.last_name}
              onChange={handleChange}
              required
              error={errors.last_name}
              errorHandler={handleInputBlur}
            />

            <FormInput
              label="Unique Identifier"
              name="unique_identifier"
              value={user.unique_identifier}
              onChange={handleChange}
              required
              error={errors.unique_identifier}
              errorHandler={handleInputBlur}
            />

            <FormInput
              label="Email"
              name="email"
              value={user.email}
              onChange={handleChange}
              error={errors.email}
              errorHandler={handleInputBlur}
              required
            />

            <div className="form-field">
              <div className="field">
                <DatePicker
                  dateFormat="MM/dd/yyyy"
                  className="custom-datepicker"
                  placeholderText="Date Of Birth*"
                  selected={dateOfBirth}
                  name="date_of_birth"
                  onChange={handleDateOfBirth}
                  minDate={moment().subtract(120, 'years').toDate()}
                  maxDate={new Date()}
                  showYearDropdown
                  yearDropdownItemNumber={120}
                  scrollableYearDropdown
                  required
                />
              </div>
              {errors.date_of_birth && (
                <div className="error">
                  <p className={`${styles.error} mt-0`}>
                    {errors.date_of_birth}
                  </p>
                </div>
              )}
            </div>

            <div className={`form-field`}>
              <div className={`field d-flex`}>
                <SelectDropdown
                  styles={{ root: 'w-100' }}
                  placeholder={'Gender* '}
                  defaultValue={gender}
                  selectedValue={gender}
                  removeDivider
                  showLabel
                  onChange={handleSetGender}
                  options={genderOptions}
                  error={errors?.gender}
                />
              </div>
              {/* {errors?.gender && (
                <div className="error">
                  <p className={styles.error}>{errors?.gender}</p>
                </div>
              )} */}
            </div>

            <FormInputPhoneMak
              classes={{}}
              label="Home Phone Number"
              name="home_phone_number"
              variant="phone"
              displayName="Home Phone Number"
              value={user.home_phone_number}
              onChange={(e) => {
                handleChange(e);
                handleInputBlur(e);
              }}
              error={errors.home_phone_number}
              required={false}
              onBlur={handleInputBlur}
            />
            <FormInputPhoneMak
              classes={{}}
              label="Work Phone Number"
              name="work_phone_number"
              variant="phone"
              displayName="Work Phone Number"
              value={user.work_phone_number}
              onChange={(e) => {
                handleChange(e);
                handleInputBlur(e);
              }}
              error={errors.work_phone_number}
              required={false}
              onBlur={handleInputBlur}
            />

            <FormInput
              label="Work Phone Extension"
              name="work_phone_extension"
              value={user.work_phone_extension}
              onChange={handleChange}
            />

            <div className={`form-field`}>
              <div className={`field d-flex`}>
                <SelectDropdown
                  styles={{ root: 'w-100' }}
                  placeholder={'Admin Role* '}
                  defaultValue={selectedRole}
                  selectedValue={selectedRole}
                  removeDivider
                  showLabel
                  onChange={roleChangeHandler}
                  options={roles.map((item) => {
                    return { value: item.value, label: item.label };
                  })}
                  error={roleError}
                />
              </div>
              {/* {roleError && (
                <div className="error ">
                  <p className={styles.error}>{roleError}</p>
                </div>
              )} */}
            </div>

            <div className="form-field w-100">
              <div className="field">
                <input
                  type="text"
                  className="form-control"
                  placeholder=" "
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
            </div>

            <div className="form-field">
              <div className="field">
                <input
                  type="text"
                  className="form-control"
                  placeholder=" "
                  value={user.address1}
                  name="address1"
                  onBlur={handleInputBlur}
                  required
                  onChange={(e) => {
                    handleFormInput(e, 'address1');
                    handleInputBlur(e);
                  }}
                />
                <label>Address Line 1*</label>
              </div>
              {errors.address1 && (
                <div className="error ">
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
                  value={user.address2}
                  required
                  name="address2"
                  onChange={(e) => {
                    handleFormInput(e, 'address2');
                    handleInputBlur(e);
                  }}
                />
                <label>Address Line 2</label>
              </div>
              {errors.address2 && (
                <div className="error ">
                  <p>{errors.address2}</p>
                </div>
              )}
            </div>

            <div className="form-field">
              <div className="field">
                <input
                  type="text"
                  className="form-control"
                  placeholder=" "
                  defaultValue={user.zip_code}
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
                <div className="error ">
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
                  defaultValue={user.city}
                  name="zip_code"
                  onBlur={handleInputBlur}
                  onChange={(e) => {
                    handleFormInput(e, 'city');
                    handleInputBlur(e);
                  }}
                  // readOnly
                  required
                />
                <label>City*</label>
              </div>
              {errors.city && (
                <div className="error ">
                  <p>{errors.city}</p>
                </div>
              )}
            </div>

            <div className="form-field">
              <div className="field">
                <input
                  type="text"
                  className="form-control"
                  placeholder=" "
                  defaultValue={user.state}
                  name="zip_code"
                  onBlur={handleInputBlur}
                  onChange={(e) => {
                    handleFormInput(e, 'state');
                    handleInputBlur(e);
                  }}
                  // readOnly
                  required
                />
                <label>State*</label>
              </div>
              {errors.state && (
                <div className="error ">
                  <p>{errors.state}</p>
                </div>
              )}
            </div>

            <input
              hidden
              type="text"
              defaultValue={user.longitude}
              name="longitude"
            />
            <input
              hidden
              type="text"
              defaultValue={user.latitude}
              name="latitude"
            />
            <input
              hidden
              type="text"
              defaultValue={user.country}
              name="country"
            />
            <input
              hidden
              type="text"
              defaultValue={user.county}
              name="county"
            />

            <div className="form-field w-100">
              <div className="field">
                <h6>Password</h6>
              </div>
            </div>

            <FormInput
              label="Password"
              name="password"
              value={user.password}
              onChange={handleChange}
              isPassword
              error={errors.password}
              errorHandler={handleInputBlur}
            />

            <FormInput
              label="Confirm Password"
              name="confirm_password"
              value={user.confirm_password}
              onChange={handleChange}
              isPassword
              error={errors.confirm_password}
              errorHandler={handleInputBlur}
            />

            <div className="form-field checkbox">
              <span className="toggle-text">
                {user?.is_active ? 'Active' : 'Inactive'}
              </span>
              <label htmlFor="toggle" className="switch">
                <input
                  checked={user.is_active}
                  onChange={handleCheckboxChange}
                  type="checkbox"
                  id="toggle"
                  className="toggle-input"
                  name="is_active"
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        </form>
        <div className="form-footer position-absolute">
          <button
            className="btn btn-md btn-secondary border-0"
            onClick={handleCancel}
          >
            Cancel
          </button>

          <button
            type="button"
            className={` ${`btn btn-md btn-primary`}`}
            onClick={handleSubmit}
          >
            Create
          </button>
        </div>
      </div>
      <SuccessPopUpModal
        title="Confirmation"
        message={'Unsaved changes will be lost, do you wish to proceed?'}
        modalPopUp={showCancelModal}
        setModalPopUp={setShowCancelModal}
        showActionBtns={false}
        isArchived={true}
        archived={() => navigate(-1)}
      />
      <SuccessPopUpModal
        title="Success!"
        message={'User created.'}
        modalPopUp={showSuccessMessage}
        isNavigate={true}
        redirectPath={-1}
        showActionBtns={true}
        isArchived={false}
        setModalPopUp={setShowSuccessMessage}
      />
    </div>
  );
};

export default AddUser;
