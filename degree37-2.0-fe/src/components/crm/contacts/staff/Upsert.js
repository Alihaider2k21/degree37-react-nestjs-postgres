import React, { useEffect, useRef, useState } from 'react';
import TopBar from '../../../common/topbar/index';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './StaffNavigation.module.scss';
import staffStyles from './staff.module.scss';
import { toast } from 'react-toastify';
import CancelIconImage from '../../../../assets/images/ConfirmCancelIcon.png';
import SuccessPopUpModal from '../../../common/successModal';
import { makeAuthorizedApiRequest } from '../../../../helpers/Api';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import ConfirmModal from '../../../common/confirmModal';
import ConfirmArchiveIcon from '../../../../assets/images/ConfirmArchiveIcon.png';
import WarningIcon from '../../../../assets/images/warningIcon.png';
import { formatDate } from '../../../../helpers/formatDate';
import SelectDropdown from '../../../common/selectDropdown';
import FormInput from '../../../common/form/FormInput';
import CheckPermission from '../../../../helpers/CheckPermissions';
import CrmPermissions from '../../../../enums/CrmPermissionsEnum';
import { StaffBreadCrumbsData } from './StaffBreadCrumbsData';
import FormFooter from '../../../common/FormFooter';
import { StaffFormSchema } from './YupSchema';
import CustomFieldsForm from '../../../common/customeFileds/customeFieldsForm';
import { removeCountyWord } from '../../../../helpers/utils';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

