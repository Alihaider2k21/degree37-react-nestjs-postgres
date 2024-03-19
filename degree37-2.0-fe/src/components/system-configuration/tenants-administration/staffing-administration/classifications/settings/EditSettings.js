import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-datepicker/dist/react-datepicker.css';
import TopBar from '../../../../../common/topbar/index';
import SuccessPopUpModal from '../../../../../common/successModal';
import { SETTINGS_CLASSIFICATIONS_PATH } from '../../../../../../routes/path';
import styles from './index.module.scss';
import {
  fetchData,
  makeAuthorizedApiRequest,
} from '../../../../../../helpers/Api';
import SelectDropdown from '../../../../../common/selectDropdown';
import CancelModalPopUp from '../../../../../common/cancelModal';
import { yupResolver } from '@hookform/resolvers/yup';
import { settingSchema } from './FormSchema';
import { Controller, useForm } from 'react-hook-form';
import FormInput from '../../../../../common/form/FormInput';
import { ClassificationsBreadCrumbsData } from '../ClassificationsBreadCrumbsData';

const EditSettings = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [classificationId, setClassificationId] = useState('');
  const [saveAndCloseClicked, setSaveAndCloseClicked] = useState(false);
  const [classificationIdBlurred, setClassificationIdBlurred] = useState(false);
  const [modalPopUp, setModalPopUp] = useState(false);
  const [isNavigate, setIsNavigate] = useState(false);
  const [isArchived, setIsArchived] = useState(false);
  const [closeModal, setCloseModal] = useState(false);
  const [classifications, setClassifications] = useState([]);
  const [archiveStatus, setArchivedStatus] = useState(false);
  const { id } = useParams();
  const {
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(settingSchema),
    mode: 'onChange',
  });

  const BreadcrumbsData = [
    ...ClassificationsBreadCrumbsData,
    {
      label: 'Settings',
      class: 'disable-label',
      link: SETTINGS_CLASSIFICATIONS_PATH.LIST,
    },
    {
      label: 'Edit Classification Setting',
      class: 'active-label',
      link: `/system-configuration/tenant-admin/staffing-admin/classifications/settings/${id}/edit`,
    },
  ];

  const getClassificationsData = async () => {
    const result = await fetchData(
      `/staffing-admin/classifications/settingless`
    );
    const { data, code } = result;
    if (code === 200) {
      setClassifications(data);
    } else {
      toast.error('Error Fetching Classifications', { autoClose: 3000 });
    }
  };

  useEffect(() => {
    getClassificationsData();
  }, []);

  const getData = async () => {
    const result = await fetchData(`/staffing-admin/setting/${id}`);
    const { data } = result;

    if (data !== undefined || null) {
      setValue('max_consec_days_per_week', +data?.max_consec_days_per_week);
      setValue('min_days_per_week', +data?.min_days_per_week);
      setValue('max_days_per_week', +data?.max_days_per_week);
      setValue('max_hours_per_week', +data?.max_hours_per_week);
      setValue('min_hours_per_week', +data?.min_hours_per_week);
      setValue('target_hours_per_week', +data?.target_hours_per_week);
      setValue('max_weekend_hours', +data?.max_weekend_hours);
      setValue('min_recovery_time', +data?.min_recovery_time);
      setValue('max_consec_weekends', +data?.max_consec_weekends);
      setValue('max_ot_per_week', +data?.max_ot_per_week);
      setValue('max_weekends_per_months', +data?.max_weekends_per_months);
      setValue('overtime_threshold', +data?.overtime_threshold);
      setValue('classificationId', +data.classification.id);
      setClassificationId({
        value: data.classification.id,
        label: data.classification.name,
      });
    } else {
      toast.error('Error Fetching Classifications  ', { autoClose: 3000 });
    }
  };

  useEffect(() => {
    getData();
  }, [id]);

  const onSubmit = async (data) => {
    if (!classificationId) {
      setClassificationIdBlurred(true);
      return;
    }
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

    await fetchData(`/staffing-admin/setting/${id}`, 'PUT', {
      ...body,
      classification_id: classificationId ? +classificationId.value : null,
    })
      .then((res) => {
        setModalPopUp(true);
        if (res.status_code === 204) {
          setModalPopUp(true);
        } else if (res.status_code === 404) {
          toast.error(res.response, { autoClose: 3000 });
          setModalPopUp(false);
        }
      })
      .catch((err) => {
        if (err.status_code === 404) {
          // setErrors(errorInitialState);
          toast.error(err.response, { autoClose: 3000 });
        }
      });
  };

  const handleChangeSelect = (val) => {
    setClassificationId(val);
  };

  const handleClassificationBlur = () => {
    setClassificationIdBlurred(true);
  };

  const saveAndClose = () => {
    setIsArchived(false);
    setIsNavigate(true);
  };

  const saveChanges = () => {
    setIsArchived(false);
    setModalPopUp(false);
  };

  const archiveHandle = async () => {
    try {
      const res = await makeAuthorizedApiRequest(
        'PATCH',
        `${BASE_URL}/staffing-admin/setting/${id}`
      );
      let { data, status, response } = await res.json();
      if (status === 'success') {
        // Handle successful response
        setModalPopUp(false);
        setTimeout(() => {
          setArchivedStatus(true);
        }, 600);
      } else if (response?.status === 400) {
        toast.error(`${data?.message?.[0] ?? data?.response}`, {
          autoClose: 3000,
        });
        setModalPopUp(false);

        // Handle bad request
      } else {
        toast.error(`${data?.message?.[0] ?? data?.response}`, {
          autoClose: 3000,
        });
        setModalPopUp(false);
      }
    } catch (error) {
      toast.error(`${error?.message}`, { autoClose: 3000 });
      setModalPopUp(false);
    }
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
        <form>
          <div className={`formGroup ${styles.headForm}`}>
            <div className={`${styles.heading}`}>
              <h5>Edit Classification Settings</h5>
            </div>

            <SelectDropdown
              placeholder="Classification Name*"
              showLabel={true}
              options={classifications.map((item) => ({
                value: item?.id,
                label: item?.name,
              }))}
              defaultValue={classificationId}
              selectedValue={classificationId}
              onChange={handleChangeSelect}
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
                  required={true}
                  onChange={(event) => {
                    const inputValue = event.target.value;
                    const numericValue = inputValue.replace(/\D/g, '');
                    field.onChange({ target: { value: numericValue } });
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
                  required={true}
                  onChange={(event) => {
                    const inputValue = event.target.value;
                    const numericValue = inputValue.replace(/\D/g, '');
                    field.onChange({ target: { value: numericValue } });
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
                  required={true}
                  onChange={(event) => {
                    const inputValue = event.target.value;
                    const numericValue = inputValue.replace(/\D/g, '');
                    field.onChange({ target: { value: numericValue } });
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
                  }}
                  value={field.value}
                  required={true}
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
                  required={true}
                  onChange={(event) => {
                    const inputValue = event.target.value;
                    const numericValue = inputValue.replace(/\D/g, '');
                    field.onChange({ target: { value: numericValue } });
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
                  }}
                  value={field.value}
                  maxLength={'1'}
                  required={true}
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
                  }}
                  value={field.value}
                  required={true}
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
                  required={true}
                  onChange={(event) => {
                    const inputValue = event.target.value;
                    const numericValue = inputValue.replace(/\D/g, '');
                    field.onChange({ target: { value: numericValue } });
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
                  }}
                  value={field.value}
                  maxLength={'2'}
                  required={true}
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
                  }}
                  value={field.value}
                  required={true}
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
                  }}
                  value={field.value}
                  required={true}
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
                  }}
                  value={field.value}
                  required={true}
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
        </form>
      </div>
      <div className={`form-footer-custom`}>
        <>
          <div
            className="archived"
            onClick={(e) => {
              e.preventDefault();
              setIsArchived(true);
              setModalPopUp(true);
              setSaveAndCloseClicked(true);
            }}
          >
            Archive
          </div>
          <button
            className={`btn btn-link ${styles.archivebtn}`}
            type="submit"
            onClick={(e) => {
              setCloseModal(true);
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`btn btn-md me-4 ${styles.saveandclose} ${styles.createbtn}  btn-secondary`}
            onClick={(e) => {
              e.preventDefault();
              handleSubmit(onSubmit)();
              saveAndClose();
              setSaveAndCloseClicked(true);
            }}
          >
            Save & Close
          </button>
          <button
            type="button"
            className={` ${`btn btn-primary btn btn-md me-4 ${styles.createbtn}`}`}
            onClick={(e) => {
              handleSubmit(onSubmit)();
              saveChanges();
            }}
          >
            Save Changes
          </button>
        </>
      </div>
      {saveAndCloseClicked ? (
        <SuccessPopUpModal
          title={isArchived ? 'Confirmation' : 'Success!'}
          message={
            isArchived
              ? 'Are you sure you want to archive?'
              : 'Setting updated.'
          }
          modalPopUp={modalPopUp}
          setModalPopUp={setModalPopUp}
          showActionBtns={isArchived ? false : true}
          isArchived={isArchived}
          archived={archiveHandle}
          isNavigate={isNavigate}
          redirectPath={
            '/system-configuration/tenant-admin/staffing-admin/classifications/settings/list'
          }
        />
      ) : (
        <SuccessPopUpModal
          title={isArchived ? 'Confirmation' : 'Success!'}
          message={
            isArchived
              ? 'Are you sure you want to archive?'
              : 'Setting updated.'
          }
          modalPopUp={modalPopUp}
          setModalPopUp={setModalPopUp}
          showActionBtns={isArchived ? false : true}
          isArchived={isArchived}
          archived={archiveHandle}
        />
      )}
      <SuccessPopUpModal
        title="Success!"
        message={`Classification Settings is archived.`}
        modalPopUp={archiveStatus}
        isNavigate={true}
        redirectPath={
          '/system-configuration/tenant-admin/staffing-admin/classifications/settings/list'
        }
        showActionBtns={true}
        isArchived={false}
        setModalPopUp={setArchivedStatus}
      />
      <CancelModalPopUp
        title="Confirmation"
        message="Unsaved changes will be lost, do you wish to proceed?"
        modalPopUp={closeModal}
        isNavigate={true}
        setModalPopUp={setCloseModal}
        redirectPath={
          '/system-configuration/tenant-admin/staffing-admin/classifications/settings/list'
        }
      />
    </div>
  );
};

export default EditSettings;
