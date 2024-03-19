import React, { useEffect, useState } from 'react';
import styles from './index.module.scss';
import { Controller, useForm } from 'react-hook-form';
import FormInput from '../../../../../common/form/FormInput';
import SelectDropdown from '../../../../../common/selectDropdown';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import { API } from '../../../../../../api/api-routes';
import SuccessPopUpModal from '../../../../../common/successModal';

const defaultFormData = {
  target_hours_per_week: 0,
  minimum_hours_per_week: 0,
  maximum_hours_per_week: 0,
  minimum_days_per_week: 0,
  maximum_days_per_week: 0,
  maximum_consecutive_days_per_week: 0,
  maximum_ot_per_week: 0,
  maximum_weekend_hours: 0,
  maximum_consecutive_weekends: 0,
  maximum_weekends_per_month: 0,
  overtime_threshold: 0,
  minimum_recovery_time: 0,
};

const ClassificationModal = ({
  showConfirmation,
  onCancel,
  onConfirm,
  heading,
  classes,
  disabled = false,
  onSubmits,
}) => {
  const params = useParams();
  const accessToken = localStorage.getItem('token');
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [classificationList, setClassificationList] = useState([]);
  const [classificationId, setClassificationId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [classificationSettingId, setClassificationSettingId] = useState(null);
  const schema = yup
    .object()
    .shape({
      classification_settings_id: yup
        .object()
        .required('Classification Name is required.'),
      maximum_consecutive_days_per_week: yup
        .number()
        .typeError('Max Consecutive D/W must be a number.')
        .required('Max Consecutive D/W is required.')
        .min(0, 'Max Consecutive D/W must be at least 0.')
        .max(7, 'Max Consecutive D/W must be at most 7.'),
      maximum_consecutive_weekends: yup
        .number()
        .typeError('Max Consecutive W/E must be a number.')
        .required('Max Consecutive W/E is required.')
        .min(0, 'Max Consecutive W/E must be at least 0.')
        .max(54, 'Max Consecutive W/E must be at most 54.'),
      minimum_days_per_week: yup
        .number()
        .typeError('Minimum Days/Week must be a number.')
        .required('Minimum Days/Week is required.')
        .min(0, 'Minimum Days/Week must be at least 0.')
        .max(7, 'Minimum Days/Week must be at most 7.'),
      maximum_days_per_week: yup
        .number()
        .typeError('Maximum Days/Week must be a number.')
        .required('Maximum Days/Week is required.')
        .min(0, 'Maximum Days/Week must be at least 0.')
        .max(7, 'Maximum Days/Week must be at most 7.'),
      maximum_hours_per_week: yup
        .number()
        .typeError('Maximum Hours/Week must be a number.')
        .required('Maximum Hours/Week is required.')
        .min(0, 'Maximum Hours/Week must be at least 0.')
        .max(168, 'Maximum Hours/Week must be at most 168.'),
      maximum_ot_per_week: yup
        .number()
        .typeError('Maximum OT/Week must be a number.')
        .required('Maximum OT/Week is required.')
        .min(0, 'Maximum OT/Week must be at least 0.')
        .max(168, 'Maximum OT/Week must be at most 168.'),
      maximum_weekend_hours: yup
        .number()
        .typeError('Maximum W/E Hours must be a number.')
        .required('Maximum W/E Hours is required.')
        .min(0, 'Maximum W/E Hours must be at least 0.')
        .max(5, 'Maximum W/E Hours must be at most 5.'),
      maximum_weekends_per_month: yup
        .number()
        .typeError('Maximum W/E per Month must be a number.')
        .required('Maximum W/E per Month is required.')
        .min(0, 'Maximum W/E per Month must be at least 0.')
        .max(5, 'Maximum W/E per Month must be at most 5.'),
      minimum_recovery_time: yup
        .number()
        .typeError('Minimum Recovery Time must be a number.')
        .required('Minimum Recovery Time is required.')
        .min(0, 'Minimum Recovery Time must be at least 0.')
        .max(240, 'Minimum Recovery Time must be at most 240.'),
      overtime_threshold: yup
        .number()
        .typeError('Overtime Threshold must be a number.')
        .required('Overtime Threshold is required.')
        .min(0, 'Overtime Threshold must be at least 0.')
        .max(8760, 'Overtime Threshold must be at most 8760.'),
    })
    .required();

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    // clearErrors,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
    defaultValues: defaultFormData,
  });
  const valueNullMethod = () => {
    setValue('maximum_consecutive_days_per_week', 0);
    setValue('maximum_consecutive_weekends', 0);
    setValue('minimum_days_per_week', 0);
    setValue('maximum_days_per_week', 0);
    setValue('maximum_hours_per_week', 0);
    setValue('maximum_ot_per_week', 0);
    setValue('maximum_weekend_hours', 0);
    setValue('maximum_weekends_per_month', 0);
    setValue('minimum_recovery_time', 0);
    setValue('overtime_threshold', 0);
  };
  const getClassificationData = async () => {
    const { data } = await API.crm.contacts.staff.getClassificationData(
      params?.id,
      accessToken
    );
    if (data?.status_code === 200) {
      if (data?.data) {
        reset({ ...defaultFormData, ...data?.data });
        setValue('classification_settings_id', {
          value: data?.data?.staffing_classification_id?.id,
          label: data?.data?.staffing_classification_id?.name,
        });
        setClassificationSettingId(data?.data?.staffing_classification_id?.id);
      }
    }
  };

  useEffect(() => {
    const getClassificationById = async () => {
      const { data } = await API.crm.contacts.staff.getClassificationDataById(
        +classificationId,
        accessToken
      );
      setClassificationSettingId(classificationId);
      if (data?.code === 200) {
        setValue(
          'maximum_consecutive_days_per_week',
          data?.data?.max_consec_days_per_week
        );
        setValue(
          'maximum_consecutive_weekends',
          data?.data?.max_consec_weekends
        );
        setValue('minimum_days_per_week', data?.data?.min_days_per_week);
        setValue('maximum_days_per_week', data?.data?.max_days_per_week);
        setValue('maximum_hours_per_week', data?.data?.max_hours_per_week);
        setValue('maximum_ot_per_week', data?.data?.max_ot_per_week);
        setValue('maximum_weekend_hours', data?.data?.max_weekend_hours);
        setValue(
          'maximum_weekends_per_month',
          data?.data?.max_weekends_per_months
        );
        setValue('minimum_recovery_time', data?.data?.min_recovery_time);
        setValue('overtime_threshold', data?.data?.overtime_threshold);
      } else {
        valueNullMethod();
        toast.error(data?.response, { autoClose: 3000 });
      }
    };
    if (classificationId) {
      getClassificationById();
    }
  }, classificationId);
  useEffect(() => {
    if (params?.id) {
      if (classificationId === null) {
        getClassificationData();
      }
      getClassification();
    }
  }, [params?.id]);

  const getClassification = async () => {
    try {
      const result = await fetch(`${BASE_URL}/staffing-admin/classifications`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await result.json();
      const list = data?.data?.map((item) => {
        return {
          value: item?.id,
          label: item?.name,
        };
      });
      setClassificationList(list);
    } catch (error) {
      toast.error(`Failed to fetch.`, { autoClose: 3000 });
    }
  };

  const onSubmit = async (data) => {
    let body = {
      ...data,
      id: data?.id ? +data?.id : null,
      staff_id: +params?.id,
      staffing_classification_id: +classificationSettingId,
    };
    delete body.classification_settings_id;
    const response = await API.crm.contacts.staff.createClassification(
      params?.id,
      accessToken,
      body
    );
    if (
      response?.data?.status_code === 200 ||
      response?.data?.status_code === 201
    ) {
      onCancel();
      reset();
      onSubmits();
      getClassificationData();
      setShowModal(true);
    } else {
      toast.error(response?.data?.response, { autoClose: 3000 });
    }
  };
  return (
    <section
      className={`${styles.popup} ${showConfirmation && styles.active} ${
        classes?.root ?? ''
      }`}
    >
      <div className={`${styles.popupInner} ${classes?.inner ?? ''}`}>
        <div className={styles.content}>
          {heading ? <h3 className={styles.headingText}>{heading}</h3> : ''}
          <form className={styles.account} onSubmit={handleSubmit(onSubmit)}>
            <div className={`${styles.selectMargin}`}>
              <Controller
                name={`classification_settings_id`}
                control={control}
                defaultValue={null}
                render={({ field }) => (
                  <SelectDropdown
                    placeholder={'Classification Name'}
                    styles={{ root: styles.formFieldLeft }}
                    defaultValue={field?.value}
                    selectedValue={field?.value}
                    removeDivider
                    options={classificationList}
                    onBlur={field?.onBlur}
                    showLabel
                    onChange={(e) => {
                      field?.onChange(e);
                      setClassificationId(e?.value);
                      if (e === null) {
                        valueNullMethod();
                      }
                    }}
                  />
                )}
              />
              {errors?.classification_settings_id?.message ? (
                <div className={styles.error}>
                  {errors?.classification_settings_id?.message}
                </div>
              ) : (
                ''
              )}
            </div>
            <div className="d-flex">
              <div>
                <Controller
                  name="maximum_consecutive_days_per_week"
                  control={control}
                  render={({ field }) => (
                    <FormInput
                      name={field?.name}
                      classes={{ root: styles.formFieldLeft }}
                      displayName="Max Consecutive D/W"
                      value={field?.value}
                      required={false}
                      onChange={(e) => {
                        field?.onChange(e);
                      }}
                      handleBlur={(e) => {
                        field?.onChange(e);
                      }}
                    />
                  )}
                />
                {errors?.maximum_consecutive_days_per_week?.message ? (
                  <div className={styles.error}>
                    {errors?.maximum_consecutive_days_per_week?.message}
                  </div>
                ) : (
                  ''
                )}
              </div>
              <div>
                <Controller
                  name="maximum_consecutive_weekends"
                  control={control}
                  render={({ field }) => (
                    <FormInput
                      name={field?.name}
                      classes={{ root: styles.formFieldRight }}
                      displayName="Max Consecutive W/E"
                      value={field?.value}
                      required={false}
                      onChange={(e) => {
                        field?.onChange(e);
                      }}
                      handleBlur={(e) => {
                        field?.onChange(e);
                      }}
                    />
                  )}
                />
                {errors?.maximum_consecutive_weekends?.message ? (
                  <div className={styles.error}>
                    {errors?.maximum_consecutive_weekends?.message}
                  </div>
                ) : (
                  ''
                )}
              </div>
            </div>
            <div className={`d-flex ${styles.fieldMargin}`}>
              <div>
                <Controller
                  name="minimum_days_per_week"
                  control={control}
                  render={({ field }) => (
                    <FormInput
                      name={field?.name}
                      classes={{ root: styles.formFieldLeft }}
                      displayName="Minimum Days/Week"
                      value={field?.value}
                      required={false}
                      onChange={(e) => {
                        field?.onChange(e);
                      }}
                      handleBlur={(e) => {
                        field?.onChange(e);
                      }}
                    />
                  )}
                />
                {errors?.minimum_days_per_week?.message ? (
                  <div className={styles.error}>
                    {errors?.minimum_days_per_week?.message}
                  </div>
                ) : (
                  ''
                )}
              </div>
              <div>
                <Controller
                  name="maximum_days_per_week"
                  control={control}
                  render={({ field }) => (
                    <FormInput
                      name={field?.name}
                      classes={{ root: styles.formFieldRight }}
                      displayName="Maximum Days/Week"
                      value={field?.value}
                      required={false}
                      onChange={(e) => {
                        field?.onChange(e);
                      }}
                      handleBlur={(e) => {
                        field?.onChange(e);
                      }}
                    />
                  )}
                />
                {errors?.maximum_days_per_week?.message ? (
                  <div className={styles.error}>
                    {errors?.maximum_days_per_week?.message}
                  </div>
                ) : (
                  ''
                )}
              </div>
            </div>
            <div className={`d-flex ${styles.fieldMargin}`}>
              <div>
                <Controller
                  name="maximum_hours_per_week"
                  control={control}
                  render={({ field }) => (
                    <FormInput
                      name={field?.name}
                      classes={{ root: styles.formFieldLeft }}
                      displayName="Maximum Hours/Week"
                      value={field?.value}
                      required={false}
                      onChange={(e) => {
                        field?.onChange(e);
                      }}
                      handleBlur={(e) => {
                        field?.onChange(e);
                      }}
                    />
                  )}
                />
                {errors?.maximum_hours_per_week?.message ? (
                  <div className={styles.error}>
                    {errors?.maximum_hours_per_week?.message}
                  </div>
                ) : (
                  ''
                )}
              </div>
              <div>
                <Controller
                  name="maximum_ot_per_week"
                  control={control}
                  render={({ field }) => (
                    <FormInput
                      name={field?.name}
                      classes={{ root: styles.formFieldRight }}
                      displayName="Maximum OT/Week"
                      value={field?.value}
                      required={false}
                      onChange={(e) => {
                        field?.onChange(e);
                      }}
                      handleBlur={(e) => {
                        field?.onChange(e);
                      }}
                    />
                  )}
                />
                {errors?.maximum_ot_per_week?.message ? (
                  <div className={styles.error}>
                    {errors?.maximum_ot_per_week?.message}
                  </div>
                ) : (
                  ''
                )}
              </div>
            </div>
            <div className={`d-flex ${styles.fieldMargin}`}>
              <div>
                <Controller
                  name="maximum_weekend_hours"
                  control={control}
                  render={({ field }) => (
                    <FormInput
                      name={field?.name}
                      classes={{ root: styles.formFieldLeft }}
                      displayName="Maximum W/E Hours"
                      value={field?.value}
                      required={false}
                      onChange={(e) => {
                        field?.onChange(e);
                      }}
                      handleBlur={(e) => {
                        field?.onChange(e);
                      }}
                    />
                  )}
                />
                {errors?.maximum_weekend_hours?.message ? (
                  <div className={styles.error}>
                    {errors?.maximum_weekend_hours?.message}
                  </div>
                ) : (
                  ''
                )}
              </div>
              <div>
                <Controller
                  name="maximum_weekends_per_month"
                  control={control}
                  render={({ field }) => (
                    <FormInput
                      name={field?.name}
                      classes={{ root: styles.formFieldRight }}
                      displayName="Maximum W/E per Month"
                      value={field?.value}
                      required={false}
                      onChange={(e) => {
                        field?.onChange(e);
                      }}
                      handleBlur={(e) => {
                        field?.onChange(e);
                      }}
                    />
                  )}
                />
                {errors?.maximum_weekends_per_month?.message ? (
                  <div className={styles.error}>
                    {errors?.maximum_weekends_per_month?.message}
                  </div>
                ) : (
                  ''
                )}
              </div>
            </div>
            <div className={`d-flex ${styles.fieldMargin}`}>
              <div>
                <Controller
                  name="minimum_recovery_time"
                  control={control}
                  render={({ field }) => (
                    <FormInput
                      name={field?.name}
                      classes={{ root: styles.formFieldLeft }}
                      displayName="Minimum Recovery Time"
                      value={field?.value}
                      required={false}
                      onChange={(e) => {
                        field?.onChange(e);
                      }}
                      handleBlur={(e) => {
                        field?.onChange(e);
                      }}
                    />
                  )}
                />
                {errors?.minimum_recovery_time?.message ? (
                  <div className={styles.error}>
                    {errors?.minimum_recovery_time?.message}
                  </div>
                ) : (
                  ''
                )}
              </div>
              <div>
                <Controller
                  name="overtime_threshold"
                  control={control}
                  render={({ field }) => (
                    <FormInput
                      name={field?.name}
                      classes={{ root: styles.formFieldRight }}
                      displayName="Overtime Threshold"
                      value={field?.value}
                      required={false}
                      onChange={(e) => {
                        field?.onChange(e);
                      }}
                      handleBlur={(e) => {
                        field?.onChange(e);
                      }}
                    />
                  )}
                />
                {errors?.overtime_threshold?.message ? (
                  <div className={styles.error}>
                    {errors?.overtime_threshold?.message}
                  </div>
                ) : (
                  ''
                )}
              </div>
            </div>
            <div className={`${styles.buttons} ${classes?.btnGroup ?? ''}`}>
              <span
                className={`${styles.cancelBtn} text-primary border-0 cursor-pointer cancel`}
                onClick={() => {
                  onCancel();
                  reset();
                  getClassificationData();
                }}
              >
                Cancel
              </span>
              <button
                className={`btn btn-primary ${styles.submitBtn}`}
                onClick={onConfirm}
                disabled={disabled}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
      <SuccessPopUpModal
        title={'Success!'}
        message={'Classifications updated.'}
        modalPopUp={showModal}
        setModalPopUp={setShowModal}
        showActionBtns={true}
      />
    </section>
  );
};

export default ClassificationModal;
