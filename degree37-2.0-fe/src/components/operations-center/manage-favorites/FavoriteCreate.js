import React, { useState, useEffect } from 'react';
import SelectDropdown from '../../common/selectDropdown';
import FormInput from '../../common/form/FormInput';
import TopBar from '../../common/topbar/index';
import FormCheckbox from '../../common/form/FormCheckBox';
import FormToggle from '../../common/form/FormToggle';
import { fetchData } from '../../../helpers/Api';
import axios from 'axios';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import SuccessPopUpModal from '../../common/successModal';
import { Link, useNavigate } from 'react-router-dom';
import {
  OPERATIONS_CENTER,
  OPERATIONS_CENTER_MANAGE_FAVORITES_PATH,
} from '../../../routes/path';
import styles from './index.module.scss';

const locationTypeOption = [
  { label: 'Inside', value: 'Inside' },
  { label: 'Outside', value: 'Outside' },
  { label: 'Inside/Outside', value: 'InsideOutside' },
];

const operationTypeOption = [
  { label: 'Drives', value: 'Drives' },
  { label: 'Sessions', value: 'Sessions' },
  { label: 'Events', value: 'Events' },
];

const FavoriteCreate = () => {
  const bearerToken = localStorage.getItem('token');
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const [organizationLevelOption, setOrganizationLevelOption] = useState([]);
  const [proceduresOption, setProceduresOption] = useState([]);
  const [productsOption, setProductsOption] = useState([]);
  const [operationStatusOption, setOperationStatusOption] = useState([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const {
    handleSubmit,
    control,
    getValues,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  });

  const fetchDropdownData = async () => {
    const organizationLevel = await fetchData(
      '/organizational_levels?fetchAll=true',
      'GET'
    );
    const procedures = await fetchData('/procedures?fetchAll=true', 'GET');
    const operationStatus = await fetchData(
      '/booking-drive/operation-status?fetchAll=true',
      'GET'
    );
    if (organizationLevel?.data) {
      const organizationLevelOptions = organizationLevel.data.map((item) => ({
        label: item.name,
        value: item.id,
      }));
      setOrganizationLevelOption(organizationLevelOptions);
    }

    if (procedures?.data) {
      const proceduresOptions = procedures.data.map((item) => ({
        label: item.name,
        value: item.id,
      }));
      setProceduresOption(proceduresOptions);
    }

    if (operationStatus?.data) {
      const operationStatusOptions = operationStatus.data.map((item) => ({
        label: item.name,
        value: item.id,
      }));
      setOperationStatusOption(operationStatusOptions);
    }
  };

  useEffect(() => {
    fetchDropdownData();
  }, []);

  const BreadcrumbsData = [
    {
      label: 'Operations Center',
      class: 'disable-label',
      link: OPERATIONS_CENTER.DASHBOARD,
    },
    {
      label: 'Manage Favorites',
      class: 'active-label',
      link: OPERATIONS_CENTER_MANAGE_FAVORITES_PATH.LIST,
    },
    {
      label: 'Create Favorite',
      class: 'active-label',
      link: OPERATIONS_CENTER_MANAGE_FAVORITES_PATH.CREATE,
    },
  ];

  const submitHandler = async () => {
    try {
      setIsLoading(true);
      const res = await axios.post(
        `${BASE_URL}/operations-center/manage-favorites`,
        {
          name: getValues('name'),
          alternate_name: getValues('alternate_name'),
          location_type: getValues('location_type')?.value,
          organization_level_id: getValues('organization_level_id')?.value,
          operations_status_id: getValues('operations_status_id')?.value,
          operation_type: getValues('operation_type')?.value,
          is_active: getValues('is_active'),
          is_default: getValues('is_default'),
          is_open_in_new_tab: getValues('is_open_in_new_tab'),
          product_id: getValues('product_id')?.value,
          procedure_id: getValues('procedure_id')?.value,
        },
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        }
      );
      setIsLoading(false);

      if (res?.data?.response === 'Name already exists.') {
        toast.error('Favorite with this name already exists.');
      }

      if (res?.data?.status_code === 201) {
        setValue('is_default', false);
        setShowSuccessMessage(true);
      }
    } catch (error) {
      setIsLoading(false);
      console.log({ error });
      toast.error(error?.response?.data?.message?.[0]);
    }
  };
  const handleCancel = () => {
    if (isDirty) setShowCancelModal(true);
    else navigate(-1);
  };
  const watchFields = watch([
    'procedure_id',
    'product_id',
    'operations_status_id',
    'organization_level_id',
  ]);
  const fetchProducts = async () => {
    try {
      const products = await fetchData(
        `/operations-center/manage-favorites/products/${watchFields[0]?.value}`,
        'GET'
      );

      if (products?.data) {
        const productsOptions = products.data.map((item) => ({
          label: item.name,
          value: item.id,
        }));
        setProductsOption(productsOptions);
      }
    } catch (error) {
      toast.error('Error fetching products');
      console.log(error);
    }
  };
  useEffect(() => {
    setValue('product_id', null);
    if (watchFields[0]?.value) fetchProducts();
  }, [watchFields[0]?.value]);
  return (
    <div className="mainContent ">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Manage Favorites'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />
      <div className="mainContentInner form-container">
        <form>
          <div className="formGroup">
            <h5>Create Favorite</h5>

            <Controller
              name={`name`}
              control={control}
              defaultValue={''}
              render={({ field }) => (
                <FormInput
                  name="name"
                  displayName="Favorite Name"
                  value={field.value}
                  onChange={(e) => field.onChange(e)}
                  required
                  error={errors?.name?.message}
                  handleBlur={field.onBlur}
                />
              )}
            />

            <Controller
              name={`alternate_name`}
              control={control}
              defaultValue={''}
              render={({ field }) => (
                <FormInput
                  name="alternate_name"
                  displayName="Alternate Name"
                  value={field.value}
                  onChange={(e) => field.onChange(e)}
                  required={false}
                  error={errors?.alternate_name?.message}
                  handleBlur={field.onBlur}
                />
              )}
            />
            <Controller
              name={`organization_level_id`}
              control={control}
              defaultValue={null}
              render={({ field }) => (
                <SelectDropdown
                  placeholder={'Organization Level*'}
                  defaultValue={field.value}
                  selectedValue={field.value}
                  removeDivider
                  options={organizationLevelOption}
                  onBlur={field.onBlur}
                  showLabel
                  onChange={(e) => {
                    field.onChange(e);
                    setValue('organization_level_id', e);
                  }}
                  error={errors?.organization_level_id?.message}
                />
              )}
            />

            <div className="w-50"></div>

            <Controller
              name={`operation_type`}
              control={control}
              defaultValue={null}
              render={({ field }) => (
                <SelectDropdown
                  placeholder={'Operation Type'}
                  defaultValue={field.value}
                  selectedValue={field.value}
                  removeDivider
                  options={operationTypeOption}
                  onBlur={field.onBlur}
                  showLabel
                  onChange={(e) => {
                    field.onChange(e);
                    setValue('operation_type', e);
                  }}
                  error={errors?.operation_type?.message}
                />
              )}
            />
            <Controller
              name={`location_type`}
              control={control}
              defaultValue={null}
              render={({ field }) => (
                <SelectDropdown
                  placeholder={'Location Type'}
                  defaultValue={field.value}
                  selectedValue={field.value}
                  removeDivider
                  options={locationTypeOption}
                  onBlur={field.onBlur}
                  showLabel
                  onChange={(e) => {
                    field.onChange(e);
                    setValue('location_type', e);
                  }}
                  error={errors?.location_type?.message}
                />
              )}
            />
            <Controller
              name={`procedure_id`}
              control={control}
              defaultValue={null}
              render={({ field }) => (
                <SelectDropdown
                  placeholder={'Procedures'}
                  defaultValue={field.value}
                  selectedValue={field.value}
                  removeDivider
                  options={proceduresOption}
                  onBlur={field.onBlur}
                  showLabel
                  onChange={(e) => {
                    field.onChange(e);
                    setValue('procedure_id', e);
                  }}
                  error={errors?.procedure_id?.message}
                />
              )}
            />
            <Controller
              name={`product_id`}
              control={control}
              defaultValue={null}
              render={({ field }) => (
                <SelectDropdown
                  placeholder={'Products'}
                  defaultValue={field.value}
                  disabled={!watchFields[0]?.value}
                  selectedValue={field.value}
                  removeDivider
                  options={productsOption}
                  onBlur={field.onBlur}
                  showLabel
                  onChange={(e) => {
                    field.onChange(e);
                    setValue('product_id', e);
                  }}
                  error={errors?.product_id?.message}
                />
              )}
            />

            <Controller
              name={`operations_status_id`}
              control={control}
              defaultValue={null}
              render={({ field }) => (
                <SelectDropdown
                  placeholder={'Operation Status'}
                  defaultValue={field.value}
                  selectedValue={field.value}
                  removeDivider
                  options={operationStatusOption}
                  onBlur={field.onBlur}
                  showLabel
                  onChange={(e) => {
                    field.onChange(e);
                    setValue('operations_status_id', e);
                  }}
                  error={errors?.operations_status_id?.message}
                />
              )}
            />
            <div className="form-field w-100">
              <div className="field">
                <p className="mb-0">Other Settings</p>
              </div>
            </div>
            <Controller
              name={`is_open_in_new_tab`}
              control={control}
              defaultValue={true}
              render={({ field }) => (
                <FormCheckbox
                  name={'new_tab'}
                  displayName="Open in New Tab"
                  checked={field.value}
                  classes={{ root: 'w-25' }}
                  onChange={(e) => {
                    field.onChange(e.target.checked);
                  }}
                />
              )}
            />
            <Controller
              name={`is_default`}
              control={control}
              defaultValue={false}
              render={({ field }) => (
                <FormCheckbox
                  name={'is_default'}
                  displayName="Default"
                  checked={field.value}
                  classes={{ root: 'w-25' }}
                  onChange={(e) => {
                    field.onChange(e.target.checked);
                  }}
                />
              )}
            />
            <div className="w-50" />
            <div className="mt-3 w-100 bg-primary" />
            <Controller
              name={`is_active`}
              control={control}
              defaultValue={true}
              render={({ field }) => (
                <FormToggle
                  name={'is_active'}
                  displayName={'Active/Inactive'}
                  checked={field.value}
                  classes={{ root: 'w-50' }}
                  handleChange={(e) => {
                    field.onChange(e.target.checked);
                  }}
                />
              )}
            />
            <Link
              className={styles.linkPreview}
              target="_blank"
              to={`/operations-center/calendar-view?procedures=${
                watchFields[0]?.value ?? ''
              }&product=${watchFields[1]?.value ?? ''}&operation_status=${
                watchFields[2]?.value ?? ''
              }&organization_level=${
                watchFields[3]?.value ?? ''
              }&calendar_preview_types=monthly`}
            >
              Preview in Calendar
            </Link>
          </div>
        </form>
      </div>
      <div className="form-footer">
        <button
          className="btn btn-secondary border-0"
          onClick={handleCancel}
          disabled={isLoading}
        >
          Cancel
        </button>

        <button
          type="button"
          disabled={isLoading}
          className={` ${`btn btn-primary`}`}
          onClick={handleSubmit(submitHandler)}
        >
          Create
        </button>
        <SuccessPopUpModal
          title="Success!"
          message={'Favorite created.'}
          modalPopUp={showSuccessMessage}
          isNavigate={true}
          redirectPath={-1}
          showActionBtns={true}
          isArchived={false}
          setModalPopUp={setShowSuccessMessage}
        />
        <SuccessPopUpModal
          title="Confirmation"
          message={'Unsaved changes will be lost. Do you want to continue?'}
          modalPopUp={showCancelModal}
          setModalPopUp={setShowCancelModal}
          showActionBtns={false}
          isArchived={true}
          archived={() => navigate(-1)}
          acceptBtnTitle="Ok"
          rejectBtnTitle="Cancel"
        />
      </div>
    </div>
  );
};

