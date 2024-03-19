import React, { useEffect, useState } from 'react';
import TopBar from '../../../common/topbar/index';
import styles from './index.module.scss';
import FormInput from '../../../common/form/FormInput';
import SelectDropdown from '../../../common/selectDropdown';
import SuccessPopUpModal from '../../../common/successModal';
import CancelModalPopUp from '../../../common/cancelModal';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import { formatUser } from '../../../../helpers/formatUser';
import { API } from '../../../../api/api-routes.js';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import CheckPermission from '../../../../helpers/CheckPermissions';
import CrmPermissions from '../../../../enums/CrmPermissionsEnum';
import { NonCollectionProfilesBreadCrumbsData } from '../NonCollectionProfilesBreadCrumbsData';
import GlobalMultiSelect from '../../../common/GlobalMultiSelect/index.jsx';

const ProfileEdit = () => {
  const param = useParams();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [ownerId, SetOwnerId] = useState([]);
  const [collectionOperationData, setCollectionOperationData] = useState([]);
  const [eventCategory, setEventCategory] = useState([]);
  const [eventSubCategory, setEventSubCategory] = useState([]);
  const [isArchived, setIsArchived] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [isNavigate, setIsNavigate] = useState(false);
  const [collectionOperation, setCollectionOperation] = useState([]);
  const [collectionOperationError, setCollectionOperationError] = useState('');
  const [ownerError, setOwnerError] = useState('');
  const [nonCollectionProfileData, setNonCollectionProfileData] = useState({
    profile_name: '',
    alternate_name: '',
    event_category_id: null,
    event_subcategory_id: null,
    collection_operation_id: null,
    owner_id: null,
  });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [modalPopUp, setModalPopUp] = useState(false);
  const [closeModal, setCloseModal] = useState(false);

  const schema = Yup.object({
    profile_name: Yup.string().required('Profile name is required'),
    event_category_id: Yup.string().required('Event category is required'),
    event_subcategory_id: eventSubCategory.length
      ? Yup.string().required('Event sub category is required')
      : '',
  }).required();

  const {
    setValue,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    mode: 'all',
    resolver: yupResolver(schema),
    defaultValues: {
      event_category_id: '',
    },
  });

  const BreadcrumbsData = [
    ...NonCollectionProfilesBreadCrumbsData,
    {
      label: 'Edit Non-Collection Profiles',
      class: 'active-label',
      link: `/crm/non-collection-profiles/${param?.id}/edit`,
    },
  ];

  useEffect(() => {
    const accessToken = localStorage.getItem('token');
    const getCollectionOperations = async () => {
      try {
        const { data } =
          await API.nonCollectionProfiles.collectionOperation.getAll(
            accessToken,
            true
          );
        setCollectionOperationData(data?.data);
      } catch (error) {
        toast.error(`Failed to fetch`, { autoClose: 3000 });
      }
    };
    const getEventCategory = async () => {
      try {
        const { data } = await API.nonCollectionProfiles.eventCategory.getAll(
          accessToken,
          true
        );
        setEventCategory(data?.data);
      } catch (error) {
        toast.error(`Failed to fetch`, { autoClose: 3000 });
      }
    };
    const getNonCollectionProfile = async () => {
      try {
        const { data } =
          await API.nonCollectionProfiles.getNonCollectionProfile.get(
            accessToken,
            param.id
          );
        if (data?.data?.event_subcategory_id?.id) {
          try {
            const sub = await API.nonCollectionProfiles.eventSubCategory.getAll(
              accessToken,
              data.data.event_subcategory_id.id
            );
            setEventSubCategory(sub?.data?.data);
          } catch (error) {
            toast.error(`Failed to fetch`, { autoClose: 3000 });
          }
        }
        setIsActive(data?.data?.is_active);
        setValue('profile_name', data.data?.profile_name ?? null);
        setValue('alternate_name', data.data.alternate_name ?? null);
        setValue(
          'event_category_id',
          data?.data?.event_category_id?.id ?? null
        );
        if (data?.data?.event_subcategory_id?.id) {
          setValue(
            'event_subcategory_id',
            data?.data?.event_subcategory_id?.id ?? null
          );
        }
        setCollectionOperation(data?.data?.collection_operation_id);
        setValue(
          'collection_operation_id',
          data?.data?.collection_operation_id
        );
        setValue('owner_id', data?.data?.owner_id?.id ?? null);
        const ownerName = formatUser(data.data.owner_id, 1);
        let nonCollectionProfileData = {
          profile_name: data?.data?.profile_name ?? null,
          alternate_name: data?.data?.alternate_name ?? null,
          event_category_id: {
            value: data?.data?.event_category_id?.id ?? null,
            label: data?.data?.event_category_id?.name ?? null,
          },
          collection_operation_id: data?.data?.collection_operation_id,
          owner_id: {
            value: data?.data?.owner_id?.id ?? null,
            label: ownerName ?? null,
          },
          event_subcategory_id: null,
        };
        if (data?.data?.event_subcategory_id?.id) {
          nonCollectionProfileData = {
            ...nonCollectionProfileData,
            event_subcategory_id: {
              value: data?.data?.event_subcategory_id?.id ?? null,
              label: data?.data?.event_subcategory_id?.name ?? null,
            },
          };
        }
        setNonCollectionProfileData(nonCollectionProfileData);
      } catch (error) {
        toast.error(`Failed to fetch`, { autoClose: 3000 });
      }
    };
    getCollectionOperations();
    getEventCategory();
    getNonCollectionProfile();
  }, [BASE_URL, param, setValue]);
  useEffect(() => {
    const accessToken = localStorage.getItem('token');
    const getEventSubCategory = async () => {
      const paramId = +nonCollectionProfileData?.event_category_id.value;
      try {
        const { data } =
          await API.nonCollectionProfiles.eventSubCategory.getAll(
            accessToken,
            paramId,
            true
          );
        setEventSubCategory(data?.data);
      } catch (error) {
        toast.error(`Failed to fetch`, { autoClose: 3000 });
      }
    };
    if (nonCollectionProfileData?.event_category_id?.value) {
      getEventSubCategory();
    } else {
      setEventSubCategory([]);
    }
  }, [nonCollectionProfileData?.event_category_id]);

  useEffect(() => {
    const accessToken = localStorage.getItem('token');
    const getOwners = async () => {
      let paramId = '';
      if (collectionOperation?.length > 0)
        paramId = collectionOperation?.map((op) => op?.id).join(',');
      try {
        const { data } = await API.nonCollectionProfiles.ownerId.getAll(
          accessToken,
          paramId
        );
        SetOwnerId(data?.data);
      } catch (error) {
        toast.error(`Failed to fetch`, { autoClose: 3000 });
      }
    };
    if (collectionOperation.length > 0) {
      getOwners();
    } else {
      SetOwnerId([]);
    }
  }, [collectionOperation]);

  const handleFormInput = (field, e) => {
    const { value, name } = e.target;
    field.onChange({ target: { name, value } });
  };

  const archieveHandle = async () => {
    const accessToken = localStorage.getItem('token');
    const { data } = await API.nonCollectionProfiles.archive.patch(
      accessToken,
      param.id
    );
    if (data.status === 'success') {
      setShowSuccessMessage(true);
    }
    setModalPopUp(false);
  };

  const saveAndClose = async () => {
    setIsArchived(false);
    setIsNavigate(true);
  };
  const saveChanges = async () => {
    setIsArchived(false);
  };

  const handleChangeSelectEventCategory = (val) => {
    setValue('event_category_id', val?.value || null);
    if (
      +nonCollectionProfileData?.event_category_id?.value !== +val?.value ||
      val === null
    ) {
      setNonCollectionProfileData({
        ...nonCollectionProfileData,
        event_subcategory_id: null,
        event_category_id: val,
      });
      setValue('event_subcategory_id', null);
    } else {
      setNonCollectionProfileData({
        ...nonCollectionProfileData,
        event_category_id: val,
      });
    }
  };
  const handleChangeSelectEventSubCategory = (val) => {
    setValue('event_subcategory_id', val?.value || null);
    setNonCollectionProfileData({
      ...nonCollectionProfileData,
      event_subcategory_id: val,
    });
  };
  const handleCollectionOperationChange = (collectionOperationTemp) => {
    setCollectionOperationError('');
    setOwnerError('');
    let tempCo = [...collectionOperation];
    tempCo = tempCo.some((item) => item.id === collectionOperationTemp.id)
      ? tempCo.filter((item) => item.id !== collectionOperationTemp.id)
      : [...tempCo, collectionOperationTemp];
    if (!(tempCo?.length > 0)) {
      setCollectionOperationError('Collection Operation is required.');
      setOwnerError('Owner is required.');
      setValue('owner_id', null);
      setNonCollectionProfileData({
        ...nonCollectionProfileData,
        owner_id: null,
      });
    }
    setCollectionOperation(tempCo);
  };

  const handleCollectionOperationChangeAll = (data) => {
    setCollectionOperationError('');
    setOwnerError('');
    if (!(data?.length > 0)) {
      setCollectionOperationError('Collection Operation is required.');
      setOwnerError('Owner is required.');
      setValue('owner_id', null);
      setNonCollectionProfileData({
        ...nonCollectionProfileData,
        owner_id: null,
      });
    }
    setCollectionOperation(data);
  };
  const handleChangeSelectOwner = (val) => {
    setValue('owner_id', val?.value || null);
    setNonCollectionProfileData({
      ...nonCollectionProfileData,
      owner_id: val,
    });
    if (val == null) {
      setOwnerError('Owner is required.');
    } else {
      setOwnerError('');
    }
  };
  const handleIsActiveChange = (event) => {
    setIsActive(event.target.checked);
  };

  const onSubmit = async (data) => {
    const accessToken = localStorage.getItem('token');
    if (collectionOperation?.length === 0) {
      setCollectionOperationError('Collection operation is required.');
      return;
    }
    if (data?.owner_id == null) {
      setOwnerError('Owner is required.');
      return;
    }
    let body = {
      ...data,
      event_category_id: +data?.event_category_id,
      event_subcategory_id: +data?.event_subcategory_id,
      collection_operation_id: collectionOperation?.map((item) =>
        parseInt(item.id)
      ),
      owner_id: +data?.owner_id,
      is_active: isActive,
    };
    try {
      const { data } = await API.nonCollectionProfiles.update.put(
        accessToken,
        param.id,
        body
      );
      if (data?.status === 'success') {
        setModalPopUp(true);
      }
    } catch (e) {
      toast.error('Error in submitting data', { autoClose: 3000 });
    }
  };
  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Non-Collection Profiles'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />
      <div className="mainContentInner">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles.formcontainer}
        >
          <div className="formGroup">
            <h5 className={styles.heading}>Edit Non-Collection Profile</h5>
            <Controller
              name="profile_name"
              control={control}
              render={({ field }) => (
                <FormInput
                  name={field.name}
                  displayName="Profile Name*"
                  value={field.value}
                  error={errors?.profile_name?.message}
                  onBlur={field.onBlur}
                  required={false}
                  onChange={(e) => handleFormInput(field, e)}
                />
              )}
            />
            <Controller
              name="alternate_name"
              control={control}
              render={({ field }) => (
                <FormInput
                  name={field.name}
                  displayName="Alternate Name"
                  value={field.value}
                  required={false}
                  onChange={(e) => handleFormInput(field, e)}
                />
              )}
            />
          </div>
          <div className={`formGroup ${styles.attributeformcontainer}`}>
            <h5 className={styles.heading}>Attributes</h5>
            <Controller
              name="event_category_id"
              control={control}
              render={({ field }) => (
                <SelectDropdown
                  placeholder="Event Category*"
                  name={field.name}
                  options={eventCategory?.map((item) => ({
                    value: item?.id,
                    label: item?.name,
                  }))}
                  searchable={false}
                  removeDivider={true}
                  showLabel={true}
                  defaultValue={nonCollectionProfileData?.event_category_id}
                  selectedValue={nonCollectionProfileData?.event_category_id}
                  onChange={handleChangeSelectEventCategory}
                  error={errors?.event_category_id?.message}
                  required={false}
                  onBlur={field.onBlur}
                />
              )}
            />
            <Controller
              name="event_subcategory_id"
              control={control}
              render={({ field }) => (
                <SelectDropdown
                  placeholder={`Event Subcategory${
                    eventSubCategory?.length ? '*' : ''
                  }`}
                  name={field.name}
                  options={eventSubCategory?.map((item) => ({
                    value: item?.id,
                    label: item?.name,
                  }))}
                  searchable={false}
                  removeDivider={true}
                  showLabel={true}
                  disabled={eventSubCategory?.length ? false : true}
                  defaultValue={nonCollectionProfileData?.event_subcategory_id}
                  selectedValue={nonCollectionProfileData?.event_subcategory_id}
                  onChange={handleChangeSelectEventSubCategory}
                  error={
                    eventSubCategory?.length
                      ? errors?.event_subcategory_id?.message
                      : ''
                  }
                  required={false}
                  onBlur={eventSubCategory?.length ? field.onBlur : ''}
                />
              )}
            />
            <Controller
              name="collection_operation_id"
              control={control}
              render={({ field }) => (
                <div className="row w-50">
                  <GlobalMultiSelect
                    label="Collection Operation*"
                    data={collectionOperationData}
                    selectedOptions={collectionOperation}
                    error={collectionOperationError}
                    onChange={handleCollectionOperationChange}
                    onSelectAll={handleCollectionOperationChangeAll}
                    //onBlur={collectionOperationOnBlur}
                  />
                </div>
              )}
            />
            <Controller
              name="owner_id"
              control={control}
              render={({ field }) => (
                <SelectDropdown
                  placeholder="Owner*"
                  name={field.name}
                  disabled={collectionOperation.length === 0 ? true : false}
                  options={ownerId?.map((item) => ({
                    value: item?.id,
                    label: formatUser(item, 1),
                  }))}
                  searchable={false}
                  removeDivider={true}
                  showLabel={true}
                  defaultValue={nonCollectionProfileData?.owner_id}
                  selectedValue={nonCollectionProfileData?.owner_id}
                  onChange={handleChangeSelectOwner}
                  error={ownerError}
                  required={false}
                  onBlur={field.onBlur}
                />
              )}
            />
            <div className="form-field checkbox w-100">
              <span className="toggle-text">
                {isActive ? 'Active' : 'Inactive'}
              </span>
              <label htmlFor="toggle" className="switch">
                <input
                  type="checkbox"
                  id="toggle"
                  className="toggle-input"
                  name="is_active"
                  checked={isActive}
                  onChange={handleIsActiveChange}
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
          <div className={`form-footer-custom ${styles.footer}`}>
            <>
              {CheckPermission([
                CrmPermissions.CRM.NON_COLLECTION_PROFILES.ARCHIVE,
              ]) ? (
                <button
                  className={`btn btn-danger me-auto ms-0 ${styles.archivebtn}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsArchived(true);
                    setModalPopUp(true);
                  }}
                >
                  Archive
                </button>
              ) : (
                ''
              )}
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
                type="submit"
                className={`btn btn-md me-4 ${
                  styles.saveandclose
                } ${'btn-secondary'}`}
                onClick={saveAndClose}
              >
                Save & Close
              </button>
              <button
                type="submit"
                className={` ${`btn btn-primary btn btn-md me-4 ${styles.createbtn}`} ${'btn-primary'}`}
                onClick={saveChanges}
              >
                Save Changes
              </button>
            </>
          </div>
        </form>
      </div>
      <SuccessPopUpModal
        title={isArchived ? 'Confirmation' : 'Success!'}
        message={
          isArchived
            ? 'Are you sure you want to archive?'
            : 'Non-Collection Profile updated.'
        }
        modalPopUp={modalPopUp}
        setModalPopUp={setModalPopUp}
        showActionBtns={isArchived ? false : true}
        isArchived={isArchived}
        archived={archieveHandle}
        isNavigate={isNavigate}
        redirectPath={'/crm/non-collection-profiles'}
      />
      <SuccessPopUpModal
        title="Success"
        message={'Non-Collection profile is archived.'}
        modalPopUp={showSuccessMessage}
        showActionBtns={true}
        isArchived={false}
        isNavigate={true}
        setModalPopUp={setShowSuccessMessage}
        redirectPath={'/crm/non-collection-profiles'}
      />
      <CancelModalPopUp
        title="Confirmation"
        message="Unsaved changes will be lost, do you wish to proceed?"
        modalPopUp={closeModal}
        isNavigate={true}
        setModalPopUp={setCloseModal}
        redirectPath={'/crm/non-collection-profiles'}
      />
    </div>
  );
};

export default ProfileEdit;
