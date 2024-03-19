import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useParams } from 'react-router-dom';
import jwt from 'jwt-decode';
import TopBar from '../../../../../common/topbar/index';
import { FACILITIES_PATH } from '../../../../../../routes/path';
import { Row } from 'react-bootstrap';
import { makeAuthorizedApiRequest } from '../../../../../../helpers/Api';
import CancelModalPopUp from '../../../../../common/cancelModal';
import SuccessPopUpModal from '../../../../../common/successModal';
import FormInput from '../../../../../common/form/FormInput';
import { ResourcesManagementBreadCrumbsData } from '../ResourcesManagementBreadCrumbsData';
import styles from './index.module.scss';
import SelectDropdown from '../../../../../common/selectDropdown';
import FacilitySchema from './FormSchema';
import CustomFieldsForm from '../../../../../common/customeFileds/customeFieldsForm';
import moment from 'moment';
import { removeCountyWord } from '../../../../../../helpers/utils';
import GlobalMultiSelect from '../../../../../common/GlobalMultiSelect';

const EditFacility = () => {
  const bearerToken = localStorage.getItem('token');
  const { id } = useParams();
  const [collectionOperationData, setCollectionOperationData] = useState([]);
  const [industryCategoryData, setIndustryCategoryData] = useState([]);
  const [industrySubCategoryData, setIndustrySubCategoryData] = useState([]);
  const [customFileds, setcustomFields] = useState();
  const [redirect, setRedirect] = useState(false);
  const validationSchema = FacilitySchema(customFileds);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    resetField,
    setValue,
    getValues,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });
  const [facility, setFacility] = useState({});
  const [userId, setUserId] = useState(null);
  const [closeModal, setCloseModal] = useState(false);
  const [modalPopUp, setModalPopUp] = useState(false);
  const [archivePopup, setArchivePopup] = useState(false);
  const [archivedStatus, setArchivedStatus] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [predictionData, setPredictionsData] = useState({});
  const [selectedIndustryCategory, setSelectedIndustryCategory] =
    useState(null);
  const [selectedCollectionOperations, setSelectedCollectionOperations] =
    useState(null);
  const [selectedIndustrySubCategory, setSelectedIndustrySubCategory] =
    useState([]);
  const [categoryError, setCategoryError] = useState({
    category: '',
    subCategory: '',
  });
  const [donorCenterChecked, setDonorCenterChecked] = useState(false);
  const [stagingSiteChecked, setStagingSiteChecked] = useState(true);

  const handleDonorCenterChange = () => {
    setDonorCenterChecked(true);
    setStagingSiteChecked(false);
  };

  const handleStagingSiteChange = () => {
    setSelectedIndustryCategory(null);
    setSelectedIndustrySubCategory([]);
    setIndustrySubCategoryData([]);
    resetField('industry_category');
    resetField('industry_sub_category');
    setStagingSiteChecked(true);
    setDonorCenterChecked(false);
  };

  const apiKey = process.env.REACT_APP_GOOGLE_MAP_API_KEY;
  if (!window.google || !window.google.maps) {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.defer = true;
    script.async = true;
    document.head.appendChild(script);
  }

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
    setPredictionsData(prediction.description);
    getPlaceDetails(prediction.description);
    setPredictions([]);
  };

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
              city: city || removeCountyWord(county),
              state: getAddressComponent(place, 'administrative_area_level_1'),
              county: removeCountyWord(county),
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
    if (predictionData?.address1) {
      setValue(
        'physical_address',
        predictionData?.address1 + ' ' + predictionData?.address2
      );
      resetField('postal_code');
      resetField('city');
      resetField('state');
      resetField('county');
      setValue('postal_code', predictionData?.zip_code);
      setValue('city', predictionData?.city);
      setValue('state', predictionData?.state);
      setValue('county', predictionData?.county);
    }
  }, [predictionData]);

  const getCustomFields = async () => {
    try {
      const response = await makeAuthorizedApiRequest(
        'GET',
        `${BASE_URL}/system-configuration/organization-administration/custom-fields/data?custom_field_datable_id=${id}&custom_field_datable_type=donor_centers`
      );
      const data = await response.json();
      if (data?.status_code === 201) {
        const modified = data.data.map((item) => {
          return item.field_id;
        });
        setcustomFields(modified);
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

  useEffect(() => {
    fetchCollectionOperations();
    getCustomFields();
  }, []);

  useEffect(() => {
    const jwtToken = localStorage.getItem('token');
    if (jwtToken) {
      const decodeToken = jwt(jwtToken);
      if (decodeToken?.id) {
        setUserId(decodeToken?.id);
      }
    }
  }, [userId]);

  const getFacilityByID = async (id) => {
    try {
      const response = await fetch(
        `${BASE_URL}/system-configuration/facilities/${id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${bearerToken}`,
          },
        }
      );
      const data = await response.json();

      setFacility({
        ...data[0],
        collection_operation: data[0]?.collection_operation?.id,
        physical_address:
          data[0]?.address?.address1 + ' ' + data[0]?.address?.address2,
        postal_code: data[0]?.address?.zip_code,
        city: removeCountyWord(data[0]?.address?.city),
        county: removeCountyWord(data[0]?.address?.county),
        country: data[0]?.address?.country,
        state: data[0]?.address?.state,
      });
      if (data[0].donor_center) {
        setSelectedIndustryCategory({
          value: data[0]?.industry_category?.id,
          label: data[0]?.industry_category?.name,
        });
        await fetchIndustrySubCategories(data[0]?.industry_category?.id);
        setSelectedIndustrySubCategory(
          data[0]?.industry_sub_category.map((item) => {
            return {
              id: item?.id,
              name: item?.name,
            };
          })
        );
        setDonorCenterChecked(data[0]?.donor_center);
        setStagingSiteChecked(false);
      } else {
        setStagingSiteChecked(data[0]?.staging_site);
      }
      setSelectedCollectionOperations({
        value: data[0]?.collection_operation?.id,
        label: data[0]?.collection_operation?.name,
      });
    } catch (error) {
      toast.error(`${error?.message}`, { autoClose: 3000 });
    }
  };

  useEffect(() => {
    const fetchdata = async () => {
      await getFacilityByID(id);
    };
    fetchdata();
  }, [id]);

  const fetchCollectionOperations = async () => {
    const result = await makeAuthorizedApiRequest(
      'GET',
      `${BASE_URL}/business_units/collection_operations/list`
    );
    let { data } = await result.json();
    if (result.ok || result.status === 200) {
      setCollectionOperationData(data);
    } else {
      toast.error('Error Fetching Collection Operations', { autoClose: 3000 });
    }
  };
  const fetchIndustryCategories = async () => {
    const result = await makeAuthorizedApiRequest(
      'GET',
      `${BASE_URL}/accounts/industry_categories?status=true&sortBy=ASC&sortName=name&categories=true`
    );
    let { data } = await result.json();
    if (result.ok || result.status === 200) {
      setIndustryCategoryData(data);
    } else {
      toast.error('Error fetching industry categories', { autoClose: 3000 });
    }
  };
  const fetchIndustrySubCategories = async (parent_id) => {
    if (parent_id) {
      const result = await makeAuthorizedApiRequest(
        'GET',
        `${BASE_URL}/accounts/industry-subcategories/parent/${parent_id}`
      );

      let { data } = await result.json();
      if (result.ok || result.status === 200) {
        resetField('industry_sub_category');
        setIndustrySubCategoryData(
          data?.map((item) => {
            return {
              id: item?.id,
              name: item?.name,
            };
          })
        );
      } else {
        toast.error('Error fetching industry subategories', {
          autoClose: 3000,
        });
      }
    }
  };
  useEffect(() => {
    const fetchdata = async () => {
      await fetchIndustryCategories();
      await fetchCollectionOperations();
    };
    fetchdata();
  }, []);
  useEffect(() => {
    if (
      selectedIndustryCategory !== null &&
      selectedIndustryCategory !== undefined
    ) {
      fetchIndustrySubCategories(selectedIndustryCategory.value);
    }
  }, [selectedIndustryCategory]);

  useEffect(() => {
    const jwtToken = localStorage.getItem('token');
    if (jwtToken) {
      const decodeToken = jwt(jwtToken);
      if (decodeToken?.id) {
        setUserId(decodeToken?.id);
      }
    }
  }, [userId]);

  useEffect(() => {
    facility && reset(facility);
  }, [facility, industryCategoryData, collectionOperationData]);

  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const onSubmit = async (data) => {
    const industry_sub_category = selectedIndustrySubCategory?.map((item) =>
      parseInt(item.id)
    );
    if (donorCenterChecked) {
      const categoryError =
        selectedIndustryCategory === undefined ||
        selectedIndustryCategory === null;

      const subCategoryError =
        industrySubCategoryData.length > 0 &&
        selectedIndustrySubCategory.length === 0;
      setCategoryError((prevError) => ({
        ...prevError,
        category: categoryError ? 'Industry category is required.' : '',
      }));

      setCategoryError((prevError) => ({
        ...prevError,
        subCategory: subCategoryError
          ? 'Industry sub category is required.'
          : '',
      }));

      if (categoryError || subCategoryError) {
        return;
      }
    }
    const fieldsData = [];
    // const customFieldDatableId = 0; // You can change this as needed
    const customFieldDatableType = 'donor_centers'; // You can change this as needed
    let resulting;
    for (const key in data) {
      if (key > 0) {
        const value = data[key]?.value ?? data[key];
        fieldsData.push({
          field_id: key,
          field_data:
            typeof value === 'object' && !Array.isArray(value)
              ? moment(value).format('YYYY-MM-DD')
              : value?.toString(),
        });
      }
    }
    resulting = {
      fields_data: fieldsData,
      // custom_field_datable_id: customFieldDatableId,
      custom_field_datable_type: customFieldDatableType,
    };
    delete data.modified_at;
    delete data.modified_by;
    const body = {
      ...data,
      custom_fields: resulting,
      donor_center: donorCenterChecked,
      staging_site: stagingSiteChecked,
      industry_category: selectedIndustryCategory?.value || null,
      industry_sub_category: industry_sub_category,
      address: {
        latitude: predictionData?.latitude,
        longitude: predictionData?.longitude,
        county: predictionData?.county,
        address1: predictionData?.address1,
        address2: predictionData?.address2,
        state: predictionData?.state,
        country: predictionData?.country,
        city: predictionData?.city,
        zip_code: predictionData?.zip_code,
        created_by: parseInt(id),
      },
      created_by: +data?.created_by?.id,
      // updated_by: +userId,
    };

    try {
      setIsSubmitting(true);
      const bearerToken = localStorage.getItem('token');
      const response = await fetch(
        `${BASE_URL}/system-configuration/facilities/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${bearerToken}`,
          },
          body: JSON.stringify(body),
        }
      );
      const data = await response.json();
      if (data?.status === 'success') {
        setModalPopUp(true);
      } else if (response?.status === 400) {
        toast.error(`${data?.message?.[0] ?? data?.response}`, {
          autoClose: 3000,
        });
      } else {
        toast.error(`${data?.message?.[0] ?? data?.response}`, {
          autoClose: 3000,
        });
      }
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
      toast.error(`${error?.message}`, { autoClose: 3000 });
    }
  };
  const handleConfirmArchive = async () => {
    try {
      const body = {
        ...facility,
        collection_operation: facility.collection_operation,
        is_archived: true,
        created_by: parseInt(userId),
      };
      const response = await makeAuthorizedApiRequest(
        'PUT',
        `${BASE_URL}/system-configuration/facilities/${id}`,
        JSON.stringify(body)
      );
      const result = await response.json();
      if (result?.status === 'success') {
        setArchivePopup(false);
        setTimeout(() => {
          setArchivedStatus(true);
        }, 600);
      } else if (response?.status === 400) {
        setArchivePopup(false);
        toast.error(`${result?.message?.[0] ?? result?.response}`, {
          autoClose: 3000,
        });
      } else {
        setArchivePopup(false);
        toast.error(`${result?.message?.[0] ?? result?.response}`, {
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error(`${error?.message}`, { autoClose: 3000 });
    }
  };
  const BreadCrumbsData = [
    ...ResourcesManagementBreadCrumbsData,
    {
      label: 'Edit Facility',
      class: 'active-label',
      link: FACILITIES_PATH.EDIT.replace(':id', id),
    },
  ];

  const handleIndustrySubCategory = (data) => {
    setSelectedIndustrySubCategory((prevSelected) =>
      prevSelected.some((item) => item.id === data.id)
        ? prevSelected.filter((item) => item.id !== data.id)
        : [...prevSelected, data]
    );
  };
  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadCrumbsData}
        BreadCrumbsTitle={'Facilities'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />
      <div className="mainContentInner form-container ">
        <form className="addFacility" onSubmit={handleSubmit(onSubmit)}>
          <div className="formGroup">
            <h5>Edit Facility</h5>
            <div className="form-field">
              <div className="field">
                <input
                  {...register('name')}
                  type="text"
                  className="form-control"
                  name="name"
                  placeholder=" "
                />

                <label>Name*</label>
              </div>
              {errors?.name && (
                <div className="error">
                  <div className="error">
                    <p>{errors?.name?.message}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="form-field">
              <div className="field">
                <input
                  {...register('alternate_name')}
                  type="text"
                  className="form-control"
                  placeholder=" "
                  name="alternate_name"
                />
                <label>Alternate Name*</label>
              </div>
              {errors?.alternate_name && (
                <div className="error">
                  <p>{errors?.alternate_name?.message}</p>
                </div>
              )}
            </div>
            <div className="form-field">
              <div className="field">
                <input
                  {...register('physical_address')}
                  type="text"
                  className="form-control"
                  placeholder=" "
                  name="physical_address"
                  onChange={(e) => {
                    register('physical_address').onChange(e);
                    getPlacePredictions(e?.target?.value);
                  }}
                />
                <label>Physical Address*</label>
              </div>
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
              {errors?.physical_address && (
                <div className="error">
                  <p>{errors?.physical_address?.message}</p>
                </div>
              )}
            </div>
            <div className="form-field">
              <div className="field">
                <input
                  {...register('postal_code')}
                  type="text"
                  className="form-control"
                  placeholder=" "
                  name="postal_code"
                  onChange={(e) => {
                    register('postal_code').onChange(e);
                  }}
                />
                <label>Zip Code*</label>
              </div>
              {errors?.postal_code && (
                <div className="error">
                  <p>{errors?.postal_code?.message}</p>
                </div>
              )}
            </div>
            <div className="form-field">
              <div className="field">
                <input
                  {...register('city')}
                  type="text"
                  className="form-control"
                  placeholder=" "
                  name="city"
                  onChange={(e) => {
                    register('city').onChange(e);
                  }}
                />
                <label>City*</label>
              </div>
              {errors?.city && (
                <div className="error">
                  <p>{errors?.city?.message}</p>
                </div>
              )}
            </div>
            <div className="form-field">
              <div className="field">
                <input
                  {...register('state')}
                  type="text"
                  className="form-control"
                  placeholder=" "
                  name="state"
                  onChange={(e) => {
                    register('state').onChange(e);
                  }}
                />
                <label>State*</label>
              </div>
              {errors?.state && (
                <div className="error">
                  <p>{errors?.state?.message}</p>
                </div>
              )}
            </div>
            <div className={`form-field`}>
              <div className="field">
                <input
                  {...register('county')}
                  type="text"
                  className="form-control"
                  placeholder=" "
                  name="county"
                  onChange={(e) => {
                    register('county').onChange(e);
                  }}
                />
                <label>County*</label>
              </div>
              {errors?.county && (
                <div className="error">
                  <p>{errors?.county?.message}</p>
                </div>
              )}
            </div>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <FormInput
                  label="Phone"
                  name="phone"
                  variant="phone"
                  displayName="Phone"
                  value={getValues('phone')}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value?.length === 14) {
                      field.onChange(value);
                    }
                    setValue('phone', value);
                  }}
                  error={errors?.phone?.message}
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

            <div className="form-field checkbox">
              <span className="toggle-text">
                {watch('status') ? 'Active' : 'Inactive'}
              </span>
              <label htmlFor="toggle" className="switch">
                <input
                  {...register('status')}
                  type="checkbox"
                  name="status"
                  id="toggle"
                  className="toggle-input"
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
          <div className="formGroup">
            <h5>Attributes</h5>
            <div className="form-field">
              <div className="field">
                <input
                  {...register('code')}
                  type="text"
                  className="form-control"
                  name="phone"
                  disabled
                />
                <label>BECS Code</label>
              </div>
            </div>
            <Controller
              name="collection_operation"
              control={control}
              render={({ field }) => (
                <SelectDropdown
                  placeholder="Collection Operation*"
                  name={field.name}
                  options={
                    collectionOperationData?.length > 0
                      ? collectionOperationData.map((item) => {
                          return {
                            value: item?.id,
                            label: item?.name,
                          };
                        })
                      : []
                  }
                  selectedValue={selectedCollectionOperations}
                  onChange={(option) => {
                    field.onChange(option?.value);
                    setSelectedCollectionOperations(option);
                    setValue('collection_operation', option?.value || null);
                  }}
                  required={false}
                  onBlur={field.onBlur}
                  error={errors?.collection_operation?.message}
                  showLabel
                  removeDivider
                />
              )}
            />

            <Row className="w-100">
              <div className="form-field w-50 checkbox">
                <div className="field">
                  <input
                    // {...register('donor_center')}
                    className="form-check-input p-0"
                    style={{ marginLeft: 0 }}
                    type="radio"
                    name="centerType"
                    id="donorCenter"
                    checked={donorCenterChecked}
                    onChange={handleDonorCenterChange}
                  />
                  <label
                    style={{ left: 'auto' }}
                    className="text-dark"
                    htmlFor="donorCenter"
                  >
                    Donor Center
                  </label>
                </div>
              </div>
              <div className="form-field checkbox">
                <div className="field">
                  <input
                    className="form-check-input p-0"
                    // {...register('staging_site')}
                    type="radio"
                    name="centerType"
                    id="stagingSite"
                    checked={stagingSiteChecked}
                    onChange={handleStagingSiteChange}
                  />
                  <label
                    style={{ left: 'auto' }}
                    className="text-dark"
                    htmlFor="stagingSite"
                  >
                    Staging Site
                  </label>
                </div>
              </div>
            </Row>

            {donorCenterChecked ? (
              <>
                <Controller
                  name="industry_category"
                  control={control}
                  render={({ field }) => (
                    <SelectDropdown
                      placeholder="Industry Category*"
                      name={field.name}
                      options={
                        industryCategoryData?.length > 0
                          ? industryCategoryData.map((item) => {
                              return {
                                value: item?.id,
                                label: item?.name,
                              };
                            })
                          : []
                      }
                      selectedValue={selectedIndustryCategory}
                      onChange={(option) => {
                        field.onChange(option?.value);
                        if (option !== null) {
                          setCategoryError((prevError) => ({
                            ...prevError,
                            category: '',
                          }));
                        } else {
                          setCategoryError((prevError) => ({
                            ...prevError,
                            category: 'Industry category is required.',
                          }));
                        }
                        setSelectedIndustrySubCategory([]);
                        setIndustrySubCategoryData([]);
                        setCategoryError((prevError) => ({
                          ...prevError,
                          subCategory: 'Industry sub category is required.',
                        }));
                        setSelectedIndustryCategory(option);
                        setValue('industry_category', option?.value || null);
                      }}
                      required={false}
                      onBlur={field.onBlur}
                      error={categoryError.category}
                      showLabel
                      removeDivider
                    />
                  )}
                />
                <Controller
                  name="industry_sub_category"
                  control={control}
                  render={({ field }) => (
                    <div className="w-50">
                      <GlobalMultiSelect
                        name={field.name}
                        disabled={industrySubCategoryData?.length === 0}
                        data={industrySubCategoryData}
                        selectedOptions={selectedIndustrySubCategory}
                        onChange={(data) => {
                          handleIndustrySubCategory(data);
                        }}
                        onSelectAll={(e) => {
                          if (
                            selectedIndustrySubCategory.length !==
                            industrySubCategoryData.length
                          )
                            setSelectedIndustrySubCategory(e);
                          else setSelectedIndustrySubCategory([]);
                        }}
                        error={
                          industrySubCategoryData?.length === 0
                            ? ''
                            : selectedIndustrySubCategory.length > 0
                            ? ''
                            : categoryError.subCategory
                        }
                        label={`Industry SubCategory${
                          industrySubCategoryData?.length > 0 ? '*' : ''
                        }`}
                      />
                    </div>
                  )}
                />
              </>
            ) : (
              ''
            )}
          </div>
          {customFileds?.length > 0 && (
            <CustomFieldsForm
              control={control}
              // locationsData={locationsData}
              formErrors={errors}
              customFileds={customFileds}
            />
          )}
          <div className="form-footer">
            <div className="archived" onClick={() => setArchivePopup(true)}>
              Archive
            </div>

            <button
              className={`btn btn-link ${styles.footercancelbtn}`}
              onClick={(e) => {
                e.preventDefault();
                setCloseModal(true);
              }}
            >
              Cancel
            </button>
            <button
              disabled={isSubmitting}
              className={`btn btn-md me-4 ${styles.saveandclose} ${styles.createbtn}  btn-secondary`}
              onClick={() => {
                setRedirect(true);
                handleSubmit();
              }}
            >
              Save & Close
            </button>
            <button
              // type="button"
              disabled={isSubmitting}
              className={` ${`btn btn-primary btn btn-md me-4 ${styles.createbtn}`}`}
              onClick={handleSubmit}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
      <CancelModalPopUp
        title="Confirmation"
        message="Unsaved changes will be lost, do you wish to proceed?"
        modalPopUp={closeModal}
        isNavigate={true}
        setModalPopUp={setCloseModal}
        redirectPath={FACILITIES_PATH.LIST}
      />
      <SuccessPopUpModal
        title="Success!"
        message="Facility updated."
        modalPopUp={modalPopUp}
        isNavigate={redirect}
        setModalPopUp={setModalPopUp}
        showActionBtns={true}
        redirectPath={FACILITIES_PATH.LIST}
      />
      <SuccessPopUpModal
        title="Confirmation"
        message={'Are you sure you want to archive?'}
        modalPopUp={archivePopup}
        setModalPopUp={setArchivePopup}
        showActionBtns={false}
        isArchived={true}
        archived={handleConfirmArchive}
      />
      <SuccessPopUpModal
        title="Success!"
        message="Facility is archived."
        modalPopUp={archivedStatus}
        isNavigate={true}
        setModalPopUp={setArchivedStatus}
        showActionBtns={true}
        redirectPath={'/system-configuration/resource-management/facilities'}
      />
    </div>
  );
};

export default EditFacility;