export default FavoriteCreate;

const schema = yup.object().shape({
  name: yup
    .string()
    .required('Favorite name is required.')
    .min(2, 'Min characters allowed for Name are 2')
    .max(50, 'Max characters allowed for Name are 50'),
  alternate_name: yup
    .string()
    .max(50, 'Max characters allowed for Alternate Name are 50')
    .test(
      'min-length',
      'Min characters allowed for Alternate Name are 2',
      function (value) {
        if (value && value?.length === 1) {
          return false;
        }
        return true;
      }
    ),
  preview_in_calendar: yup.string(),
  organization_level_id: yup
    .object({
      name: yup.string(),
      id: yup.string(),
    })
    .required('Organization Level is required.'),

  operations_status_id: yup
    .object({
      name: yup.string(),
      id: yup.string(),
    })
    .nullable(),
  location_type: yup
    .object({
      name: yup.string(),
      id: yup.string(),
    })
    .nullable(),
  procedure_id: yup
    .object({
      name: yup.string(),
      id: yup.string(),
    })
    .nullable(),
  product_id: yup
    .object({
      name: yup.string(),
      id: yup.string(),
    })
    .nullable(),
  operation_type: yup
    .object({
      name: yup.string(),
      id: yup.string(),
    })
    .nullable(),
  is_open_in_new_tab: yup.bool().default(true),
  is_default: yup.bool().nullable(),
  is_active: yup.bool().default(true),
});
