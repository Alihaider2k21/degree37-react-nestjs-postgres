import React, { useEffect, useRef, useState } from 'react';
import TopBar from '../../../common/topbar/index';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './donor.module.scss';
import donorStyles from './donor.module.scss';
import { toast } from 'react-toastify';
import CancelIconImage from '../../../../assets/images/ConfirmCancelIcon.png';
import SuccessPopUpModal from '../../../common/successModal';
import { makeAuthorizedApiRequest } from '../../../../helpers/Api';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import ConfirmModal from '../../../common/confirmModal';
import ConfirmArchiveIcon from '../../../../assets/images/ConfirmArchiveIcon.png';
import SelectDropdown from '../../../common/selectDropdown';
import WarningIcon from '../../../../assets/images/warningIcon.png';
import { formatDate } from '../../../../helpers/formatDate';
// import moment from 'moment';
import FormInput from '../../../common/form/FormInput';
import jwt from 'jwt-decode';
import axios from 'axios';
import { DonorBreadCrumbsData } from './DonorBreadCrumbsData';
import FormFooter from '../../../common/FormFooter';
import { DonorFormSchema } from './YupSchema';
import CustomFieldsForm from '../../../common/customeFileds/customeFieldsForm';
import { removeCountyWord } from '../../../../helpers/utils';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

