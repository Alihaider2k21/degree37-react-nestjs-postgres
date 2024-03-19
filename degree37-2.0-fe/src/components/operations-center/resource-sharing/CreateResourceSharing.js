import React, { useEffect } from 'react';
import TopBar from '../../common/topbar/index';
import styles from './index.module.scss';
import { Controller, useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import { useState } from 'react';
import SelectDropdown from '../../common/selectDropdown';
import FormInput from '../../common/form/FormInput';
import FormText from '../../common/form/FormText';
import SuccessPopUpModal from '../../common/successModal';
import CancelModalPopUp from '../../common/cancelModal';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import moment from 'moment';
import { toast } from 'react-toastify';
import { API } from '../../../api/api-routes.js';

const CreateResourceSharing = () => {
  const [startDate, setStartDate] = useState();
  const [closeModal, setCloseModal] = useState(false);
  const [modalPopUp, setModalPopUp] = useState(false);
  const [collectionOperationsOption, setCollectionOperationsOption] = useState(
    []
  );

  const [fromCollectionOperation, setFromCollectionOperation] = useState(null);
  const [toCollectionOperation, setToCollectionOperation] = useState(null);

  const accessToken = localStorage.getItem('token');
  const schema = Yup.object({
    start_date: Yup.string()
      .required('Start Date is required.')
      .test(
        'is-valid-date-range',
        'Start date must be before end date',
        function (value) {
          const { end_date } = this.parent;
          // Check if start date is not later than end date
          return !value || !end_date || new Date(value) <= new Date(end_date);
        }
      ),
    end_date: Yup.string()
      .required('End Date is required.')
      .test(
        'is-valid-date-range',
        'End date must be later than start date',
        function (value) {
          const { start_date } = this.parent;
          // Check if end date is later than start date
          return (
            !value || !start_date || new Date(value) >= new Date(start_date)
          );
        }
      ),
    description: Yup.string()
      .nullable(false)
      .max(500, 'Description must be at most 500 characters'),
    quantity: Yup.number()
      .typeError('Quantity is required.')
      .required('Quantity is required.')
      .min(1, 'Minimum Value should be 1.')
      .max(1000, 'Maximum Value should be 1000.'),
    share_type: Yup.object().required('Share Type is required.'),
    from_collection_operation_id: Yup.object().required(
      'From Collection operation is required.'
    ),
    to_collection_operation_id: Yup.object().required(
      'To Collection operation is required.'
    ),
  }).required();

  const {
    // setValue,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    mode: 'all',
    resolver: yupResolver(schema),
  });

  const SHARE_TYPE_ENUM = [
    {
      value: 1,
      label: 'Devices',
    },
    {
      value: 2,
      label: 'Staff',
    },
    {
      value: 3,
      label: 'Vehicles',
    },
  ];

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const { data } =
        await API.operationCenter.resourceSharing.getCollectionOperations(
          accessToken
        );
      const modifiedData = data?.data?.map((item) => {
        return {
          label: item?.name,
          value: +item.id,
        };
      });
      setCollectionOperationsOption(modifiedData);
    } catch (error) {
      toast.error(`Failed to fetch`, { autoClose: 3000 });
    }
  };

  const BreadcrumbsData = [
    {
      label: 'Operations Center',
      class: 'active-label',
      link: '/operations-center',
    },
    {
      label: 'Resource Sharing',
      class: 'active-label',
      link: '/operations-center/resource-sharing',
    },
    {
      label: 'Resource Sharing Create',
      class: 'active-label',
      link: '/operations-center/resource-sharing/create',
    },
  ];

  const onSubmit = async (data) => {
    let body = {
      ...data,
      start_date: moment(data?.start_date).format('MM-DD-YYYY'),
      end_date: moment(data?.end_date).format('MM-DD-YYYY'),
      quantity: +data?.quantity,
      from_collection_operation_id: +data?.from_collection_operation_id?.value,
      to_collection_operation_id: +data?.to_collection_operation_id?.value,
      share_type: +data?.share_type?.value,
      is_active: true,
    };
    try {
      const { data } = await API.operationCenter.resourceSharing.create(
        accessToken,
        body
      );
      if (data.status === 'success') {
        setModalPopUp(true);
      }
    } catch (error) {
      toast.error(`Failed to fetch`, { autoClose: 3000 });
    }
  };
  const handleWheel = (event) => {
    if (event.target.type === 'number') {
      event.target.blur();
    }
  };
  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Resource Sharing'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />
      <div className="mainContentInner form-container">
        <div className="formGroup">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="formGroup">
              <h5 className={styles.heading}>Create Resource Sharing</h5>
              <Controller
                name={'start_date'}
                control={control}
                render={({ field }) => (
                  <div className="form-field">
                    <div className={`field`}>
                      <DatePicker
                        //disabled={true}
                        dateFormat="MM-dd-yyyy"
                        className={`custom-datepicker ${
                          field?.value ? '' : 'effectiveDate'
                        }`}
                        minDate={new Date()}
                        placeholderText={'Start Date*'}
                        selected={field?.value && new Date(field?.value)}
                        onChange={(e) => {
                          field.onChange(e);
                          setStartDate(e);
                        }}
                        onBlur={field.onBlur}
                      />
                      {errors?.start_date?.message ? (
                        <div className="error">
                          <p>{errors?.start_date?.message}</p>
                        </div>
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                )}
              />
              <Controller
                name={'end_date'}
                control={control}
                render={({ field }) => (
                  <div className="form-field">
                    <div className={`field`}>
                      <DatePicker
                        minDate={startDate}
                        dateFormat="MM-dd-yyyy"
                        className={`custom-datepicker ${
                          field?.value ? '' : 'effectiveDate'
                        }`}
                        placeholderText={'End Date*'}
                        selected={field?.value && new Date(field?.value)}
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                        onBlur={field.onBlur}
                      />
                      {errors?.end_date?.message ? (
                        <div className="error">
                          <p>{errors?.end_date?.message}</p>
                        </div>
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                )}
              />
              <Controller
                name={`share_type`}
                control={control}
                defaultValue={null}
                render={({ field }) => (
                  <SelectDropdown
                    placeholder={'Share Type*'}
                    styles={{ root: styles.formFieldLeft }}
                    defaultValue={field?.value}
                    selectedValue={field?.value}
                    removeDivider
                    options={SHARE_TYPE_ENUM}
                    error={errors?.share_type?.message}
                    onBlur={field?.onBlur}
                    showLabel
                    onChange={(e) => {
                      field?.onChange(e);
                    }}
                  />
                )}
              />
              <Controller
                name={`quantity`}
                control={control}
                defaultValue={null}
                render={({ field }) => (
                  <FormInput
                    name="quantity"
                    type="number"
                    displayName="Quantity"
                    value={
                      field.value != null && field.value !== ''
                        ? +field.value
                        : ''
                    }
                    onBlur={field.onBlur}
                    onChange={(e) => field.onChange(e)}
                    required
                    error={errors?.quantity?.message}
                    onKeyPress={(e) => {
                      // Restrict input to numeric characters only
                      const isValidInput = /[0-9]/.test(e.key);
                      if (!isValidInput) {
                        e.preventDefault();
                      }
                    }}
                    onWheel={handleWheel}
                  />
                )}
              />
              <div className={`col-12 ${styles.des}`}>
                <Controller
                  name={`description`}
                  control={control}
                  defaultValue={null}
                  render={({ field }) => (
                    <FormText
                      style={{ root: 'w-100' }}
                      name="description"
                      type="text"
                      displayName="Description"
                      required={false}
                      value={field.value ? field.value : ''}
                      onBlur={field.onBlur}
                      onChange={(e) => field.onChange(e)}
                      error={errors?.description?.message}
                    />
                  )}
                />
              </div>

              <Controller
                name={`from_collection_operation_id`}
                control={control}
                defaultValue={null}
                render={({ field }) => (
                  <SelectDropdown
                    placeholder={'From Collection Operation*'}
                    styles={{ root: styles.formFieldLeft }}
                    defaultValue={field?.value}
                    selectedValue={field?.value}
                    error={errors?.from_collection_operation_id?.message}
                    removeDivider
                    options={
                      fromCollectionOperation
                        ? collectionOperationsOption
                            ?.filter(
                              (item) =>
                                item &&
                                item.label !== fromCollectionOperation.label &&
                                item.value !== fromCollectionOperation.value
                            )
                            ?.map((item) => item)
                        : collectionOperationsOption
                    }
                    onBlur={field?.onBlur}
                    showLabel
                    onChange={(e) => {
                      setToCollectionOperation(e);
                      field?.onChange(e);
                    }}
                  />
                )}
              />
              <Controller
                name={`to_collection_operation_id`}
                control={control}
                defaultValue={null}
                render={({ field }) => (
                  <SelectDropdown
                    placeholder={'To Collection Operation*'}
                    styles={{ root: styles.formFieldLeft }}
                    defaultValue={field?.value}
                    selectedValue={field?.value}
                    error={errors?.to_collection_operation_id?.message}
                    removeDivider
                    options={
                      toCollectionOperation
                        ? collectionOperationsOption
                            ?.filter(
                              (item) =>
                                item &&
                                item.label !== toCollectionOperation.label &&
                                item.value !== toCollectionOperation.value
                            )
                            ?.map((item) => item)
                        : collectionOperationsOption
                    }
                    onBlur={field?.onBlur}
                    showLabel
                    onChange={(e) => {
                      setFromCollectionOperation(e);
                      field?.onChange(e);
                    }}
                  />
                )}
              />
            </div>
          </form>
        </div>
      </div>
      <div
        className={`form_footer ${styles.footerNonCollection} d-flex justify-content-end`}
      >
        <span
          className="text-primary border-0 cursor-pointer cancel"
          onClick={() => {
            setCloseModal(true);
          }}
        >
          Cancel
        </span>
        <button
          type="button"
          // disabled={isSubmitting}
          className={`rounded  btn btn-primary`}
          onClick={handleSubmit(onSubmit)}
        >
          Create
        </button>
      </div>
      <SuccessPopUpModal
        title={'Success!'}
        message={'Resource Share Created.'}
        modalPopUp={modalPopUp}
        setModalPopUp={setModalPopUp}
        showActionBtns={true}
        isNavigate={true}
        redirectPath={'/operations-center/resource-sharing'}
      />
      <CancelModalPopUp
        title="Confirmation"
        message="Unsaved changes will be lost, do you wish to proceed?"
        modalPopUp={closeModal}
        isNavigate={true}
        setModalPopUp={setCloseModal}
        redirectPath={'/operations-center/resource-sharing'}
      />
    </div>
  );
};

export default CreateResourceSharing;
