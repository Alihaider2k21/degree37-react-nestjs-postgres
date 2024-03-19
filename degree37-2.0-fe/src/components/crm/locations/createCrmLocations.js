import FormCheckbox from '../../common/form/FormCheckBox';
import FormInput from '../../common/form/FormInput';
import FormText from '../../common/form/FormText';
import SelectDropdown from '../../common/selectDropdown';
import TopBar from '../../common/topbar/index';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { Fragment, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import SuccessPopUpModal from '../../common/successModal';
import { Link } from 'react-router-dom';
import { fetchData, makeAuthorizedApiRequest } from '../../../helpers/Api';
import ToolTip from '../../common/tooltip/index';
import WarningIconImage from '../../../assets/images/warningIcon.png';
import CancelModalPopUp from '../../common/cancelModal';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FormToggle from '../../common/form/FormToggle';
import { LocationsBreadCrumbsData } from './LocationsBreadCrumbsData';
import { useNavigate } from 'react-router-dom';
import CustomFieldsForm from '../../common/customeFileds/customeFieldsForm';
import { customFieldsValidation } from '../../common/customeFileds/yupValidation';

// const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function CreateCrmLocations() {
  const [type, setType] = useState(null);
  const [contact, setContact] = useState(null);
  const [roomSize, setRoomSize] = useState(null);
  const [elevator, setElevator] = useState(null);
  const [createLocationModal, setCreateLocationModal] = useState(false);
  // const [qualificationStatus, setQualificationStatus] = useState(null);
  const [isContactLoading, setIsContactLoading] = useState(false);
  const [addContactsModal, setAddContactsModal] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [checkContact, setCheckContact] = useState('');
  const [roomSizeOption, setRoomSizeOption] = useState(null);
  const [contactOptions, setcontactOptions] = useState([]);
  const [isNavigate, setIsNavigate] = useState(false);
  // const [testSample, setTestSample] = useState(null);
  const [id, setId] = useState(null);
  const [duplicateChecked, SetDuplicateChecked] = useState(false);
  const [duplicateRecordId, SetDuplicateRecordId] = useState(null);
  const [existingAccountModal, setExistingAccountModal] = useState(false);
  const [tempContacts, setTempContacts] = useState(null);
  const [closeModal, setCloseModal] = useState(false);
  const [customFileds, setcustomFields] = useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const dynamicSchema = customFieldsValidation(customFileds);

  const schema = yup.object({
    ...dynamicSchema,
    name: yup
      .string()
      .required('Name is required.')
      .max(60, 'Should not be more than 60 characters.'),
    physical_address: yup
      .string()
      .required('Physical address is required.')
      .max(150, 'Should not be more than 150 characters.'),
    zip_code: yup
      .string()
      .required('Zip code is required.')
      .max(10, 'Should not be more than 10 characters.')
      .matches(/^\d+$/, 'Negative or decimal values are not allowed.'),
    city: yup.string().max(60, 'Should not be more than 60 characters.'),
    state: yup.string().max(60, 'Should not be more than 60 characters.'),
    county: yup.string().max(60, 'Should not be more than 60 characters.'),
    cross_street: yup
      .string()
      .max(60, 'Should not be more than 60 characters.'),
    floor: yup.string().max(60, 'Should not be more than 60 characters.'),
    room: yup
      .string()
      .required('Room is required.')
      .max(60, 'Should not be more than 60 characters.'),
    room_phone: yup
      .string()
      // .matches(
      //   phoneRegex,
      //   'Please enter room phone in the format (123) 456-7890.'
      // )
      .max(60, 'Should not be more than 60 characters.'),

    // qualification_status: yup
    //   .string()
    //   .required('Qualification status is required.'),
    site_type: yup.string().required('Site type is required.'),
    // becs_code: yup.string().required('Required'),

    room_size_id: yup.string().required('Room size is required.'),
    elevator: yup.string().required('Elevator is required.'),
    inside_stairs: yup
      .number()
      .typeError('Inside stairs must be a valid number.')
      .transform((value, originalValue) => {
        // If the originalValue is an empty string, return undefined to bypass the transformation
        return originalValue.trim() === '' ? undefined : value;
      })
      .min(0, 'Inside stairs cannot be a negative value.'),
    outside_stairs: yup
      .number()
      .typeError('Outside stairs must be a valid number.')
      .transform((value, originalValue) => {
        return originalValue.trim() === '' ? undefined : value;
      })
      .min(0, 'Outside stairs cannot be a negative value.'),
    electrical_note: yup
      .string()
      .max(150, 'Should not be more than 150 characters.'),
    special_instructions: yup
      .string()
      .max(150, 'Should not be more than 150 characters.'),
  });

  useEffect(() => {
    fetchRoomSize();
    getCustomFields();
  }, []);

  const getCustomFields = async () => {
    try {
      const response = await makeAuthorizedApiRequest(
        'GET',
        `${BASE_URL}/system-configuration/organization-administration/custom-fields/modules/5`
      );
      const data = await response.json();
      if (data?.status === 200) {
        setcustomFields(data.data);
      }
    } catch (error) {
      console.error(`Failed to fetch Locations data ${error}`, {
        autoClose: 3000,
      });
    }
  };

  const fetchRoomSize = async () => {
    fetchData('/room-size?&page=1&limit=1000&sortName= id', 'GET')
      .then((res) => {
        if (res?.data) {
          const roomSizeOptionData = res?.data?.map((item) => {
            return {
              label: item?.name,
              value: +item?.id,
            };
          });
          setRoomSizeOption(roomSizeOptionData);
          // test = roomSizeOptionData;
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const {
    setValue,
    handleSubmit,
    control,
    getValues,
    formState: { errors },
  } = useForm({
    mode: 'all',
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    fetchVolunteers(searchText);
  }, [searchText]);

  const fetchVolunteers = async (tes) => {
    setIsContactLoading(true);
    fetchData(
      `/contact-volunteer?sortOrder=DESC&sortName=id&page=1&limit=10000&name=${tes}`,
      'GET'
    )
      .then((res) => {
        if (res?.data) {
          const volunteersOptionData = res?.data?.map((item) => {
            return {
              name: item?.name,
              id: +item?.volunteer_id,
              email: item?.primary_email,
              phone: item?.primary_phone,
              city: item?.address_city,
            };
          });
          setcontactOptions(volunteersOptionData);
        }
        setIsContactLoading(false);
      })
      .catch((err) => {
        setIsContactLoading(false);
        console.error(err);
      });
  };

  const handleChange = (field, e) => {
    const { name, value } = e.target;
    if (name === 'physical_address') {
      getPlacePredictions(value);
    }
    field.onChange({ target: { name, value } });
    // setChangesMade(true);
  };

  const BreadcrumbsData = [
    ...LocationsBreadCrumbsData,
    {
      label: 'Create Location',
      class: 'disable-label',
      link: '#',
    },
  ];

  const typeOptions = [
    { label: 'Inside', value: 'Inside' },
    { label: 'Outside', value: 'Outside' },
    { label: 'Inside / Outside', value: 'Inside / Outside' },
  ];
  // const contactOptions = [
  //   { label: 'Site Conatct 1', value: 1 },
  //   { label: 'Site Conatct 2', value: 2 },
  //   { label: 'Site Conatct 3', value: 3 },
  // ];

  // const qualificationOptions = [
  //   {
  //     label: 'Qualified',
  //     value: 'Qualified',
  //   },
  //   {
  //     label: 'Expired',
  //     value: 'Expired',
  //   },
  //   {
  //     label: 'Not Qualified',
  //     value: 'Not Qualified',
  //   },
  // ];

  const elevatorOption = [
    {
      label: 'Yes',
      value: 'Yes',
    },
    {
      label: 'No',
      value: 'No',
    },
    {
      label: 'N/A',
      value: 'N/A',
    },
  ];

  const onSubmit = async (data) => {
    setLoading(true);
    const fieldsData = [];
    // const customFieldDatableId = 0; // You can change this as needed
    const customFieldDatableType = 'locations'; // You can change this as needed
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
      custom_field_datable_type: customFieldDatableType,
    };

    const body = {
      custom_fields: resulting,
      name: data?.name,
      floor: data?.floor,
      room: data?.room,
      room_phone: data?.room_phone,
      site_contact_id: +id || null,
      // qualification_status: data?.qualification_status,
      site_type: data?.site_type,
      is_active: data?.is_active,
      cross_street: data?.cross_street,
      address: {
        address1: predictionData?.address1,
        address2: predictionData?.address2,
        zip_code: data?.zip_code ?? predictionData?.zip_code,
        city: data?.city ?? predictionData?.city,
        state: data?.state ?? predictionData?.state,
        country: data?.country ?? predictionData?.country,
        county: data?.county ?? predictionData?.county,
        coordinates: {
          latitude: predictionData?.latitude,
          longitude: predictionData?.longitude,
        },
      },
      room_size_id: +data?.room_size_id,
      elevator: data?.elevator,
      outside_stairs: +data?.outside_stairs,
      inside_stairs: +data?.inside_stairs,
      electrical_note: data?.electrical_note,
      special_instructions: data?.special_instructions,
      specsData: [
        {
          cafeteria_available: data?.cafeteria_available,
        },
        {
          staff_break_area: data?.staff_break_area,
        },
        {
          rest_room_available: data?.rest_room_available,
        },
        {
          heat_available: data?.heat_available,
        },
        {
          ac_available: data?.ac_available,
        },
        {
          wireless_ok: data?.wireless_ok,
        },
        {
          automation_ok: data?.automation_ok,
        },
      ],
      becs_code: +data?.becs_code,
    };

    try {
      if (!duplicateChecked) {
        SetDuplicateChecked(true);
        const response = await makeAuthorizedApiRequest(
          'POST',
          `${BASE_URL}/crm/locations/duplicates/identify`,
          JSON.stringify(body)
        );
        let data = await response.json();
        if (data?.status_code === 409) {
          SetDuplicateRecordId(data?.data?.id);
          setExistingAccountModal(true);
        } else {
          await createAPI(body);
        }
      } else {
        await createAPI(body);
      }
    } catch (error) {
      toast.error(`${error?.message}`, { autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const createAPI = async (body) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/crm/locations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    let data = await response.json();
    if (data?.status === 'success') {
      setCreateLocationModal(true);
    } else if (data?.status !== 'success') {
      const showMessage = Array.isArray(data?.message)
        ? data?.response[0]
        : data?.response;
      toast.error(`${showMessage}`, { autoClose: 3000 });
    }
  };

  // ------------------------------------  google api ------------------------------------//

  const apiKey = process.env.REACT_APP_GOOGLE_MAP_API_KEY;
  if (!window.google || !window.google.maps) {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.defer = true;
    script.async = true;
    document.head.appendChild(script);
  }
  //   -------------------------------------------//
  const [predictions, setPredictions] = useState([]);
  const [predictionData, setPredictionsData] = useState({});

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

  const handlePredictionClick = (prediction) => {
    getPlaceDetails(prediction.description);
    setPredictions([]);
  };

  // const handleSiteContact = (item) => {
  //   setTempContacts(item);
  //   setContact(item.label);
  //   setId(item.value);
  //   setcontactOptions([]);
  //   setValue('site_contact_id', item.label || null);
  // };

  const getPlaceDetails = (address) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: address }, (results, status) => {
      if (status === window.google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          const place = results[0];
          setPredictionsData((prevData) => {
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

  useEffect(() => {
    if (
      predictionData?.address1 ||
      predictionData?.address2 ||
      predictionData?.zip_code ||
      predictionData?.city
    ) {
      setValue(
        'physical_address',
        predictionData?.address1 + ' ' + predictionData?.address2
      );

      setValue('zip_code', predictionData?.zip_code);
      setValue('city', predictionData?.city);
      setValue('state', predictionData?.state);
      setValue('county', predictionData?.county);
    }
  }, [predictionData, setValue]);

  const handleCancel = () => {
    setAddContactsModal(false);
    setCloseModal(false);
  };

  return (
    <div className="mainContent">
      <SuccessPopUpModal
        title="Success!"
        message={'Location created.'}
        modalPopUp={createLocationModal}
        isNavigate={true}
        setModalPopUp={setCreateLocationModal}
        showActionBtns={true}
        redirectPath={'/crm/locations'}
      />
      <CancelModalPopUp
        title="Confirmation"
        message="Unsaved changes will be lost, do you wish to proceed?"
        modalPopUp={closeModal}
        isNavigate={isNavigate}
        setModalPopUp={setCloseModal}
        redirectPath={'/crm/locations'}
        methodsToCall={true}
        methods={handleCancel}
      />
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Location'}
        SearchValue={null}
        SearchOnChange={null}
        SearchPlaceholder={null}
      />
      <div className="mainContentInner form-container">
        <form className="formGroup" onSubmit={handleSubmit(onSubmit)}>
          <div className="formGroup">
            <h5>Create Location</h5>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <FormInput
                  name={field.name}
                  displayName="Name*"
                  onChange={(e) => handleChange(field, e)}
                  value={field.value}
                  required={false}
                  error={errors?.name?.message}
                  onBlur={field.onBlur}
                />
              )}
            />
            <Controller
              name="physical_address"
              control={control}
              render={({ field }) => (
                <FormInput
                  name={field.name}
                  displayName="Physical Address*"
                  classes={{ root: 'w-100' }}
                  value={field.value}
                  onChange={(e) => handleChange(field, e)}
                  required={false}
                  error={errors?.physical_address?.message}
                  onBlur={field.onBlur}
                />
              )}
            />
            <div className="form-feild w-100 mb-3">
              <div className="feild">
                <ul className="list-group">
                  {predictions?.map((prediction) => (
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
            </div>
            <Controller
              name="zip_code"
              control={control}
              render={({ field }) => (
                <FormInput
                  name={field.name}
                  type="number"
                  displayName="Zip Code"
                  value={field.value}
                  onChange={(e) => handleChange(field, e)}
                  required={false}
                  error={errors?.zip_code?.message}
                  onBlur={field.onBlur}
                />
              )}
            />
            <Controller
              name="city"
              control={control}
              render={({ field }) => (
                <FormInput
                  name={field.name}
                  displayName="City"
                  value={field.value}
                  onChange={(e) => handleChange(field, e)}
                  required={false}
                  error={errors?.city?.message}
                  onBlur={field.onBlur}
                />
              )}
            />
            <Controller
              name="state"
              control={control}
              render={({ field }) => (
                <FormInput
                  name={field.name}
                  displayName="State"
                  value={field.value}
                  onChange={(e) => handleChange(field, e)}
                  required={false}
                  error={errors?.state?.message}
                  onBlur={field.onBlur}
                />
              )}
            />
            <Controller
              name="county"
              control={control}
              render={({ field }) => (
                <FormInput
                  name={field.name}
                  displayName="County"
                  value={field.value}
                  onChange={(e) => handleChange(field, e)}
                  required={false}
                  error={errors?.county?.message}
                  onBlur={field.onBlur}
                />
              )}
            />
            <Controller
              name="cross_street"
              control={control}
              render={({ field }) => (
                <FormInput
                  name={field.name}
                  displayName="Cross Street"
                  value={field.value}
                  onChange={(e) => handleChange(field, e)}
                  required={false}
                  error={errors?.cross_street?.message}
                  onBlur={field.onBlur}
                />
              )}
            />
            <Controller
              name="floor"
              control={control}
              render={({ field }) => (
                <FormInput
                  name={field.name}
                  displayName="Floor"
                  value={field.value}
                  onChange={(e) => handleChange(field, e)}
                  required={false}
                  error={errors?.floor?.message}
                  onBlur={field.onBlur}
                />
              )}
            />
            <Controller
              name="room"
              control={control}
              render={({ field }) => (
                <FormInput
                  name={field.name}
                  displayName="Room*"
                  value={field.value}
                  onChange={(e) => handleChange(field, e)}
                  required={false}
                  error={errors?.room?.message}
                  onBlur={field.onBlur}
                />
              )}
            />
            <Controller
              name="room_phone"
              control={control}
              render={({ field }) => (
                <FormInput
                  label="Room Phone"
                  name="room_phone"
                  variant="phone"
                  displayName="Room Phone"
                  value={getValues('room_phone')}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value?.length === 14 || value?.length === 0) {
                      field.onChange(value);
                    }
                    setValue('room_phone', value);
                  }}
                  error={errors?.room_phone?.message}
                  required={false}
                  onBlur={(e) => {
                    const value = e.target.value;
                    if (value?.length > 0) {
                      field.onBlur();
                    }
                  }}
                />
              )}
            />

            <div className="form-field">
              <div className="field">
                <Controller
                  name="site_contact_id"
                  control={control}
                  render={({ field }) => (
                    <FormInput
                      name={field.name}
                      displayName="Site Contact"
                      selectedValue={contact}
                      classes={{ root: 'w-100' }}
                      autoComplete="off"
                      icon={
                        <FontAwesomeIcon
                          width={15}
                          height={15}
                          onClick={() => setAddContactsModal(true)}
                          icon={faSearch}
                          style={{ color: '#A3A3A3', cursor: 'pointer' }}
                        />
                      }
                      value={contact}
                      onClick={() => setAddContactsModal(true)}
                      required={false}
                      error={errors?.site_contact_id?.message}
                      onBlur={field.onBlur}
                    />
                  )}
                />
              </div>
            </div>
            {/* <Controller
              name="qualification_status"
              control={control}
              render={({ field }) => (
                <SelectDropdown
                  name={field.name}
                  placeholder="Qualification Status*"
                  options={qualificationOptions}
                  selectedValue={qualificationStatus}
                  onChange={(option) => {
                    setQualificationStatus(option);
                    setValue('qualification_status', option?.value || null);
                  }}
                  required={false}
                  onBlur={field.onBlur}
                  error={errors?.qualification_status?.message}
                  showLabel
                  removeDivider
                />
              )}
            /> */}
            <div className="form-field w-100">
              <div className="field">
                <p className="mb-0 fw-bold">Attributes</p>
              </div>
            </div>
            <Controller
              name="site_type"
              control={control}
              render={({ field }) => (
                <SelectDropdown
                  name={field.name}
                  placeholder="Site Type*"
                  options={typeOptions}
                  selectedValue={type}
                  onChange={(option) => {
                    setType(option);
                    setValue('site_type', option?.value || null);
                  }}
                  required={false}
                  onBlur={field.onBlur}
                  error={errors?.site_type?.message}
                  showLabel
                  removeDivider
                />
              )}
            />
            <Controller
              name="becs_code"
              control={control}
              defaultValue="50001"
              render={({ field }) => (
                <FormInput
                  name={field.name}
                  disabled
                  type="number"
                  displayName="BECS Code"
                  value="50001"
                  required={false}
                />
              )}
            />
            <Controller
              name="is_active"
              control={control}
              defaultValue={true}
              render={({ field }) => (
                <FormToggle
                  name={field.name}
                  displayName={field.value ? 'Active' : 'Inactive'}
                  checked={field.value}
                  handleChange={(event) => {
                    field.onChange({
                      target: { value: event.target.checked },
                    });
                  }}
                />
              )}
            />
          </div>
          <div className="formGroup">
            <h5>Location Specs</h5>
            <Controller
              name="room_size_id"
              control={control}
              render={({ field }) => (
                <SelectDropdown
                  name={field.name}
                  placeholder="Room Size*"
                  options={roomSizeOption}
                  selectedValue={roomSize}
                  onChange={(option) => {
                    setRoomSize(option);
                    setValue('room_size_id', option?.value || null);
                  }}
                  required={false}
                  onBlur={field.onBlur}
                  error={errors?.room_size_id?.message}
                  showLabel
                  removeDivider
                />
              )}
            />

            <Controller
              name="elevator"
              control={control}
              render={({ field }) => (
                <SelectDropdown
                  name={field.name}
                  placeholder="Elevator*"
                  options={elevatorOption}
                  selectedValue={elevator}
                  onChange={(option) => {
                    setElevator(option);
                    setValue('elevator', option?.value || null);
                  }}
                  required={false}
                  onBlur={field.onBlur}
                  error={errors?.elevator?.message}
                  showLabel
                  removeDivider
                />
              )}
            />
            <Controller
              name="inside_stairs"
              control={control}
              render={({ field }) => (
                <FormInput
                  name={field.name}
                  type="number"
                  displayName="Inside Stairs"
                  value={field.value}
                  classes={{ root: 'create_locations_insite_stair' }}
                  onChange={(e) => handleChange(field, e)}
                  required={false}
                  error={errors?.inside_stairs?.message}
                  onBlur={field.onBlur}
                  icon={
                    <ToolTip
                      text={
                        'Please enter how many inside stairs are required for unloading'
                      }
                    />
                  }
                />
              )}
            />

            <Controller
              name="outside_stairs"
              control={control}
              render={({ field }) => (
                <FormInput
                  name={field.name}
                  type="number"
                  displayName="Outside Stairs"
                  value={field.value}
                  classes={{ root: 'create_locations_outsite_stair' }}
                  onChange={(e) => handleChange(field, e)}
                  required={false}
                  error={errors?.outside_stairs?.message}
                  onBlur={field.onBlur}
                  icon={
                    <ToolTip
                      text={
                        'Please enter how many outside stairs are required for unloading'
                      }
                    />
                  }
                />
              )}
            />

            <Controller
              name="electrical_note"
              control={control}
              render={({ field }) => (
                <FormText
                  name={field.name}
                  displayName="Electrical Note"
                  value={field.value}
                  classes={{ root: 'customPadding' }}
                  onChange={(e) => handleChange(field, e)}
                  required={false}
                  error={errors?.electrical_note?.message}
                  onBlur={field.onBlur}
                  icon={<ToolTip text={'Please Enter Electrical Note'} />}
                />
              )}
            />

            <Controller
              name="special_instructions"
              control={control}
              render={({ field }) => (
                <FormText
                  name={field.name}
                  displayName="Special Instructions"
                  value={field.value}
                  classes={{ root: 'customPadding' }}
                  onChange={(e) => handleChange(field, e)}
                  required={false}
                  error={errors?.special_instructions?.message}
                  onBlur={field.onBlur}
                  icon={<ToolTip text={'Please Enter Special Instructions'} />}
                />
              )}
            />
            <Controller
              name="automation_ok"
              control={control}
              defaultValue={false}
              render={({ field }) => (
                <FormCheckbox
                  name={field.name}
                  displayName="Automation OK"
                  checked={field.value}
                  classes={{ root: 'w-25' }}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              )}
            />

            <Controller
              name="wireless_ok"
              control={control}
              defaultValue={false}
              render={({ field }) => (
                <FormCheckbox
                  name={field.name}
                  displayName="Wireless OK"
                  checked={field.value}
                  classes={{ root: 'w-25' }}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              )}
            />

            <Controller
              name="ac_available"
              control={control}
              defaultValue={false}
              render={({ field }) => (
                <FormCheckbox
                  name={field.name}
                  displayName="AC Available"
                  checked={field.value}
                  classes={{ root: 'w-25' }}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              )}
            />

            <Controller
              name="heat_available"
              control={control}
              defaultValue={false}
              render={({ field }) => (
                <FormCheckbox
                  name={field.name}
                  displayName="Heat Available"
                  checked={field.value}
                  classes={{ root: 'w-25' }}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              )}
            />

            <Controller
              name="rest_room_available"
              control={control}
              defaultValue={false}
              render={({ field }) => (
                <FormCheckbox
                  name={field.name}
                  displayName="Restroom Available"
                  checked={field.value}
                  classes={{ root: 'w-25' }}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              )}
            />

            <Controller
              name="staff_break_area"
              control={control}
              defaultValue={false}
              render={({ field }) => (
                <FormCheckbox
                  name={field.name}
                  displayName="Staff Break Area"
                  checked={field.value}
                  classes={{ root: 'w-25' }}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              )}
            />
            <Controller
              name="cafeteria_available"
              control={control}
              defaultValue={false}
              render={({ field }) => (
                <FormCheckbox
                  name={field.name}
                  displayName="Cafeteria Available"
                  checked={field.value}
                  classes={{ root: 'w-25' }}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              )}
            />

            <div className="form-feild w-25">
              <div className="feild"></div>
            </div>
          </div>
          <CustomFieldsForm
            control={control}
            // locationsData={locationsData}
            formErrors={errors}
            customFileds={customFileds}
          />
          <div className={`form_footer position-fixed`}>
            <div></div>
            <div>
              <Link to="#">
                <span
                  className={`text-primary border-0 cursor-pointer cancel`}
                  onClick={() => {
                    setIsNavigate(true);
                    setCloseModal(true);
                  }}
                >
                  Cancel
                </span>
              </Link>
              <button
                type="submit"
                disabled={loading}
                className={`rounded btn btn-primary py-0 `}
              >
                Create
              </button>
            </div>
          </div>
          <section
            className={`popup full-section ${
              existingAccountModal ? 'active' : ''
            }`}
          >
            <div className="popup-inner" style={{ maxWidth: '500px' }}>
              <div className="icon">
                <img src={WarningIconImage} alt="CancelIcon" />
              </div>
              <div className="content">
                <h3>Warning!</h3>
                <p>
                  A duplicate has been found.{' '}
                  <span style={{ color: '#005375' }}>{getValues('name')}</span>
                  {' - '}
                  <span style={{ color: '#005375' }}>
                    {getValues('room')}
                  </span>{' '}
                  at{' '}
                  <span style={{ color: '#005375' }}>
                    {getValues('physical_address')}
                  </span>{' '}
                  already exists.
                  <br />
                  Please Click CANCEL to discard this record and be taken to
                  existing record for{' '}
                  <span style={{ color: '#005375' }}>{getValues('name')}</span>
                  {' - '}
                  <span style={{ color: '#005375' }}>
                    {getValues('room')}
                  </span>{' '}
                  or MODIFY to change room name or address.
                </p>
                <div className="buttons">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ width: '47%' }}
                    onClick={() => {
                      setExistingAccountModal(false);
                      SetDuplicateChecked(false);
                      navigate(`/crm/locations/${duplicateRecordId}/view`);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    style={{ width: '47%' }}
                    className="btn btn-primary"
                    onClick={(e) => {
                      setExistingAccountModal(false);
                      SetDuplicateChecked(false);
                    }}
                  >
                    Modify
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section
            className={`aboutAccountMain popup full-section ${
              addContactsModal ? 'active' : ''
            }`}
          >
            <div
              className="popup-inner"
              style={{ maxWidth: '950px', padding: '30px', paddingTop: '25px' }}
            >
              <div className="content">
                <div className="d-flex align-items-center justify-between">
                  <h3>Add Contacts</h3>
                  <div className="search">
                    <div className="formItem">
                      <input
                        type="text"
                        placeholder="Search"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="mt-4 overflow-y-auto"
                  style={{ height: '50vh' }}
                >
                  <div className="table-listing-main">
                    <div className="table-responsive">
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th className="table-head" width={'20%'}></th>
                            <th className="table-head">Name</th>
                            <th className="table-head">Email</th>
                            <th className="table-head">Phone</th>
                            <th className="table-head">City</th>
                          </tr>
                        </thead>
                        <tbody>
                          {isContactLoading ? (
                            <tr>
                              <td className="no-data" colSpan="10">
                                Data Loading
                              </td>
                            </tr>
                          ) : contactOptions.length > 0 ? (
                            contactOptions?.map((data, index) => (
                              <Fragment key={data.id}>
                                <tr>
                                  <td width={'1%'}>
                                    <input
                                      type="radio"
                                      name={data.name}
                                      value={data.id}
                                      style={{
                                        height: '15px',
                                        width: '15px',
                                      }}
                                      checked={tempContacts === data.id}
                                      onChange={() => {
                                        setTempContacts(data.id);
                                        setCheckContact(data.name);
                                      }}
                                    />
                                  </td>
                                  <td>{data?.name}</td>
                                  <td>{data?.email}</td>
                                  <td>{data?.phone}</td>
                                  <td>{data?.city}</td>
                                </tr>
                              </Fragment>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="12" className="text-center">
                                No Data Found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="buttons d-flex align-items-center justify-content-end mt-4">
                  <button
                    className="btn btn-link"
                    onClick={() => {
                      setIsNavigate(false);
                      setTempContacts(id);
                      setCheckContact('');
                      setCloseModal(true);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-md btn-primary"
                    onClick={() => {
                      if (!tempContacts) {
                        toast.error('Please select a contact.', {
                          autoClose: 3000,
                        });
                        return;
                      } else {
                        setValue('site_contact_id', tempContacts);
                        setContact(checkContact);
                        setId(tempContacts);
                        setAddContactsModal(false);
                      }
                    }}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </section>
        </form>
      </div>
    </div>
  );
}
