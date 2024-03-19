import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-datepicker/dist/react-datepicker.css';
import TopBar from '../../../../../common/topbar/index';
import SuccessPopUpModal from '../../../../../common/successModal';
import { SETTINGS_CLASSIFICATIONS_PATH } from '../../../../../../routes/path';
import styles from './index.module.scss';
import { fetchData } from '../../../../../../helpers/Api';
import { Controller, useForm } from 'react-hook-form';
import SelectDropdown from '../../../../../common/selectDropdown';
import { yupResolver } from '@hookform/resolvers/yup';
import { settingSchema } from './FormSchema';
import FormInput from '../../../../../common/form/FormInput';
import CancelModalPopUp from '../../../../../common/cancelModal';
import { ClassificationsBreadCrumbsData } from '../ClassificationsBreadCrumbsData';

const AddSettings = () => {
  const navigate = useNavigate();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [classifications, setClassifications] = useState([]);
  const [classificationId, setClassificationId] = useState(null);
  const [classificationIdBlurred, setClassificationIdBlurred] = useState(false);
  const [changesMade, setChangesMade] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ resolver: yupResolver(settingSchema), mode: 'all' });

  const BreadcrumbsData = [
    ...ClassificationsBreadCrumbsData,
    {
      label: 'Settings',
      class: 'disable-label',
      link: SETTINGS_CLASSIFICATIONS_PATH.LIST,
    },
    {
      label: 'Create Classification Setting',
      class: 'active-label',
      link: SETTINGS_CLASSIFICATIONS_PATH.CREATE,
    },
  ];

  const getData = async () => {
    const result = await fetchData(
      `/staffing-admin/classifications/settingless`
    );
    const { data, code } = result;
    if (code === 200) {
      setClassifications(data);
    } else {
      toast.error('Error Fetching Classifications  ', { autoClose: 3000 });
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const onSubmit = async (data) => {
    setIsRequesting(true);
    const body = {
      max_consec_days_per_week: +data.max_consec_days_per_week,
      min_days_per_week: +data.min_days_per_week,
      max_days_per_week: +data.max_days_per_week,
      max_hours_per_week: +data.max_hours_per_week,
      min_hours_per_week: +data.min_hours_per_week,
      target_hours_per_week: +data.target_hours_per_week,
      max_weekend_hours: +data.max_weekend_hours,
      min_recovery_time: +data.min_recovery_time,
      max_consec_weekends: +data.max_consec_weekends,
      max_ot_per_week: +data.max_ot_per_week,
      max_weekends_per_months: +data.max_weekends_per_months,
      overtime_threshold: +data.overtime_threshold,
    };

    await fetchData('/staffing-admin/setting', 'POST', {
      ...body,
      classification_id: classificationId ? +classificationId.value : null,
    })
      .then((res) => {
        if (res.status_code === 201) {
          setShowSuccessMessage(true);

          setChangesMade(false);
        } else if (
          res.status_code === 404 ||
          res.status_code === 409 ||
          res.status_code === 500
        ) {
          toast.error(res.response, { autoClose: 3000 });
          setShowSuccessMessage(false);
          setIsRequesting(false);
        }
      })
      .catch((err) => {
        if (err.status_code === 404) {
          setShowSuccessMessage(false);
          setChangesMade(false);
          // setErrors(errorInitialState);
          toast.error(err.response, { autoClose: 3000 });
          setIsRequesting(false);
        }
      });
  };

  const handleClassificationBlur = () => {
    setClassificationIdBlurred(true);
    setChangesMade(true);
  };

  const handleCancel = () => {
    if (changesMade) setShowCancelModal(true);
    else
      navigate(
        '/system-configuration/tenant-admin/staffing-admin/classifications/settings/list'
      );
  };

  const handleChangeSelect = (val) => {
    setClassificationId(val);
  };

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Settings'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />
      <div className="mainContentInner form-container">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={`formGroup ${styles.headForm}`}>
            <div className={`${styles.heading}`}>
              <h5>Create Classification Settings</h5>
            </div>
            <SelectDropdown
              placeholder="Class Name*"
              showLabel={true}
              options={classifications?.map((item) => ({
                value: item?.id,
                label: item?.name,
              }))}
              defaultValue={classificationId}
              selectedValue={classificationId}
              onChange={handleChangeSelect}
              required={false}
              removeDivider
              removeTheClearCross
              error={
                classificationIdBlurred && !classificationId
                  ? 'Class name is required.'
                  : ''
              }
              onBlur={handleClassificationBlur}
            />
          </div>

          <div className="formGroup">
            <Controller
              name="target_hours_per_week"
              control={control}
              render={({ field }) => (
                <FormInput
                  label="Target Hours per Week"
                  name={field.name}
                  displayName="Target Hours per Week"
                  maxLength={'3'}
                  required={false}
                  onChange={(event) => {
                    const inputValue = event.target.value;
                    const numericValue = inputValue.replace(/\D/g, '');
                    field.onChange({ target: { value: numericValue } });
                    setChangesMade(true);
                  }}
                  value={field.value}
                  error={
                    errors?.target_hours_per_week
                      ? errors?.target_hours_per_week?.message
                      : ''
                  }
                />
              )}
            />
            <Controller
              name="min_hours_per_week"
              control={control}
              render={({ field }) => (
                <FormInput
                  label="Minimum Hours per Week"
                  name={field.name}
                  displayName="Minimum Hours per Week"
                  maxLength={'3'}
                  required={false}
                  onChange={(event) => {
                    const inputValue = event.target.value;
                    const numericValue = inputValue.replace(/\D/g, '');
                    field.onChange({ target: { value: numericValue } });
                    setChangesMade(true);
                  }}
                  value={field.value}
                  error={
                    errors?.min_hours_per_week
                      ? errors?.min_hours_per_week?.message
                      : ''
                  }
                />
              )}
            />
            <Controller
              name="max_hours_per_week"
              control={control}
              render={({ field }) => (
                <FormInput
                  label="Maximum Hours per Week"
                  name={field.name}
                  displayName="Maximum Hours per Week"
                  maxLength={'3'}
                  required={false}
                  onChange={(event) => {
                    const inputValue = event.target.value;
                    const numericValue = inputValue.replace(/\D/g, '');
                    field.onChange({ target: { value: numericValue } });
                    setChangesMade(true);
                  }}
                  value={field.value}
                  error={
                    errors?.max_hours_per_week
                      ? errors?.max_hours_per_week?.message
                      : ''
                  }
                />
              )}
            />
            <Controller
              name="min_days_per_week"
              control={control}
              render={({ field }) => (
                <FormInput
                  label="Minimum Days per Week"
                  name={field.name}
                  displayName="Minimum Days per Week"
                  onChange={(event) => {
                    const inputValue = event.target.value;
                    const numericValue = inputValue.replace(/\D/g, '');
                    field.onChange({ target: { value: numericValue } });
                    setChangesMade(true);
                  }}
                  value={field.value}
                  required={false}
                  maxLength={'1'}
                  error={
                    errors?.min_days_per_week
                      ? errors?.min_days_per_week?.message
                      : ''
                  }
                />
              )}
            />
            <Controller
              name="max_days_per_week"
              control={control}
              render={({ field }) => (
                <FormInput
                  label="Maximum Days per Week"
                  name={field.name}
                  displayName="Maximum Days per Week"
                  maxLength={'1'}
                  required={false}
                  onChange={(event) => {
                    const inputValue = event.target.value;
                    const numericValue = inputValue.replace(/\D/g, '');
                    field.onChange({ target: { value: numericValue } });
                    setChangesMade(true);
                  }}
                  value={field.value}
                  error={
                    errors?.max_days_per_week
                      ? errors?.max_days_per_week?.message
                      : ''
                  }
                />
              )}
            />
            <Controller
              name="max_consec_days_per_week"
              control={control}
              render={({ field }) => (
                <FormInput
                  label="Maximum Consecutive Days per Week"
                  name={field.name}
                  displayName="Maximum Consecutive Days per Week"
                  onChange={(event) => {
                    const inputValue = event.target.value;
                    const numericValue = inputValue.replace(/\D/g, ''); // Remove non-digit characters
                    field.onChange({ target: { value: numericValue } });
                    setChangesMade(true);
                  }}
                  value={field.value}
                  maxLength={'1'}
                  required={false}
                  error={errors?.max_consec_days_per_week?.message}
                />
              )}
            />
            <Controller
              name="max_ot_per_week"
              control={control}
              render={({ field }) => (
                <FormInput
                  label="Maximum OT per Week"
                  name="max_ot_per_week"
                  displayName="Maximum OT per Week"
                  onChange={(event) => {
                    const inputValue = event.target.value;
                    const numericValue = inputValue.replace(/\D/g, '');
                    field.onChange({ target: { value: numericValue } });
                    setChangesMade(true);
                  }}
                  value={field.value}
                  required={false}
                  maxLength={'3'}
                  error={
                    errors?.max_ot_per_week
                      ? errors?.max_ot_per_week?.message
                      : ''
                  }
                />
              )}
            />
            <Controller
              name="max_weekend_hours"
              control={control}
              render={({ field }) => (
                <FormInput
                  label="Maximum Weekend Hours"
                  name={field.name}
                  displayName="Maximum Weekend Hours"
                  maxLength={'2'}
                  required={false}
                  onChange={(event) => {
                    const inputValue = event.target.value;
                    const numericValue = inputValue.replace(/\D/g, '');
                    field.onChange({ target: { value: numericValue } });
                    setChangesMade(true);
                  }}
                  value={field.value}
                  error={
                    errors?.max_weekend_hours
                      ? errors?.max_weekend_hours?.message
                      : ''
                  }
                />
              )}
            />
            <Controller
              name="max_consec_weekends"
              control={control}
              render={({ field }) => (
                <FormInput
                  label="Maximum Consecutive Weekends"
                  displayName="Maximum Consecutive Weekends"
                  name={field.name}
                  onChange={(event) => {
                    const inputValue = event.target.value;
                    const numericValue = inputValue.replace(/\D/g, '');
                    field.onChange({ target: { value: numericValue } });
                    setChangesMade(true);
                  }}
                  value={field.value}
                  maxLength={'2'}
                  required={false}
                  error={errors?.max_consec_weekends?.message}
                />
              )}
            />
            <Controller
              name="max_weekends_per_months"
              control={control}
              render={({ field }) => (
                <FormInput
                  label="Maximum Weekends per Month"
                  name={field.name}
                  displayName="Maximum Weekends per Month"
                  onChange={(event) => {
                    const inputValue = event.target.value;
                    const numericValue = inputValue.replace(/\D/g, '');
                    field.onChange({ target: { value: numericValue } });
                    setChangesMade(true);
                  }}
                  value={field.value}
                  required={false}
                  maxLength={'1'}
                  error={
                    errors?.max_weekends_per_months
                      ? errors?.max_weekends_per_months?.message
                      : ''
                  }
                />
              )}
            />
            <Controller
              name="overtime_threshold"
              control={control}
              render={({ field }) => (
                <FormInput
                  label="Overtime Threshold"
                  name={field.name}
                  displayName="Overtime Threshold"
                  onChange={(event) => {
                    const inputValue = event.target.value;
                    const numericValue = inputValue.replace(/\D/g, '');
                    field.onChange({ target: { value: numericValue } });
                    setChangesMade(true);
                  }}
                  value={field.value}
                  required={false}
                  maxLength={'3'}
                  error={
                    errors?.overtime_threshold
                      ? errors?.overtime_threshold?.message
                      : ''
                  }
                />
              )}
            />
            <Controller
              name="min_recovery_time"
              control={control}
              render={({ field }) => (
                <FormInput
                  label="Minimum Recovery Time"
                  name={field.name}
                  displayName="Minimum Recovery Time"
                  onChange={(event) => {
                    const inputValue = event.target.value;
                    const numericValue = inputValue.replace(/\D/g, '');
                    field.onChange({ target: { value: numericValue } });
                    setChangesMade(true);
                  }}
                  value={field.value}
                  required={false}
                  maxLength={'3'}
                  error={
                    errors?.min_recovery_time
                      ? errors?.min_recovery_time?.message
                      : ''
                  }
                />
              )}
            />
          </div>
          <div className="form-footer">
            <button
              className={`btn btn-secondary border-0 ${styles.cancelBtn}`}
              onClick={handleCancel}
              type="button"
            >
              Cancel
            </button>

            <button
              type="submit"
              className={`${styles.createBtn}`}
              disabled={isRequesting}
              onClick={(e) => {
                handleClassificationBlur();
                handleSubmit(e);
              }}
            >
              Create
            </button>
          </div>
        </form>
      </div>
      <CancelModalPopUp
        title="Confirmation"
        message={'Unsaved changes will be lost. Do you want to continue?'}
        modalPopUp={showCancelModal}
        setModalPopUp={setShowCancelModal}
        showActionBtns={false}
        isNavigate={true}
        redirectPath={
          '/system-configuration/tenant-admin/staffing-admin/classifications/settings/list'
        }
      />
      <SuccessPopUpModal
        title="Success!"
        message={'Setting created.'}
        modalPopUp={showSuccessMessage}
        isNavigate={true}
        redirectPath={
          '/system-configuration/tenant-admin/staffing-admin/classifications/settings/list'
        }
        showActionBtns={true}
        isArchived={false}
        setModalPopUp={setShowSuccessMessage}
      />
    </div>
  );
};

export default AddSettings;