function StaffUpsert() {
  const { id: staffID } = useParams();
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const token = localStorage.getItem('token');
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [isNavigate, setIsNavigate] = useState(false);
  const [modalPopUp, setModalPopUp] = useState(false);
  const [prefixes, setPrefixes] = useState([]);
  const [suffixes, setSuffixes] = useState([]);
  const [collectionOperations, setCollectionOperations] = useState([]);
  const [classification, setClassification] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [archiveModalPopUp, setArchiveModalPopUp] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [duplicateConfirmation, setDuplicateConfirmation] = useState(null);
  const closeAfterFinish = useRef(false);
  const [customFields, setcustomFields] = useState();
  const [datecleared, setDateCleared] = React.useState(false);
  const [dataEntered, setDataEntered] = useState({
    phone: false,
    email: false,
  });
  const StaffSchema = StaffFormSchema(customFields);
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
    getValues,
  } = useForm({
    resolver: yupResolver(StaffSchema),
  });

  const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const initialState = {
    prefix: '',
    suffix: '',
    collection_operation_id: '',
    classification_id: '',
    first_name: '',
    last_name: '',
    birth_date: null,
    is_archived: '',
    is_active: true,
    nick_name: '',
    mailing_address: '',
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
  const [addStaff, setAddStaff] = useState(initialState);

  const [primaryPhone, setPrimaryPhone] = useState(0);
  const [primaryEmail, setPrimaryEmail] = useState(0);

  const [customErrors, setCustomErrors] = useState({});

  const BreadcrumbsData = [
    ...StaffBreadCrumbsData,
    {
      label: `${staffID ? 'Edit Staff' : 'Create Staff'}`,
      class: 'disable-label',
      link: `${
        staffID ? `/crm/contacts/${staffID}/edit` : `/crm/contacts/staff/create`
      }`,
    },
  ];

  // Fetch Staff if ID
  const fetchStaff = async () => {
    const result = await fetch(`${BASE_URL}/contact-staff/${staffID}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    let { data } = await result.json();
    if (result.ok || result.status === 200) {
      setAddStaff(data);
      const defaultDate = dayjs(data.birth_date);
      const mailing_address =
        data?.address?.address1 + ' ' + data?.address?.address2;
      setValue('first_name', data.first_name);
      setValue('last_name', data.last_name);
      setValue('nick_name', data.nick_name);
      setValue('zip_code', data?.address?.zip_code);
      setValue('city', data?.address?.city);
      setValue('state', data?.address?.state);
      setValue('county', data?.address?.county);
      setValue('county', removeCountyWord(data?.address?.county));
      setValue('country', data?.address?.country);
      setValue(
        'collection_operation_id',
        parseInt(data.collection_operation_id.id)
      );
      setValue('classification_id', parseInt(data.classification_id.id));
      setValue('birth_date', defaultDate);
      setValue('mailing_address', mailing_address);
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
      setPrimaryPhone(primaryPhoneField.contact_type);
      setPrimaryEmail(primaryEmailField.contact_type - 3);

      setAddStaff((prevValue) => ({
        ...prevValue,
        prefix: {
          label: data.prefix?.abbreviation,
          value: data.prefix?.id,
        },
        suffix: {
          label: data.suffix?.abbreviation,
          value: data.suffix?.id,
        },
        workPhone: workPhone.length ? workPhone[0].data : '',
        mobPhone: mobPhone.length ? mobPhone[0].data : '',
        otherPhone: otherPhone.length ? otherPhone[0].data : '',
        workEmail: workEmail.length ? workEmail[0].data : '',
        homeEmail: homeEmail.length ? homeEmail[0].data : '',
        otherEmail: otherEmail.length ? otherEmail[0].data : '',
        classification_id: {
          label: data.classification_id.name,
          value: data.classification_id.id,
        },
        collection_operation_id: {
          label: data.collection_operation_id.name,
          value: data.collection_operation_id.id,
        },
      }));
    } else {
      toast.error('Error Fetching Staff Details.', { autoClose: 3000 });
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
      toast.error(`Failed to fetch.`, { autoClose: 3000 });
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
      toast.error(`Failed to fetch.`, { autoClose: 3000 });
    }
  };

  // Fetch Collection Operations
  const getCollectionOperations = async () => {
    try {
      const result = await makeAuthorizedApiRequest(
        'GET',
        `${BASE_URL}/business_units/collection_operations/list`
      );
      const data = await result.json();
      setCollectionOperations(data?.data);
    } catch (error) {
      toast.error(`Failed to fetch.`, { autoClose: 3000 });
    }
  };

  // Fetch classification_id
  const getClassification = async () => {
    try {
      const result = await fetch(`${BASE_URL}/staffing-admin/classifications`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await result.json();
      setClassification(data?.data);
    } catch (error) {
      toast.error(`Failed to fetch.`, { autoClose: 3000 });
    }
  };

  // Fetch Custom Fields
  const getCustomFields = async () => {
    try {
      const response = await makeAuthorizedApiRequest(
        'GET',
        `${BASE_URL}/system-configuration/organization-administration/custom-fields/modules/8`
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
        `${BASE_URL}/system-configuration/organization-administration/custom-fields/data?custom_field_datable_id=${staffID}&custom_field_datable_type=staff`
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
    getCollectionOperations();
    getClassification();
    if (staffID) {
      fetchStaff();
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
    const phoneCount = addStaff.contact.filter(
      (contact) => contact.contact_type >= 1 && contact.contact_type <= 3
    ).length;
    const emailCount = addStaff.contact.filter(
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
      setAddStaff((prevData) => ({
        ...prevData,
        mailing_address: e.target.value,
        city: '',
        zip_code: '',
        state: '',
        country: '',
      }));
    } else if (name === 'zip_code') {
      setAddStaff((prevData) => ({
        ...prevData,
        zip_code: e.target.value,
      }));
    } else if (name === 'city') {
      setAddStaff((prevData) => ({
        ...prevData,
        city: e.target.value,
      }));
    } else if (name === 'state') {
      setAddStaff((prevData) => ({
        ...prevData,
        state: e.target.value,
      }));
    } else if (name === 'county') {
      setAddStaff((prevData) => ({
        ...prevData,
        county: e.target.value,
      }));
    } else if (name === 'is_active') {
      setAddStaff((prevData) => ({
        ...prevData,
        [name]: fieldValue,
      }));
    } else {
      setAddStaff((prevData) => ({
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

  const validateContactFields = () => {
    let fields = addStaff.contact;
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

  const duplicateConfirmationMessage = () => {
    if (duplicateConfirmation === null) return;

    const contact = `${duplicateConfirmation.first_name} ${duplicateConfirmation.last_name}`;
    let criteria = null;
    if (
      duplicateConfirmation.duplicate.birth_date ===
      duplicateConfirmation.birth_date
    ) {
      criteria = formatDate(duplicateConfirmation.birth_date).split('|')[0];
    }
    if (
      duplicateConfirmation.duplicate.work_phone ===
      duplicateConfirmation.work_phone
    ) {
      criteria = duplicateConfirmation.work_phone;
    }
    if (
      duplicateConfirmation.duplicate.mobile_phone ===
      duplicateConfirmation.mobile_phone
    ) {
      criteria = duplicateConfirmation.mobile_phone;
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
    fields,
    birth_date = null
  ) => {
    const identifyPayload = { first_name, last_name, staff_id: staffID };
    if (birth_date) identifyPayload['birth_date'] = birth_date;
    for (const field of fields) {
      if (field.contact_type === 1) {
        identifyPayload['work_phone'] = field.data;
      } else if (field.contact_type === 2) {
        identifyPayload['mobile_phone'] = field.data;
      }
    }
    const response = await makeAuthorizedApiRequest(
      'POST',
      `${BASE_URL}/contact-staff/duplicates/identify`,
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
    let fields = addStaff.contact;
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
    const customFieldDatableType = 'staff'; // You can change this as needed
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
      prefix: parseInt(addStaff?.prefix?.value),
      suffix: parseInt(addStaff?.suffix?.value),
      collection_operation_id: parseInt(
        addStaff.collection_operation_id?.value
      ),
      classification_id: parseInt(addStaff.classification_id?.value),
      first_name: data.first_name,
      last_name: data.last_name,
      title: data.title,
      birth_date: data.birth_date.toISOString(),
      nick_name: data.nick_name,
      is_active: addStaff.is_active,
      address: {
        zip_code: data?.zip_code,
        city: data?.city,
        state: data?.state,
        country: data?.country,
        address1: addStaff?.address?.address1,
        address2: addStaff?.address?.address2,
        addressable_type: 'staff',
        county: addStaff?.address?.county,
        coordinates: {
          latitude: addStaff?.address?.coordinates?.latitue,
          longitude: addStaff?.address?.coordinates?.longitude,
        },
        latitude: addStaff?.address?.latitude,
        longitude: addStaff?.address?.longitude,
        id: staffID ? addStaff?.address?.id : null,
        addressable_id: staffID ? addStaff?.address?.addressable_id : null,
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
          fields,
          body.birth_date
        ))
      ) {
        return;
      }
      setDuplicateConfirmation(null);

      if (staffID) {
        try {
          const response = await makeAuthorizedApiRequest(
            'PUT',
            `${BASE_URL}/contact-staff/${staffID}`,
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
            `${BASE_URL}/contact-staff`,
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
            //     `${BASE_URL}/contact-staff/${duplicateConfirmation?.duplicate?.staff_id}/duplicates/create`,
            //     JSON.stringify(duplicateBody)
            //   );
            //   const duplicateData = await duplicateResponse.json();
            //   if (duplicateData?.status !== 'success') {
            //     toast.error('Staff duplicate not created.', {
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
  };

  // ADDRESSES
  const getPlacePredictions = (input) => {
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
  };

  const getPlaceDetails = (address) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: address }, (results, status) => {
      if (status === window.google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          const place = results[0];
          setAddStaff((prevData) => {
            const city = getAddressComponent(place, 'locality');
            const county = getAddressComponent(
              place,
              'administrative_area_level_2'
            );
            setValue('zip_code', getAddressComponent(place, 'postal_code'));
            setValue('city', removeCountyWord(city || county));
            setValue(
              'state',
              getAddressComponent(place, 'administrative_area_level_1')
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

            if (staffID) {
              return {
                ...prevData,
                address: {
                  ...updatedAddress,
                  id: addStaff?.address?.id,
                  addressable_id: addStaff?.address?.addressable_id,
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

  const getAddressComponent = (place, type) => {
    const addressComponent = place.address_components.find((component) =>
      component.types.includes(type)
    );
    return addressComponent ? addressComponent.long_name : '';
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
    let prev = addStaff;
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

        setAddStaff({
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

        setAddStaff({
          ...prev,
          contact: prev.contact.map((contact, index) =>
            index === existingContactIndex
              ? {
                  ...contact,
                  contactable_id: contact.contactable_id,
                  contactable_type: 'staff',
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
        setAddStaff(prev); // No change if the value is empty
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
            contactable_id: parseInt(staffID),
            contactable_type: 'staff',
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
        setAddStaff({
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
      const field = addStaff.contact.find(
        (item) => item.contact_type === value
      );
      if (field && field.data.length) {
        setPrimaryPhone(value);
      }
    }
    if (type === 'email') {
      const field = addStaff.contact.find(
        (item) => item.contact_type - 3 === value
      );
      if (field && field.data.length) {
        setPrimaryEmail(value);
      }
    }
  }

  // CONTACTS

  const handleArchive = () => {
    setShowConfirmation(true);
  };

  const confirmArchive = async () => {
    if (staffID) {
      try {
        const response = await fetch(`${BASE_URL}/contact-staff/${staffID}`, {
          method: 'PATCH',
        });
        const { status } = await response.json();

        if (status === 204) {
          closeAfterFinish.current = true;
          setArchiveModalPopUp(true);
          // toast.success(message, { autoClose: 3000 });
          // navigate('/crm/contacts/staff/');
        } else {
          toast.error('Error archiving contact staff', { autoClose: 3000 });
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
    setAddStaff(initialState);
    setPrimaryEmail(0);
    setPrimaryPhone(0);
    navigate(
      `/crm/contacts/staff/${duplicateConfirmation?.duplicate?.staff_id}/view`
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
        BreadCrumbsTitle={staffID ? 'Edit Contacts' : 'Contacts'}
        SearchValue={null}
        SearchOnChange={null}
        SearchPlaceholder={null}
      />

      <div className="mainContentInner form-container">
        <form className={styles.account} onSubmit={handleSubmit(onSubmit)}>
          <div className="formGroup">
            <h5>{staffID ? 'Edit Staff' : 'Create Staff'}</h5>

            <SelectDropdown
              placeholder={'Prefix'}
              name="prefix"
              defaultValue={addStaff.prefix}
              selectedValue={addStaff.prefix}
              removeDivider
              searchable={true}
              showLabel={
                addStaff.prefix !== null && addStaff.prefix !== ''
                  ? true
                  : false
              }
              onChange={(value) => {
                handleFormInput(
                  { target: { name: 'prefix', value: value } },
                  'prefix'
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
            {customErrors.prefix && (
              <div className="error">
                <p>{customErrors.prefix}</p>
              </div>
            )}

            <SelectDropdown
              placeholder={'Suffix'}
              name="suffix"
              defaultValue={addStaff.suffix}
              selectedValue={addStaff.suffix}
              removeDivider
              searchable={true}
              showLabel={
                addStaff.suffix !== null && addStaff.suffix !== ''
                  ? true
                  : false
              }
              onChange={(value) => {
                handleFormInput(
                  { target: { name: 'suffix', value: value } },
                  'suffix'
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
            {customErrors.suffix && (
              <div className="error">
                <p>{customErrors.suffix}</p>
              </div>
            )}

            <div className="form-field">
              <div className="field">
                <Controller
                  name="first_name"
                  control={control}
                  defaultValue={addStaff.first_name}
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
                  defaultValue={addStaff.last_name}
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
                  defaultValue={addStaff.nick_name}
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
                      <label>Nickname</label>
                    </>
                  )}
                />
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
                  defaultValue={addStaff.birth_date}
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
                  defaultValue={addStaff.mailing_address}
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
                  defaultValue={addStaff.zip_code}
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
                  defaultValue={addStaff.city}
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
                  defaultValue={addStaff.state}
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
                  defaultValue={addStaff.county}
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
            {/* MAILING ADDRESS */}

            <Controller
              name="collection_operation_id"
              control={control}
              render={({ field }) => (
                <SelectDropdown
                  removeDivider
                  placeholder="Collection Operation*"
                  name={field.name}
                  options={
                    collectionOperations?.length > 0
                      ? collectionOperations.map((item) => {
                          return {
                            value: +item?.id,
                            label: item?.name,
                          };
                        })
                      : []
                  }
                  selectedValue={addStaff.collection_operation_id}
                  onChange={(option) => {
                    field.onChange(option?.value);
                    setAddStaff((prevData) => ({
                      ...prevData,
                      collection_operation_id: option,
                    }));
                  }}
                  onBlur={field.onBlur}
                  error={errors?.collection_operation_id?.message}
                />
              )}
            />

            <Controller
              name="classification_id"
              control={control}
              render={({ field }) => (
                <SelectDropdown
                  removeDivider
                  placeholder="Classification*"
                  name={field.name}
                  options={
                    classification?.length > 0
                      ? classification.map((item) => {
                          return {
                            value: +item?.id,
                            label: item?.name,
                          };
                        })
                      : []
                  }
                  selectedValue={addStaff.classification_id}
                  onChange={(option) => {
                    field.onChange(option?.value);
                    setAddStaff((prevData) => ({
                      ...prevData,
                      classification_id: option,
                    }));
                  }}
                  onBlur={field.onBlur}
                  error={errors?.classification_id?.message}
                />
              )}
            />

            <div className="form-field checkbox">
              <span className="toggle-text">
                {addStaff.is_active ? 'Active' : 'Inactive'}
              </span>
              <label htmlFor="toggle" className="switch">
                <input
                  type="checkbox"
                  id="toggle"
                  className="toggle-input"
                  name="is_active"
                  checked={addStaff.is_active}
                  onChange={handleFormInput}
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
          {customFields && customFields.length ? (
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
                value={addStaff.workPhone}
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
                value={addStaff.mobPhone}
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
                value={addStaff.otherPhone}
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
                  maxLength="50"
                  className="form-control"
                  value={addStaff.workEmail}
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
                  maxLength="50"
                  className="form-control"
                  value={addStaff.homeEmail}
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
                  maxLength="50"
                  className="form-control"
                  value={addStaff.otherEmail}
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
            {staffID ? (
              <FormFooter
                enableArchive={CheckPermission([
                  CrmPermissions.CRM.CONTACTS.STAFF.ARCHIVE,
                ])}
                onClickArchive={() => handleArchive(true)}
                enableCancel={true}
                onClickCancel={handleCancelClick}
                enableSaveAndClose={true}
                saveAndCloseType={'submit'}
                onClickSaveAndClose={(e) => {
                  closeAfterFinish.current = true;
                  handleSubmit(e);
                }}
                enableSaveChanges={true}
                saveChangesType={'submit'}
                onClickSaveChanges={(e) => {
                  closeAfterFinish.current = false;
                  handleSubmit(e, false);
                }}
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
        message={staffID ? 'Staff updated.' : 'Staff created.'}
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
      <ConfirmModal
        showConfirmation={showConfirmation}
        onCancel={cancelArchive}
        onConfirm={confirmArchive}
        icon={ConfirmArchiveIcon}
        heading={'Confirmation'}
        description={'Are you sure you want to archive?'}
      />
      <SuccessPopUpModal
        title={'Success!'}
        message={'donor is archieved.'}
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
        showConfirmation={duplicateConfirmation !== null}
        onCancel={resetForm}
        onConfirm={() => onSubmit(getValues())}
        icon={WarningIcon}
        classes={{
          inner: staffStyles.duplicatePopup,
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

export default StaffUpsert;