function DonorUpsert() {
  const { donorId: donorID } = useParams();
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const token = localStorage.getItem('token');
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [isNavigate, setIsNavigate] = useState(false);
  const [modalPopUp, setModalPopUp] = useState(false);
  const [archiveModalPopUp, setArchiveModalPopUp] = useState(false);
  const [prefixes, setPrefixes] = useState([]);
  const [suffixes, setSuffixes] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [duplicateConfirmation, setDuplicateConfirmation] = useState(null);
  const closeAfterFinish = useRef(false);
  const [isLoading, setLoading] = useState(false);
  // const [minimumAge, setMinimumAge] = useState(null);
  const [datecleared, setDateCleared] = React.useState(false);
  const [customFields, setcustomFields] = useState();
  const [dataEntered, setDataEntered] = useState({
    phone: false,
    email: false,
  });
  const DonorSchema = DonorFormSchema(customFields);
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    getValues,
    control,
  } = useForm({
    resolver: yupResolver(DonorSchema),
  });

  useEffect(() => {
    getData();
  }, [BASE_URL]);

  const getData = async () => {
    const jwtToken = localStorage.getItem('token');
    if (jwtToken) {
      const decodedData = jwt(jwtToken);
      if (decodedData?.tenantId) {
        const result = await axios.get(
          `${BASE_URL}/tenants/${decodedData?.tenantId}`
        );
        let { status, status_code } = result.data;

        if ((status === 'success', status_code === 200)) {
          return;
          // const responseData = data;
          // setMinimumAge(responseData?.allow_donor_minimum_age || null);
        } else {
          toast.error('Error Fetching Tenant Details', { autoClose: 3000 });
        }
      }
    }
  };

  const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const initialState = {
    prefix_id: '',
    suffix_id: '',
    blood_type: '',
    first_name: '',
    last_name: '',
    nick_name: '',
    birth_date: null,
    is_active: true,
    mailing_address: null,
    workPhone: '',
    mobPhone: '',
    otherPhone: '',
    workEmail: '',
    homeEmail: '',
    otherEmail: '',
    addressable_id: '',
    addressable_type: '',
    address1: '',
    zip_code: '',
    city: '',
    state: '',
    country: '',
    county: '',
    latitude: '',
    longitude: '',
    coordinates: '',
    contact: [],
    address: {},
  };

  const [addDonor, setAddDonor] = useState(initialState);

  const [primaryPhone, setPrimaryPhone] = useState(0);
  const [primaryEmail, setPrimaryEmail] = useState(0);

  const [customErrors, setCustomErrors] = useState({});

  const BreadcrumbsData = [
    ...DonorBreadCrumbsData,
    {
      label: `${donorID ? 'Edit Donor' : 'Create Donor'}`,
      class: 'disable-label',
      link: `${
        donorID
          ? `/crm/contacts/donor/${donorID}/edit`
          : `/crm/contacts/donor/create`
      }`,
    },
  ];

  // Fetch Donor if ID
  const fetchDonor = async () => {
    const result = await fetch(`${BASE_URL}/contact-donors/${donorID}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    let { data } = await result.json();
    if (result.ok || result.status === 200) {
      setAddDonor(data);
      const defaultDate = dayjs(data.birth_date);
      const mailing_address =
        data?.address?.address1 + ' ' + data?.address?.address2;
      setValue('first_name', data.first_name);
      setValue('last_name', data.last_name);
      setValue('nick_name', data.nick_name);
      setValue('blood_type', data.blood_type);
      setValue('birth_date', defaultDate);
      setValue('mailing_address', mailing_address);
      setValue('zip_code', data?.address?.zip_code);
      setValue('city', data?.address?.city);
      setValue('state', data?.address?.state);
      setValue('country', data?.address?.country);
      setValue('county', removeCountyWord(data?.address?.county));

      const workPhone = data.contact.filter(
        (contact) => contact.contact_type === 1
      );
      const mobPhone = data.contact.filter(
        (contact) => contact.contact_type === 2
      );
      const otherPhone = data.contact.filter(
        (contact) => contact.contact_type === 3
      );
      const workEmail = data.contact.filter(
        (contact) => contact.contact_type === 4
      );
      const homeEmail = data.contact.filter(
        (contact) => contact.contact_type === 5
      );
      const otherEmail = data.contact.filter(
        (contact) => contact.contact_type === 6
      );

      // find primary field
      const primaryPhoneField = data.contact.find(
        (contact) =>
          contact.is_primary &&
          contact.contact_type > 0 &&
          contact.contact_type < 4
      );
      const primaryEmailField = data.contact.find(
        (contact) =>
          contact.is_primary &&
          contact.contact_type > 3 &&
          contact.contact_type < 7
      );
      setPrimaryPhone(primaryPhoneField?.contact_type);
      setPrimaryEmail(primaryEmailField?.contact_type - 3);

      setAddDonor((prevValue) => ({
        ...prevValue,
        prefix_id: {
          label: data.prefix_id?.abbreviation,
          value: data.prefix_id?.id,
        },
        suffix_id: {
          label: data.suffix_id?.abbreviation,
          value: data.suffix_id?.id,
        },
        workPhone: workPhone.length ? workPhone[0].data : '',
        mobPhone: mobPhone.length ? mobPhone[0].data : '',
        otherPhone: otherPhone.length ? otherPhone[0].data : '',
        workEmail: workEmail.length ? workEmail[0].data : '',
        homeEmail: homeEmail.length ? homeEmail[0].data : '',
        otherEmail: otherEmail.length ? otherEmail[0].data : '',
      }));
    } else {
      toast.error('Error Fetching Donor Details', { autoClose: 3000 });
    }
  };

  // Fetch Prefixes
  const getPrefixes = async () => {
    try {
      const result = await fetch(`${BASE_URL}/prefixes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await result.json();
      setPrefixes(data?.data.records);
    } catch (error) {
      toast.error(`Failed to fetch`, { autoClose: 3000 });
    }
  };

  // Fetch Suffixes
  const getSuffixes = async () => {
    try {
      const result = await fetch(`${BASE_URL}/suffixes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await result.json();
      setSuffixes(data?.data.records);
    } catch (error) {
      toast.error(`Failed to fetch`, { autoClose: 3000 });
    }
  };

  // Fetch Custom Fields
  const getCustomFields = async () => {
    try {
      const response = await makeAuthorizedApiRequest(
        'GET',
        `${BASE_URL}/system-configuration/organization-administration/custom-fields/modules/3`
      );
      const data = await response.json();
      if (data?.status === 200) {
        setcustomFields(data.data);
      }
    } catch (error) {
      console.error(`Failed to fetch custom fields data ${error}`, {
        autoClose: 3000,
      });
    }
  };

  // Fetch Custom Fields Data
  const getCustomDataFields = async () => {
    try {
      const response = await makeAuthorizedApiRequest(
        'GET',
        `${BASE_URL}/system-configuration/organization-administration/custom-fields/data?custom_field_datable_id=${donorID}&custom_field_datable_type=donors`
      );
      const data = await response.json();
      if (data?.status_code === 201) {
        const fieldsToUpdate = data.data;
        fieldsToUpdate.forEach(
          ({ field_id: { id, pick_list }, field_data }) => {
            let updatedValue;

            if (pick_list.length > 0) {
              const matchingPickItem = pick_list.find((pickItem) => {
                if (typeof field_data === 'boolean') {
                  return pickItem.type_value === field_data;
                } else {
                  return pickItem.type_value === field_data.toString();
                }
              });

              if (matchingPickItem) {
                updatedValue = {
                  label: matchingPickItem.type_name,
                  value: matchingPickItem.type_value,
                };
              } else {
                // If no match is found, use the first pick list item as a fallback
                updatedValue = {
                  label: '',
                  value: '',
                };
              }
            } else {
              updatedValue = field_data;
            }
            setValue(id, updatedValue);
          }
        );
      }
    } catch (error) {
      console.error(`Failed to fetch Locations data ${error}`, {
        autoClose: 3000,
      });
    }
  };

  // UseEffect for map and fetching APIs
  useEffect(() => {
    const apiKey = process.env.REACT_APP_GOOGLE_MAP_API_KEY;
    if (!window.google || !window.google.maps) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.defer = true;
      script.async = true;
      document.head.appendChild(script);
    }
    getPrefixes();
    getSuffixes();
    if (donorID) {
      fetchDonor();
      getCustomDataFields();
    }
    getCustomFields();
  }, []);

  const handleInputBlur = (e) => {
    setUnsavedChanges(true);
    const validatePhone = ['workPhone', 'mobPhone', 'otherPhone'];
    const validateEmail = ['workEmail', 'homeEmail', 'otherEmail'];
    let { name, value } = e?.target ? e.target : '';
    let errorMessage = '';
    const setError = (fieldName, errorMsg) => {
      setCustomErrors((prevErrors) => ({
        ...prevErrors,
        [fieldName]: errorMsg,
      }));
    };

    if (validatePhone.includes(name)) {
      const isValidPhoneNumber = phoneRegex.test(value);
      if (value && !isValidPhoneNumber) {
        errorMessage =
          'Please enter a valid phone number in the format (123) 456-7890.';
      }
      setError(name, errorMessage);
    }

    if (validateEmail.includes(name)) {
      const isValidEmail = emailRegex.test(value);
      if (value && !isValidEmail) {
        errorMessage = 'Please enter a valid email.';
      }
      setError(name, errorMessage);
    }

    // Additional logic to check for at least one phone and one email
    const phoneCount = addDonor.contact.filter(
      (contact) => contact.contact_type >= 1 && contact.contact_type <= 3
    ).length;
    const emailCount = addDonor.contact.filter(
      (contact) => contact.contact_type >= 4 && contact.contact_type <= 6
    ).length;

    if (phoneCount === 0) {
      setError('phone', '');
    } else {
      setError('phone', '');
    }

    if (emailCount === 0) {
      setError('email', '');
    } else {
      setError('email', '');
    }
  };

  const handleFormInput = (e, key) => {
    setUnsavedChanges(true);

    const { value, name, checked } = e.target;
    let fieldValue = checked;
    if (name === 'mailing_address') {
      getPlacePredictions(e.target.value);
      setAddDonor((prevData) => ({
        ...prevData,
        mailing_address: e.target.value,
      }));
    } else if (name === 'zip_code') {
      setAddDonor((prevData) => ({
        ...prevData,

        zip_code: e.target.value,
      }));
    } else if (name === 'city') {
      setAddDonor((prevData) => ({
        ...prevData,
        city: e.target.value,
      }));
    } else if (name === 'state') {
      setAddDonor((prevData) => ({
        ...prevData,
        state: e.target.value,
      }));
    } else if (name === 'county') {
      setAddDonor((prevData) => ({
        ...prevData,
        county: e.target.value,
      }));
    } else if (name === 'is_active') {
      setAddDonor((prevData) => ({
        ...prevData,
        [name]: fieldValue,
      }));
    } else {
      setAddDonor((prevData) => ({
        ...prevData,
        [key]: value,
      }));
    }
  };

  const handleCancelClick = () => {
    if (unsavedChanges) {
      setShowConfirmationDialog(true);
    } else {
      navigate(-1);
    }
  };

  const handleConfirmationResult = (confirmed) => {
    setShowConfirmationDialog(false);
    if (confirmed) {
      navigate(-1);
    }
  };

  const duplicateConfirmationMessage = () => {
    if (duplicateConfirmation === null) return;

    const contact = `${duplicateConfirmation.first_name} ${duplicateConfirmation.last_name}`;
    let criteria = null;
    if (
      duplicateConfirmation.duplicate.birth_date ===
      duplicateConfirmation.birth_date
    ) {
      criteria = formatDate(duplicateConfirmation.birth_date).split('|')[0];
    } else if (
      Object.keys(duplicateConfirmation.address).every(
        (key) =>
          duplicateConfirmation.address[key]?.toLowerCase() ===
          duplicateConfirmation.duplicate[key]?.toLowerCase()
      )
    ) {
      criteria = Object.values(duplicateConfirmation.address)
        .filter((v) => v)
        .join(', ');
    }

    return (
      <p>
        A possible duplicate has been found.{' '}
        <span className="text-primary">{contact}</span> at{' '}
        <span className="text-primary">{criteria}</span> already exists.
        <br />
        <br />
        Please click CANCEL to discard this record and be taken to the existing
        record for <span className="text-primary">{contact}</span> or click
        PROCEED to create this new record.
      </p>
    );
  };

  const identifyDuplicates = async (
    first_name,
    last_name,
    address = null,
    birth_date = null
  ) => {
    const identifyPayload = { first_name, last_name, donor_id: donorID };
    if (birth_date) identifyPayload['birth_date'] = birth_date;
    if (address) {
      identifyPayload['address'] = {
        address1: address.address1,
        address2: address.address2,
        city: address.city,
        state: address.state,
        zip_code: address.zip_code,
      };
    }
    const response = await makeAuthorizedApiRequest(
      'POST',
      `${BASE_URL}/contact-donors/duplicates/identify`,
      JSON.stringify(identifyPayload)
    );
    const json = await response.json();
    if (!response.ok && response.status === 409) {
      setDuplicateConfirmation({ ...identifyPayload, duplicate: json.data });
      return true;
    } else if (!response.ok) {
      toast.error(json.message.length && json.message[0], { autoClose: 3000 });
    }
    return false;
  };

  const onSubmit = async (data) => {
    setLoading(true);
    let fields = addDonor.contact;
    for (let i = 0; i < fields.length; i++) {
      // for phone fields
      if (fields[i].contact_type > 0 && fields[i].contact_type < 4) {
        if (fields[i].contact_type === primaryPhone) {
          fields[i]['is_primary'] = true;
        } else {
          fields[i]['is_primary'] = false;
        }
      }
      // for email fields
      if (fields[i].contact_type > 3 && fields[i].contact_type < 7) {
        if (fields[i].contact_type - 3 === primaryEmail) {
          fields[i]['is_primary'] = true;
        } else {
          fields[i]['is_primary'] = false;
        }
      }
    }

    const fieldsData = [];
    // const customFieldDatableId = 0; // You can change this as needed
    const customFieldDatableType = 'donors'; // You can change this as needed
    let resulting;
    for (const key in data) {
      if (key > 0) {
        const value = data[key]?.value ?? data[key];
        fieldsData.push({
          field_id: key,
          field_data:
            typeof value === 'object' && !Array.isArray(value)
              ? new Date(value).toISOString()
              : value?.toString(),
        });
      }
    }
    resulting = {
      fields_data: fieldsData,
      // custom_field_datable_id: customFieldDatableId,
      custom_field_datable_type: customFieldDatableType,
    };

    let body = {
      prefix_id: parseInt(addDonor?.prefix_id?.value),
      suffix_id: parseInt(addDonor?.suffix_id?.value),
      first_name: data.first_name,
      last_name: data.last_name,
      nick_name: data.nick_name,
      birth_date: data.birth_date.toISOString(),
      blood_type: data.blood_type,
      is_active: addDonor.is_active,
      address: {
        zip_code: data?.zip_code,
        city: data?.city,
        state: data?.state,
        country: data?.country,
        address1: addDonor?.address?.address1,
        address2: addDonor?.address?.address2,
        addressable_type: 'donors',
        county: addDonor?.address?.county,
        coordinates: {
          latitude: addDonor?.address?.coordinates?.latitude,
          longitude: addDonor?.address?.coordinates?.longitude,
        },
        latitude: addDonor?.address?.latitude,
        longitude: addDonor?.address?.longitude,
        id: donorID ? addDonor?.address?.id : null,
        addressable_id: donorID ? addDonor?.address?.addressable_id : null,
      },
      contact: fields,
      // ======  Custom Fields Form ======
      custom_fields: resulting,
    };
    const validatePhoneFields = ['workPhone', 'mobPhone', 'otherPhone'];
    const validateEmailFields = ['workEmail', 'homeEmail', 'otherEmail'];

    let isPhoneValid = customErrors.phone;
    let isAdditionalPhoneValid = true;
    if (isPhoneValid && isPhoneValid.length) {
      isPhoneValid = false;
    } else {
      isPhoneValid = true;
    }

    let isEmailValid = customErrors.email;
    let isAdditionalEmailValid = true;
    if (isEmailValid && isEmailValid.length) {
      isEmailValid = false;
    } else {
      isEmailValid = true;
    }

    for (let i = 0; i < 3; i++) {
      if (
        customErrors[validatePhoneFields[i]] &&
        customErrors[validatePhoneFields[i]].length
      ) {
        isAdditionalPhoneValid = false;
      }
    }
    for (let i = 0; i < 3; i++) {
      if (
        customErrors[validateEmailFields[i]] &&
        customErrors[validateEmailFields[i]].length
      ) {
        isAdditionalEmailValid = false;
      }
    }

    const setError = (fieldName, errorMsg) => {
      setCustomErrors((prevErrors) => ({
        ...prevErrors,
        [fieldName]: errorMsg,
      }));
    };

    if (isPhoneValid && primaryPhone === 0) {
      setError('phone', 'At least one phone number should be primary.');
    } else if (isPhoneValid) {
      setError('phone', '');
    }

    if (isEmailValid && primaryEmail === 0) {
      setError('email', 'At least one email should be primary.');
    } else if (isEmailValid) {
      setError('email', '');
    }

    let address1 = body?.address?.address1;
    let longitude = body?.address?.longitude;
    let latitude = body?.address?.latitude;

    if (
      (address1 && address1.length) ||
      (longitude && longitude.length) ||
      (latitude && latitude.length)
    ) {
      setError('addressValidation', '');
    } else {
      setError('addressValidation', 'Please select a valid address');
    }

    if (
      primaryPhone !== 0 &&
      primaryEmail !== 0 &&
      address1 &&
      longitude &&
      latitude &&
      isPhoneValid &&
      isEmailValid &&
      isAdditionalPhoneValid &&
      isAdditionalEmailValid
    ) {
      if (
        !duplicateConfirmation &&
        (await identifyDuplicates(
          body.first_name,
          body.last_name,
          body.address,
          body.birth_date
        ))
      ) {
        return;
      }
      setDuplicateConfirmation(null);

      if (donorID) {
        try {
          const response = await makeAuthorizedApiRequest(
            'PUT',
            `${BASE_URL}/contact-donors/${donorID}`,
            JSON.stringify(body)
          );

          if (!response.ok) {
            // Handle non-successful response (e.g., show an error message)
            const errorData = await response.json();
            const errorMessage = Array.isArray(errorData?.message)
              ? errorData?.message[0]
              : errorData?.message;
            toast.error(`${errorMessage}`, { autoClose: 3000 });
            return; // Exit the function on error
          }

          const data = await response.json();

          if (data?.status === 201) {
            // Handle successful response
            setModalPopUp(true);
            setIsNavigate(true);
          } else {
            // Handle other response status codes (if needed)
            const showMessage = Array.isArray(data?.message)
              ? data?.message[0]
              : data?.message;
            toast.error(`${showMessage}`, { autoClose: 3000 });
          }
        } catch (error) {
          console.error('API request error:', error);
          toast.error(`${error?.message}`, { autoClose: 3000 });
        }
      } else {
        try {
          const response = await makeAuthorizedApiRequest(
            'POST',
            `${BASE_URL}/contact-donors`,
            JSON.stringify(body)
          );

          if (!response.ok) {
            // Handle non-successful response (e.g., show an error message)
            const errorData = await response.json();
            const errorMessage = Array.isArray(errorData?.message)
              ? errorData?.message[0]
              : errorData?.message;
            toast.error(`${errorMessage}`, { autoClose: 3000 });
            return; // Exit the function on error
          }

          const data = await response.json();

          if (data?.status === 201) {
            // Handle successful response
            // if (duplicateConfirmation) {
            //   let duplicateBody = {
            //     record_id: data?.data?.id,
            //   };
            //   const duplicateResponse = await makeAuthorizedApiRequest(
            //     'POST',
            //     `${BASE_URL}/contact-donors/${duplicateConfirmation?.duplicate.donor_id}/duplicates/create`,
            //     JSON.stringify(duplicateBody)
            //   );
            //   const duplicateData = await duplicateResponse.json();
            //   if (duplicateData?.status !== 'success') {
            //     toast.error('Donor duplicate not created.', {
            //       autoClose: 3000,
            //     });
            //   }
            //   setModalPopUp(true);
            //   setIsNavigate(true);
            // } else {
            setModalPopUp(true);
            setIsNavigate(true);
            // }
          } else {
            // Handle other response status codes (if needed)
            const showMessage = Array.isArray(data?.message)
              ? data?.message[0]
              : data?.message;
            toast.error(`${showMessage}`, { autoClose: 3000 });
          }
        } catch (error) {
          console.error('API request error:', error);
          toast.error(`${error?.message}`, { autoClose: 3000 });
        }
      }
    }
    setLoading(false);
  };

  // ADDRESSES
  const getPlacePredictions = (input) => {
    if (window.google) {
      const autocompleteService =
        new window.google.maps.places.AutocompleteService();
      autocompleteService.getPlacePredictions(
        {
          input,
          componentRestrictions: { country: 'us' },
        },
        (predictions, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            setPredictions(predictions);
          } else {
            setPredictions([]);
          }
        }
      );
    }
  };

  const getPlaceDetails = (address) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: address }, (results, status) => {
      if (status === window.google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          const place = results[0];
          setAddDonor((prevData) => {
            const city = getAddressComponent(place, 'locality');
            const county = getAddressComponent(
              place,
              'administrative_area_level_2'
            );

            setValue('zip_code', getAddressComponent(place, 'postal_code'));
            setValue('city', removeCountyWord(city || county));
            setValue(
              'state',
              getAddressComponent(
                place,
                'administrative_area_level_1',
                'short_name'
              )
            );
            setValue('country', getAddressComponent(place, 'country'));
            setValue('county', removeCountyWord(county));

            const updatedAddress = {
              address1: getAddressComponent(place, 'street_number'),
              address2: getAddressComponent(place, 'route'),
              county: county,
              coordinates: {
                latitude: place.geometry.location.lat().toString(),
                longitude: place.geometry.location.lng().toString(),
              },
              latitude: place.geometry.location.lat().toString(),
              longitude: place.geometry.location.lng().toString(),
            };

            setValue(
              'mailing_address',
              `${updatedAddress.address1} ${updatedAddress.address2}`
            );
            if (donorID) {
              return {
                ...prevData,
                address: {
                  ...updatedAddress,
                  id: addDonor?.address?.id,
                  addressable_id: addDonor?.address?.addressable_id,
                },
              };
            } else {
              return {
                ...prevData,
                address: {
                  ...updatedAddress,
                },
              };
            }
          });
        }
      }
    });
  };

  const getAddressComponent = (place, type, key = 'long_name') => {
    const addressComponent = place.address_components.find((component) =>
      component.types.includes(type)
    );
    return addressComponent ? addressComponent[key] : '';
  };

  const handlePredictionClick = (prediction) => {
    getPlaceDetails(prediction.description);
    setPredictions([]);
  };

  function handleKeyPress(event) {
    if (event.key === 'Enter') {
      getPlaceDetails();
    }
  }

  // ADDRESSES

  // CONTACTS

  function handleContactInput(updatedContactType, updatedValue, type, value) {
    let prev = addDonor;
    if (updatedContactType === 1) {
      prev = { ...prev, workPhone: updatedValue };
    }
    if (updatedContactType === 2) {
      prev = { ...prev, mobPhone: updatedValue };
    }
    if (updatedContactType === 3) {
      prev = { ...prev, otherPhone: updatedValue };
    }
    if (updatedContactType === 4) {
      prev = { ...prev, workEmail: updatedValue };
    }
    if (updatedContactType === 5) {
      prev = { ...prev, homeEmail: updatedValue };
    }
    if (updatedContactType === 6) {
      prev = { ...prev, otherEmail: updatedValue };
    }
    const existingContactIndex = prev.contact.findIndex(
      (contact) => contact.contact_type === updatedContactType
    );

    if (existingContactIndex !== -1) {
      // If the updated value is empty, remove the contact object
      if (updatedValue === '') {
        if (type === 'phone' && value === primaryPhone) {
          setPrimaryPhone(0);
        }
        if (type === 'email' && value === primaryEmail) {
          setPrimaryEmail(0);
        }
        const updatedContactArray = [...prev.contact];
        updatedContactArray.splice(existingContactIndex, 1);

        setAddDonor({
          ...prev,
          contact: updatedContactArray,
        });
      } else {
        if (type === 'phone') {
          if (primaryPhone === 0) {
            setPrimaryPhone(value);
          }
        }
        if (type === 'email') {
          if (primaryEmail === 0) {
            setPrimaryEmail(value);
          }
        }

        // If a contact with the same contact_type exists and the value is not empty, update it

        setAddDonor({
          ...prev,
          contact: prev.contact.map((contact, index) =>
            index === existingContactIndex
              ? {
                  ...contact,
                  contactable_id: contact.contactable_id,
                  contactable_type: 'donors',
                  contact_type: updatedContactType,
                  data: updatedValue,
                  is_archived: false,
                }
              : contact
          ),
        });
      }
    } else {
      // If a contact with the same contact_type doesn't exist and the value is not empty, add a new one
      if (updatedValue === '') {
        if (type === 'phone') {
          setPrimaryPhone(0);
        }
        if (type === 'email') {
          setPrimaryEmail(0);
        }
        setAddDonor(prev); // No change if the value is empty
      } else {
        if (type === 'phone') {
          if (primaryPhone === 0) {
            setPrimaryPhone(value);
          }
        }
        if (type === 'email') {
          if (primaryEmail === 0) {
            setPrimaryEmail(value);
          }
        }

        const updatedContactArray = [
          ...prev.contact,
          {
            contactable_id: parseInt(donorID),
            contactable_type: 'donors',
            contact_type: updatedContactType,
            data: updatedValue,
            is_archived: false,
          },
        ];

        // Automatically set the primary flag to true for the first time data is entered
        const section = Math.floor((updatedContactType - 1) / 3) + 1;
        if (!dataEntered[getSectionKey(section)]) {
          setDataEntered((prevDataEntered) => ({
            ...prevDataEntered,
            [getSectionKey(section)]: true,
          }));
        }
        setAddDonor({
          ...prev,
          contact: updatedContactArray,
        });
      }
    }
  }

  function getSectionKey(section) {
    return section === 1 ? 'phone' : 'email';
  }

  function handlePrimaryChange(type, value) {
    if (type === 'phone') {
      const field = addDonor.contact.find(
        (item) => item.contact_type === value
      );
      if (field && field.data.length) {
        setPrimaryPhone(value);
      }
    }
    if (type === 'email') {
      const field = addDonor.contact.find(
        (item) => item.contact_type - 3 === value
      );
      if (field && field.data.length) {
        setPrimaryEmail(value);
      }
    }
  }

  const validateContactFields = () => {
    let fields = addDonor.contact;
    let phoneExists = false;
    let emailExists = false;
    for (let i = 0; i < fields.length; i++) {
      // for phone fields
      if (fields[i].contact_type > 0 && fields[i].contact_type < 4) {
        if (fields[i].data && fields[i].data.length) {
          phoneExists = true;
        }
      }
      // for email fields
      if (fields[i].contact_type > 3 && fields[i].contact_type < 7) {
        if (fields[i].data && fields[i].data.length) {
          emailExists = true;
        }
      }
    }
    if (!phoneExists) {
      setCustomErrors((prevErrors) => ({
        ...prevErrors,
        phone: 'At least one phone number is required.',
      }));
    } else {
      setCustomErrors((prevErrors) => ({
        ...prevErrors,
        phone: '',
      }));
    }
    if (!emailExists) {
      setCustomErrors((prevErrors) => ({
        ...prevErrors,
        email: 'At least one email is required.',
      }));
    } else {
      setCustomErrors((prevErrors) => ({
        ...prevErrors,
        email: '',
      }));
    }
  };

  // CONTACTS

  const handleArchive = () => {
    setShowConfirmation(true);
  };

  const confirmArchive = async () => {
    if (donorID) {
      try {
        const response = await fetch(`${BASE_URL}/contact-donors/${donorID}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const { status } = await response.json();

        if (status === 204) {
          closeAfterFinish.current = true;
          setArchiveModalPopUp(true);
          // toast.success(message, { autoClose: 3000 });
          // navigate('/crm/contacts/donor/');
        } else {
          toast.error('Error archiving contact donor', { autoClose: 3000 });
        }
      } catch (error) {
        console.error('Error archiving data:', error);
      }

      setShowConfirmation(false);
    }
  };

  const cancelArchive = () => {
    setShowConfirmation(false);
  };

  const resetForm = () => {
    reset();
    setAddDonor(initialState);
    setPrimaryEmail(0);
    setPrimaryPhone(0);
    navigate(
      `/crm/contacts/donor/${duplicateConfirmation?.duplicate.donor_id}/view`
    );
  };

  useEffect(() => {
    if (datecleared) {
      const timeout = setTimeout(() => {
        setDateCleared(false);
      }, 1500);
      return () => clearTimeout(timeout);
    }
    return () => {};
  }, [datecleared]);

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={donorID ? 'Edit Donor' : 'Donor'}
        SearchValue={null}
        SearchOnChange={null}
        SearchPlaceholder={null}
      />

      <div className="mainContentInner form-container">
        <form className={styles.account} onSubmit={handleSubmit(onSubmit)}>
          <div className="formGroup mt-5">
            <h5>{donorID ? 'Edit Donor' : 'Create Donor (prospect)'}</h5>

            <div className="form-field">
              <div className="field">
                <input
                  type="text"
                  placeholder=" "
                  className="form-control"
                  value={addDonor?.external_id}
                  disabled
                />

                <label>Donor ID</label>
              </div>
            </div>

            <div className="form-field">
              <div className="field">
                {!donorID && (
                  <Controller
                    name="blood_type"
                    control={control}
                    defaultValue={addDonor.blood_type}
                    render={({ field }) => (
                      <>
                        <input
                          type="text"
                          placeholder=" "
                          maxLength={50}
                          className="form-control"
                          onChange={setUnsavedChanges(true)}
                          {...field}
                        />
                        <label>Blood Type</label>
                      </>
                    )}
                  />
                )}
              </div>
            </div>

            <SelectDropdown
              placeholder={'Prefix'}
              name="prefix_id"
              defaultValue={addDonor.prefix_id}
              searchable={true}
              selectedValue={
                addDonor.prefix_id?.value && addDonor.prefix_id?.value !== ''
                  ? addDonor.prefix_id
                  : null
              }
              removeDivider
              showLabel={
                addDonor.prefix_id !== null && addDonor.prefix_id !== ''
                  ? true
                  : false
              }
              onChange={(value) => {
                handleFormInput(
                  { target: { name: 'prefix_id', value: value } },
                  'prefix_id'
                );
              }}
              onBlur={(e) => {
                handleInputBlur(e);
              }}
              options={prefixes.map((item, index) => ({
                label: item.abbreviation,
                value: item.id,
              }))}
            />
            {customErrors.prefix_id && (
              <div className="error">
                <p>{customErrors.prefix_id}</p>
              </div>
            )}

            <SelectDropdown
              placeholder={'Suffix'}
              name="suffix_id"
              defaultValue={addDonor.suffix_id}
              searchable={true}
              selectedValue={
                addDonor.suffix_id?.value && addDonor.suffix_id?.value !== ''
                  ? addDonor.suffix_id
                  : null
              }
              removeDivider
              showLabel={
                addDonor.suffix_id !== null && addDonor.suffix_id !== ''
                  ? true
                  : false
              }
              onChange={(value) => {
                handleFormInput(
                  { target: { name: 'suffix_id', value: value } },
                  'suffix_id'
                );
              }}
              onBlur={(e) => {
                handleInputBlur(e);
              }}
              options={suffixes.map((item, index) => ({
                label: item.abbreviation,
                value: item.id,
              }))}
            />
            {customErrors.suffix_id && (
              <div className="error">
                <p>{customErrors.suffix_id}</p>
              </div>
            )}

            <div className="form-field">
              <div className="field">
                <Controller
                  name="first_name"
                  control={control}
                  defaultValue={addDonor.first_name}
                  render={({ field }) => (
                    <>
                      <input
                        type="text"
                        placeholder=" "
                        maxLength={50}
                        className="form-control"
                        onChange={setUnsavedChanges(true)}
                        {...field}
                      />
                      <label>First Name*</label>
                    </>
                  )}
                />
              </div>
              {errors.first_name && (
                <div className="error">
                  <div className="error">
                    <p>{errors.first_name.message}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="form-field">
              <div className="field">
                <Controller
                  name="last_name"
                  control={control}
                  defaultValue={addDonor.last_name}
                  render={({ field }) => (
                    <>
                      <input
                        type="text"
                        placeholder=" "
                        maxLength={50}
                        className="form-control"
                        onChange={setUnsavedChanges(true)}
                        {...field}
                      />
                      <label>Last Name*</label>
                    </>
                  )}
                />
              </div>
              {errors.last_name && (
                <div className="error">
                  <div className="error">
                    <p>{errors.last_name.message}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="form-field">
              <div className="field">
                <Controller
                  name="nick_name"
                  control={control}
                  defaultValue={addDonor.nick_name}
                  render={({ field }) => (
                    <>
                      <input
                        type="text"
                        placeholder=" "
                        maxLength={50}
                        className="form-control"
                        onChange={setUnsavedChanges(true)}
                        {...field}
                      />
                      <label>Nick Name</label>
                    </>
                  )}
                />
                <label>Nick Name</label>
              </div>
              {errors.nick_name && (
                <div className="error">
                  <div className="error">
                    <p>{errors.nick_name.message}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="form-field">
              <div className={`field form-datepicker`}>
                <Controller
                  name="birth_date"
                  control={control}
                  defaultValue={addDonor.birth_date}
                  render={({ field }) => (
                    <>
                      <DatePicker
                        onChange={(date) => field.onChange(date)}
                        label="Date of birth*"
                        value={field.value}
                        sx={{ width: 260 }}
                        disableFuture
                        slotProps={{
                          field: {
                            clearable: true,
                            onClear: () => setDateCleared(true),
                          },
                        }}
                      />
                    </>
                  )}
                />
              </div>
              {errors.birth_date && (
                <div className="error">
                  <div className="error">
                    <p>{errors.birth_date.message}</p>
                  </div>
                </div>
              )}
            </div>

            {/* MAILING ADDRESS */}
            <div className="form-field w-100">
              <div className="field">
                <Controller
                  name="mailing_address"
                  control={control}
                  defaultValue={addDonor.mailing_address}
                  render={({ field }) => (
                    <>
                      <input
                        type="text"
                        placeholder=" "
                        {...field}
                        onBlur={(e) => {
                          field.onBlur(e);
                          handleInputBlur();
                        }}
                        onChange={(e) => {
                          field.onChange(e);
                          handleFormInput(e, 'mailing_address');
                          handleInputBlur(e);
                        }}
                        onKeyDown={handleKeyPress}
                      />
                      <label>Mailing Address*</label>
                    </>
                  )}
                />
                {/* <input
                  type="text"
                  className="form-control"
                  placeholder=" "
                  value={addDonor.mailing_address}
                  name="mailing_address"
                  onBlur={handleInputBlur}
                  onChange={(e) => {
                    handleFormInput(e, 'mailing_address');
                    handleInputBlur(e);
                  }}
                  onKeyDown={handleKeyPress}
                /> */}
              </div>
              {errors.mailing_address && (
                <div className="error">
                  <p>{errors.mailing_address.message}</p>
                </div>
              )}
              {customErrors.addressValidation && (
                <div className="error">
                  <p>{customErrors.addressValidation}</p>
                </div>
              )}
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
                <Controller
                  name="zip_code"
                  control={control}
                  defaultValue={addDonor.zip_code}
                  render={({ field }) => (
                    <>
                      <input
                        type="text"
                        placeholder=" "
                        className="form-control"
                        maxLength={20}
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          handleFormInput(e, 'zip_code');
                          handleInputBlur(e);
                        }}
                      />
                      <label>Zip Code</label>
                    </>
                  )}
                />
              </div>
              {errors.zip_code && (
                <div className="error">
                  <p>{errors.zip_code.message}</p>
                </div>
              )}
            </div>

            <div className="form-field">
              <div className="field">
                <Controller
                  name="city"
                  control={control}
                  defaultValue={addDonor.city}
                  render={({ field }) => (
                    <>
                      <input
                        type="text"
                        placeholder=" "
                        className="form-control"
                        maxLength={20}
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          handleFormInput(e, 'city');
                          handleInputBlur(e);
                        }}
                      />
                      <label>City</label>
                    </>
                  )}
                />
              </div>
              {errors.city && (
                <div className="error">
                  <p>{errors.city.message}</p>
                </div>
              )}
            </div>

            <div className="form-field">
              <div className="field">
                <Controller
                  name="state"
                  control={control}
                  defaultValue={addDonor.state}
                  render={({ field }) => (
                    <>
                      <input
                        type="text"
                        placeholder=" "
                        className="form-control"
                        maxLength={20}
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          handleFormInput(e, 'state');
                          handleInputBlur(e);
                        }}
                      />
                      <label>State</label>
                    </>
                  )}
                />
              </div>
              {errors.state && (
                <div className="error">
                  <p>{errors.state.message}</p>
                </div>
              )}
            </div>

            <div className="form-field">
              <div className="field">
                <Controller
                  name="county"
                  control={control}
                  defaultValue={addDonor.county}
                  render={({ field }) => (
                    <>
                      <input
                        type="text"
                        placeholder=" "
                        className="form-control"
                        maxLength={20}
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          handleFormInput(e, 'county');
                          handleInputBlur(e);
                        }}
                      />
                      <label>County</label>
                    </>
                  )}
                />
              </div>
              {errors.county && (
                <div className="error">
                  <p>{errors.county.message}</p>
                </div>
              )}
            </div>

            {!donorID && (
              <div className="form-field checkbox">
                <span className="toggle-text">
                  {addDonor.is_active ? 'Active' : 'Inactive'}
                </span>
                <label htmlFor="toggle" className="switch">
                  <input
                    type="checkbox"
                    id="toggle"
                    className="toggle-input"
                    name="is_active"
                    checked={addDonor.is_active}
                    onChange={handleFormInput}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            )}
            {/* MAILING ADDRESS */}
          </div>
          {customFields && customFields?.length ? (
            <CustomFieldsForm
              control={control}
              formErrors={errors}
              customFileds={customFields}
            />
          ) : (
            ''
          )}
          <div className="formGroup mt-5">
            <h5>Contact Info</h5>
            <p className="w-100 mb-3">
              At least one phone number and email required
            </p>

            <h5 className="contact-heading mb-3 w-100">Phone*</h5>
            <div className="form-field">
              <FormInput
                classes={{ root: 'w-100 mb-0' }}
                label="Work Phone"
                name="workPhone"
                variant="phone"
                displayName="Work Phone"
                value={addDonor.workPhone}
                onChange={(e) => {
                  handleContactInput(1, e.target.value, 'phone', 1);
                }}
                error={customErrors.workPhone}
                required={false}
                onBlur={handleInputBlur}
              />
              <p className="radio-label">
                <input
                  type="radio"
                  name="primary"
                  id="phone"
                  checked={primaryPhone === 1}
                  className="form-check-input contact-radio"
                  onChange={() => handlePrimaryChange('phone', 1)}
                />{' '}
                Primary
              </p>
            </div>

            <div className="form-field">
              <FormInput
                classes={{ root: 'w-100 mb-0' }}
                label="Mobile Phone"
                name="mobPhone"
                variant="phone"
                displayName="Mobile Phone"
                value={addDonor.mobPhone}
                onChange={(e) => {
                  handleContactInput(2, e.target.value, 'phone', 2);
                }}
                error={customErrors.mobPhone}
                required={false}
                onBlur={handleInputBlur}
              />
              <p className="radio-label">
                <input
                  type="radio"
                  name="primary"
                  id="phone"
                  className="form-check-input contact-radio"
                  checked={primaryPhone === 2}
                  onChange={() => handlePrimaryChange('phone', 2)}
                />{' '}
                Primary
              </p>
            </div>

            <div className="form-field">
              <FormInput
                classes={{ root: 'w-100 mb-0' }}
                label="Other Phone"
                name="otherPhone"
                variant="phone"
                displayName="Other Phone"
                value={addDonor.otherPhone}
                onChange={(e) => {
                  handleContactInput(3, e.target.value, 'phone', 3);
                }}
                error={customErrors.otherPhone}
                required={false}
                onBlur={handleInputBlur}
              />
              <p className="radio-label">
                <input
                  type="radio"
                  name="primary"
                  id="phone"
                  className="form-check-input contact-radio"
                  checked={primaryPhone === 3}
                  onChange={() => handlePrimaryChange('phone', 3)}
                />{' '}
                Primary
              </p>
              {customErrors.phone && (
                <div className="error w-100">
                  <div className="error">
                    <p>{customErrors.phone}</p>
                  </div>
                </div>
              )}
            </div>

            <h5 className="contact-heading mb-3 w-100">Email*</h5>
            <div className="form-field">
              <div className="field">
                <input
                  type="text"
                  className="form-control"
                  value={addDonor.workEmail}
                  name="workEmail"
                  onBlur={handleInputBlur}
                  placeholder=" "
                  onChange={(e) => {
                    handleContactInput(4, e.target.value, 'email', 1);
                  }}
                />

                <label>Work Email</label>
              </div>
              {customErrors.workEmail && (
                <div className="error">
                  <div className="error">
                    <p>{customErrors.workEmail}</p>
                  </div>
                </div>
              )}
              <p className="radio-label">
                <input
                  type="radio"
                  name="emailPrimary"
                  id="phone"
                  className="form-check-input contact-radio"
                  checked={primaryEmail === 1}
                  onChange={() => handlePrimaryChange('email', 1)}
                />{' '}
                Primary
              </p>
            </div>
            <div className="form-field">
              <div className="field">
                <input
                  type="text"
                  className="form-control"
                  value={addDonor.homeEmail}
                  name="homeEmail"
                  onBlur={handleInputBlur}
                  placeholder=" "
                  onChange={(e) => {
                    handleContactInput(5, e.target.value, 'email', 2);
                  }}
                />

                <label>Home Email</label>
              </div>
              {customErrors.homeEmail && (
                <div className="error">
                  <div className="error">
                    <p>{customErrors.homeEmail}</p>
                  </div>
                </div>
              )}
              <p className="radio-label">
                <input
                  type="radio"
                  name="emailPrimary"
                  id="phone"
                  className="form-check-input contact-radio"
                  checked={primaryEmail === 2}
                  onChange={() => handlePrimaryChange('email', 2)}
                />{' '}
                Primary
              </p>
            </div>
            <div className="form-field">
              <div className="field">
                <input
                  type="text"
                  className="form-control"
                  value={addDonor.otherEmail}
                  name="otherEmail"
                  onBlur={handleInputBlur}
                  placeholder=" "
                  onChange={(e) => {
                    handleContactInput(6, e.target.value, 'email', 3);
                  }}
                />

                <label>Other Email</label>
              </div>
              {customErrors.otherEmail && (
                <div className="error">
                  <div className="error">
                    <p>{customErrors.otherEmail}</p>
                  </div>
                </div>
              )}
              <p className="radio-label">
                <input
                  type="radio"
                  name="emailPrimary"
                  id="phone"
                  className="form-check-input contact-radio"
                  checked={primaryEmail === 3}
                  onChange={() => handlePrimaryChange('email', 3)}
                />{' '}
                Primary
              </p>

              {customErrors.email && (
                <div className="error w-100">
                  <div className="error">
                    <p>{customErrors.email}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="promotions_editPromotion__IC8tg">
            {donorID ? (
              <FormFooter
                enableArchive={true}
                onClickArchive={() => handleArchive(true)}
                enableCancel={true}
                onClickCancel={handleCancelClick}
                enableSaveAndClose={true}
                saveAndCloseType={'submit'}
                onClickSaveAndClose={(e) => {
                  closeAfterFinish.current = true;
                  // handleSubmit(e);
                  handleSubmit(onSubmit);
                }}
                enableSaveChanges={true}
                saveChangesType={'submit'}
                onClickSaveChanges={(e) => {
                  closeAfterFinish.current = false;
                  // handleSubmit(e, false);
                  handleSubmit(onSubmit);
                }}
                disabled={isLoading}
              />
            ) : (
              <FormFooter
                enableCancel={true}
                onClickCancel={handleCancelClick}
                enableCreate={true}
                onCreateType={'submit'}
                onClickCreate={(e) => {
                  closeAfterFinish.current = true;
                  handleSubmit(e);
                  validateContactFields();
                }}
              />
            )}
          </div>
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
                  type="button"
                >
                  No
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => handleConfirmationResult(true)}
                  type="button"
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
      <SuccessPopUpModal
        title={'Success!'}
        message={donorID ? 'Donor Updated.' : 'Donor Created.'}
        modalPopUp={modalPopUp}
        setModalPopUp={setModalPopUp}
        showActionBtns={true}
        isNavigate={isNavigate}
        onConfirm={() => {
          if (closeAfterFinish.current) {
            navigate(-1);
          }
        }}
      />
      <SuccessPopUpModal
        title={'Success!'}
        message={'Donor is Archived.'}
        modalPopUp={archiveModalPopUp}
        setModalPopUp={setArchiveModalPopUp}
        showActionBtns={true}
        onConfirm={() => {
          if (closeAfterFinish.current) {
            navigate(-1);
          }
        }}
        isNavigate={isNavigate}
      />
      <ConfirmModal
        showConfirmation={showConfirmation}
        onCancel={cancelArchive}
        onConfirm={confirmArchive}
        icon={ConfirmArchiveIcon}
        heading={'Confirmation'}
        description={'Are you sure you want to archive?'}
      />
      <ConfirmModal
        showConfirmation={duplicateConfirmation !== null}
        onCancel={resetForm}
        onConfirm={() => onSubmit(getValues())}
        icon={WarningIcon}
        classes={{
          inner: donorStyles.duplicatePopup,
          btnGroup: 'gap-4',
          btn: 'w-50',
        }}
        cancelBtnText="Cancel"
        confirmBtnText="Proceed"
        heading={'Warning!'}
        description={duplicateConfirmationMessage()}
      />
    </div>
  );
}

export default DonorUpsert;
