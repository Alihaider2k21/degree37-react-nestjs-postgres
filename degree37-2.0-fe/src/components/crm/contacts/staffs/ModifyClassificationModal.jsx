import React from 'react';
import { Modal } from 'react-bootstrap';
import style from './AddCertificateModal.module.scss';
import styles from './ModifyModal.module.scss';
import { useState, useEffect } from 'react';
import CancelModalPopUp from '../../../common/cancelModal';
import SelectDropdown from '../../../common/selectDropdown';
import { yupResolver } from '@hookform/resolvers/yup';
import { fetchData } from '../../../../helpers/Api';
import { settingSchema } from '../../../system-configuration/tenants-administration/staffing-administration/classifications/settings/FormSchema';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import FormInput from '../../../common/form/FormInput';

const ModifyClassificationModal = ({
  openModal,
  setModalPopup,
  id,
  refetchData,
  staff,
  classificationSettings,
}) => {
  const {
    handleSubmit,
    setValue,
    control,
    formState: { errors },
    clearErrors,
  } = useForm({
    resolver: yupResolver(settingSchema),
    mode: 'onChange',
  });

  const [classificationId, setClassificationId] = useState(null);
  const [classificationIdBlurred, setClassificationIdBlurred] = useState(false);
  const [closeModal, setCloseModal] = useState(false);
  const [classifications, setClassifications] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
  }, [openModal]);

  const getData = async () => {
    if (classificationSettings?.id) {
      setValue(
        'max_consec_days_per_week',
        +classificationSettings?.max_consec_days_per_week
      );
      setValue('min_days_per_week', +classificationSettings?.min_days_per_week);
      setValue('max_days_per_week', +classificationSettings?.max_days_per_week);
      setValue(
        'max_hours_per_week',
        +classificationSettings?.max_hours_per_week
      );
      setValue('max_weekend_hours', +classificationSettings?.max_weekend_hours);
      setValue('min_recovery_time', +classificationSettings?.min_recovery_time);
      setValue(
        'max_consec_weekends',
        +classificationSettings?.max_consec_weekends
      );
      setValue('max_ot_per_week', +classificationSettings?.max_ot_per_week);
      setValue(
        'max_weekends_per_months',
        +classificationSettings?.max_weekends_per_months
      );
      setValue(
        'overtime_threshold',
        +classificationSettings?.overtime_threshold
      );
      setValue('classificationId', +classificationSettings?.classification?.id);
      setClassificationId({
        value: classificationSettings?.classification?.id,
        label: classificationSettings?.classification?.name,
      });
    } else {
      setClassificationId({
        value: staff?.classification_id?.id,
        label: staff?.classification_id?.name,
      });
    }
  };

  useEffect(() => {
    getData();
  }, [openModal]);

  const cancelHandler = () => {
    setCloseModal(true);
  };
  const continueHandler = () => {
    modalCloseHandler(false);
  };

  const modalCloseHandler = () => {
    setModalPopup(false);
    setClassificationId(null);
    clearErrors();
    refetchData();
  };

  const handleChangeSelect = (val) => {
    setClassificationId(val);
  };

  const handleClassificationBlur = () => {
    setClassificationIdBlurred(true);
  };
  const onSubmit = async (data) => {
    if (!classificationId) {
      setClassificationIdBlurred(true);
      return;
    }
    setIsSubmitting(true);
    const body = {
      max_consec_days_per_week: +data.max_consec_days_per_week,
      min_days_per_week: +data.min_days_per_week,
      max_days_per_week: +data.max_days_per_week,
      max_hours_per_week: +data.max_hours_per_week,
      max_weekend_hours: +data.max_weekend_hours,
      min_recovery_time: +data.min_recovery_time,
      max_consec_weekends: +data.max_consec_weekends,
      max_ot_per_week: +data.max_ot_per_week,
      max_weekends_per_months: +data.max_weekends_per_months,
      overtime_threshold: +data.overtime_threshold,
    };

    if (classificationId?.id) {
      await fetchData(
        `/staffing-admin/setting/${classificationSettings?.id}`,
        'PUT',
        {
          ...body,
          classification_id: classificationId ? +classificationId.value : null,
        }
      )
        .then((res) => {
          if (res.status_code === 204) {
            setIsSubmitting(false);
            setModalPopup(false);
            refetchData();
          } else if (res.status_code === 404) {
            setIsSubmitting(false);
            toast.error(res.response, { autoClose: 3000 });
            setModalPopup(false);
          }
        })
        .catch((err) => {
          if (err.status_code === 404) {
            toast.error(err.response, { autoClose: 3000 });
            setIsSubmitting(false);
            setModalPopup(false);
          }
        });
    } else {
      await fetchData('/staffing-admin/setting', 'POST', {
        ...body,
        classification_id: +staff?.classification_id?.id,
      })
        .then((res) => {
          if (res.status_code === 201) {
            setIsSubmitting(false);
            setModalPopup(false);
            refetchData();
          } else if (res.status === 'error') {
            setIsSubmitting(false);
            toast.error(res.response, { autoClose: 3000 });
          }
        })
        .catch((err) => {
          if (err.status_code === 404) {
            setIsSubmitting(false);
            toast.error(err.response, { autoClose: 3000 });
            setModalPopup(false);
          }
        });
    }
  };

  return (
    <>
      <Modal
        className={`d-flex align-items-center justify-content-center`}
        centered
        dialogClassName={`${styles.modalMain}`}
        show={openModal}
        onHide={modalCloseHandler}
        backdrop="static"
        size="xl"
        // scrollable={true}
      >
        <div className={`${style.modalContentPart}`}>
          <Modal.Header
            closeButton={false}
            className={`border-0  ${style.modalPaddingHeader}`}
          >
            <div className="w-100 d-flex justify-content-between">
              <Modal.Title className={style.heading}>
                Edit Classification
              </Modal.Title>
            </div>
          </Modal.Header>
          <Modal.Body
            className={`d-flex flex-column justify-content-center align-items-center border-0 ${style.modalBody}  ${style.modalPaddingBody} pt-4 pb-0`}
          >
            <div className="mainContentInner w-100  p-0">
              <div className={`tableView`}>
                <div
                  className={`addStaffData `}
                  style={{
                    overflowY: 'unset',
                    zIndex: '3000',
                    height: '100%',
                  }}
                >
                  <div className="group group-data border-0 mb-1">
                    <div
                      className={`w-100 tabular-body-radius border-0`}
                      style={{ overflow: 'unset', height: '100%' }}
                    >
                      <form>
                        <div className={`formGroup ${styles.formStyle}`}>
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
                                ? 'Required'
                                : ''
                            }
                            onBlur={handleClassificationBlur}
                            disabled
                          />
                          <div className="w-50 d-none d-lg-block" />
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
                                  const numericValue = inputValue.replace(
                                    /\D/g,
                                    ''
                                  ); // Remove non-digit characters
                                  field.onChange({
                                    target: { value: numericValue },
                                  });
                                }}
                                value={field.value}
                                maxLength={'1'}
                                required={true}
                                error={
                                  errors?.max_consec_days_per_week?.message
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
                                  const numericValue = inputValue.replace(
                                    /\D/g,
                                    ''
                                  );
                                  field.onChange({
                                    target: { value: numericValue },
                                  });
                                }}
                                value={field.value}
                                maxLength={'2'}
                                required={true}
                                error={errors?.max_consec_weekends?.message}
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
                                  const numericValue = inputValue.replace(
                                    /\D/g,
                                    ''
                                  );
                                  field.onChange({
                                    target: { value: numericValue },
                                  });
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
                                  const numericValue = inputValue.replace(
                                    /\D/g,
                                    ''
                                  );
                                  field.onChange({
                                    target: { value: numericValue },
                                  });
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
                                  const numericValue = inputValue.replace(
                                    /\D/g,
                                    ''
                                  );
                                  field.onChange({
                                    target: { value: numericValue },
                                  });
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
                            name="max_ot_per_week"
                            control={control}
                            render={({ field }) => (
                              <FormInput
                                label="Maximum OT per Week"
                                name="max_ot_per_week"
                                displayName="Maximum OT per Week"
                                onChange={(event) => {
                                  const inputValue = event.target.value;
                                  const numericValue = inputValue.replace(
                                    /\D/g,
                                    ''
                                  );
                                  field.onChange({
                                    target: { value: numericValue },
                                  });
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
                                  const numericValue = inputValue.replace(
                                    /\D/g,
                                    ''
                                  );
                                  field.onChange({
                                    target: { value: numericValue },
                                  });
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
                            name="max_weekends_per_months"
                            control={control}
                            render={({ field }) => (
                              <FormInput
                                label="Maximum Weekends per Month"
                                name={field.name}
                                displayName="Maximum Weekends per Month"
                                onChange={(event) => {
                                  const inputValue = event.target.value;
                                  const numericValue = inputValue.replace(
                                    /\D/g,
                                    ''
                                  );
                                  field.onChange({
                                    target: { value: numericValue },
                                  });
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
                            name="min_recovery_time"
                            control={control}
                            render={({ field }) => (
                              <FormInput
                                label="Minimum Recovery Time"
                                name={field.name}
                                displayName="Minimum Recovery Time"
                                onChange={(event) => {
                                  const inputValue = event.target.value;
                                  const numericValue = inputValue.replace(
                                    /\D/g,
                                    ''
                                  );
                                  field.onChange({
                                    target: { value: numericValue },
                                  });
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
                                  const numericValue = inputValue.replace(
                                    /\D/g,
                                    ''
                                  );
                                  field.onChange({
                                    target: { value: numericValue },
                                  });
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
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className={`${style.modalPaddingFooter} border-0`}>
            <div className="w-100 d-flex justify-content-end">
              <button
                className={`btn btn-secondary border-0  ${style.cancelBtn}`}
                disabled={isSubmitting}
                onClick={() => {
                  cancelHandler();
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className={` ${`btn btn-primary`} ${style.btnDimensions}`}
                disabled={isSubmitting}
                onClick={(e) => {
                  handleSubmit(onSubmit)();
                }}
              >
                Submit
              </button>
            </div>
          </Modal.Footer>
        </div>
      </Modal>

      <CancelModalPopUp
        title="Confirmation"
        message="Unsaved changes will be lost, do you wish to proceed?"
        modalPopUp={closeModal}
        isNavigate={false}
        setModalPopUp={() => {
          setCloseModal(false);
        }}
        additionalStyles={{ background: 'rgba(0, 0, 0, 0.5)' }}
        methodsToCall
        methods={continueHandler}
      />
    </>
  );
};

export default ModifyClassificationModal;
