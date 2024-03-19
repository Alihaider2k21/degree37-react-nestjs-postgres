import React, { useEffect } from 'react';
import styles from './index.module.scss';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import NcpBlueprintTimerInput from '../../../../non-collection-profiles/blueprints/ncpBlueprintTimerInput';
import FormCheckbox from '../../../../../common/form/FormCheckBox';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import moment from 'moment';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import { API } from '../../../../../../api/api-routes';
import SuccessPopUpModal from '../../../../../common/successModal';

const formDefaultData = {
  monday_start_time: '',
  monday_end_time: '',
  tuesday_start_time: '',
  tuesday_end_time: '',
  wednesday_start_time: '',
  wednesday_end_time: '',
  thursday_start_time: '',
  thursday_end_time: '',
  friday_start_time: '',
  friday_end_time: '',
  saturday_start_time: '',
  saturday_end_time: '',
  sunday_start_time: '',
  sunday_end_time: '',
};

const ShiftScheduleModal = ({
  showConfirmation,
  onCancel,
  onConfirm,
  heading,
  classes,
  disabled = false,
  onSubmits,
}) => {
  const { timeZone } = Intl.DateTimeFormat().resolvedOptions();
  const params = useParams();
  const accessToken = localStorage.getItem('token');
  const [showModal, setShowModal] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [showField, setShowField] = useState({
    mon: true,
    tue: true,
    wed: true,
    thu: true,
    fri: true,
    sat: true,
    sun: true,
  });
  const [applyAll, setApplyAll] = useState(false);

  const schemaBuilder = () => {
    let dynamicSchema = yup.object();
    if (showField.mon) {
      dynamicSchema = dynamicSchema.shape({
        monday_start_time: yup
          .string()
          .required('Start time is required.')
          .test(
            'start-time',
            'Start time must be before end time',
            function (value) {
              const end_time = this.parent.monday_end_time;
              return (
                !value || !end_time || new Date(value) < new Date(end_time)
              );
            }
          ),
        // .test(
        //   'min-start-time',
        //   'Minimum start time is 12:00 AM',
        //   function (value) {
        //     return (
        //       !value ||
        //       moment(value, 'hh:mm A').isSameOrAfter('12:00 AM', 'minutes')
        //     );
        //   }
        // ),
        monday_end_time: yup
          .string()
          .required('End time is required.')
          .test(
            'end-time',
            'End time must be after start time',
            function (value) {
              const start_time = this.parent.monday_start_time;
              return (
                !value || !start_time || new Date(value) > new Date(start_time)
              );
            }
          ),
        // .test(
        //   'max-end-time',
        //   'Maximum end time is 11:59 PM',
        //   function (value) {
        //     return (
        //       !value ||
        //       moment(value, 'hh:mm A').isSameOrBefore('11:59 PM', 'minutes')
        //     );
        //   }
        // ),
      });
    }
    if (showField.tue) {
      dynamicSchema = dynamicSchema.shape({
        tuesday_start_time: yup
          .string()
          .required('Start time is required.')
          .test(
            'start-time',
            'Start time must be before end time',
            function (value) {
              const end_time = this.parent.tuesday_end_time;
              return (
                !value || !end_time || new Date(value) < new Date(end_time)
              );
            }
          ),
        tuesday_end_time: yup
          .string()
          .required('End time is required.')
          .test(
            'end-time',
            'End time must be after start time',
            function (value) {
              const start_time = this.parent.tuesday_start_time;
              return (
                !value || !start_time || new Date(value) > new Date(start_time)
              );
            }
          ),
      });
    }
    if (showField.wed) {
      dynamicSchema = dynamicSchema.shape({
        wednesday_start_time: yup
          .string()
          .required('Start time is required.')
          .test(
            'start-time',
            'Start time must be before end time',
            function (value) {
              const end_time = this.parent.wednesday_end_time;
              return (
                !value || !end_time || new Date(value) < new Date(end_time)
              );
            }
          ),
        wednesday_end_time: yup
          .string()
          .required('End time is required.')
          .test(
            'end-time',
            'End time must be after start time',
            function (value) {
              const start_time = this.parent.wednesday_start_time;
              return (
                !value || !start_time || new Date(value) > new Date(start_time)
              );
            }
          ),
      });
    }
    if (showField.thu) {
      dynamicSchema = dynamicSchema.shape({
        thursday_start_time: yup
          .string()
          .required('Start time is required.')
          .test(
            'start-time',
            'Start time must be before end time',
            function (value) {
              const end_time = this.parent.thursday_end_time;
              return (
                !value || !end_time || new Date(value) < new Date(end_time)
              );
            }
          ),
        thursday_end_time: yup
          .string()
          .required('End time is required.')
          .test(
            'end-time',
            'End time must be after start time',
            function (value) {
              const start_time = this.parent.thursday_start_time;
              return (
                !value || !start_time || new Date(value) > new Date(start_time)
              );
            }
          ),
      });
    }
    if (showField.fri) {
      dynamicSchema = dynamicSchema.shape({
        friday_start_time: yup
          .string()
          .required('Start time is required.')
          .test(
            'start-time',
            'Start time must be before end time',
            function (value) {
              const end_time = this.parent.friday_end_time;
              return (
                !value || !end_time || new Date(value) < new Date(end_time)
              );
            }
          ),
        friday_end_time: yup
          .string()
          .required('End time is required.')
          .test(
            'end-time',
            'End time must be after start time',
            function (value) {
              const start_time = this.parent.friday_start_time;
              return (
                !value || !start_time || new Date(value) > new Date(start_time)
              );
            }
          ),
      });
    }
    if (showField.sat) {
      dynamicSchema = dynamicSchema.shape({
        saturday_start_time: yup
          .string()
          .required('Start time is required.')
          .test(
            'start-time',
            'Start time must be before end time',
            function (value) {
              const end_time = this.parent.saturday_end_time;
              return (
                !value || !end_time || new Date(value) < new Date(end_time)
              );
            }
          ),
        saturday_end_time: yup
          .string()
          .required('End time is required.')
          .test(
            'end-time',
            'End time must be after start time',
            function (value) {
              const start_time = this.parent.saturday_start_time;
              return (
                !value || !start_time || new Date(value) > new Date(start_time)
              );
            }
          ),
      });
    }
    if (showField.sun) {
      dynamicSchema = dynamicSchema.shape({
        sunday_start_time: yup
          .string()
          .required('Start time is required.')
          .test(
            'start-time',
            'Start time must be before end time',
            function (value) {
              const end_time = this.parent.sunday_end_time;
              return (
                !value || !end_time || new Date(value) < new Date(end_time)
              );
            }
          ),
        sunday_end_time: yup
          .string()
          .required('End time is required.')
          .test(
            'end-time',
            'End time must be after start time',
            function (value) {
              const start_time = this.parent.sunday_start_time;
              return (
                !value || !start_time || new Date(value) > new Date(start_time)
              );
            }
          ),
      });
    }
    return dynamicSchema;
  };

  const schema = schemaBuilder();

  const {
    handleSubmit,
    control,
    // setError,
    getValues,
    setValue,
    formState: { errors },
    reset,
    clearErrors,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
    defaultValues: formDefaultData,
  });

  const getShiftScheduleData = async () => {
    const { data } = await API.crm.contacts.staff.getShiftScheduleData(
      params?.id,
      accessToken
    );
    if (data?.status_code === 200) {
      if (data?.data) {
        const convertTime = (time) =>
          time
            ? time !== '00:00:00'
              ? moment(time, 'hh:mm A').utc().local()
              : ''
            : '';

        const convertedData = Object.fromEntries(
          Object?.entries(data?.data)?.map(([key, value]) => {
            if (key?.includes('time')) {
              return [key, convertTime(value)];
            }
            return [key, value];
          })
        );
        reset({ ...formDefaultData, ...convertedData });
      }

      if (
        data?.data?.monday_start_time &&
        data?.data?.monday_start_time !== '00:00:00'
      ) {
        setShowField((prevShowField) => ({
          ...prevShowField,
          mon: true,
        }));
      }
      if (
        !data?.data?.monday_start_time ||
        data?.data?.monday_start_time === '00:00:00'
      ) {
        setShowField((prevShowField) => ({
          ...prevShowField,
          mon: false,
        }));
      }
      if (
        data?.data?.tuesday_start_time &&
        data?.data?.tuesday_start_time !== '00:00:00'
      ) {
        setShowField((prevShowField) => ({
          ...prevShowField,
          tue: true,
        }));
      }
      if (
        !data?.data?.tuesday_start_time ||
        data?.data?.tuesday_start_time === '00:00:00'
      ) {
        setShowField((prevShowField) => ({
          ...prevShowField,
          tue: false,
        }));
      }
      if (
        data?.data?.wednesday_start_time &&
        data?.data?.wednesday_start_time !== '00:00:00'
      ) {
        setShowField((prevShowField) => ({
          ...prevShowField,
          wed: true,
        }));
      }
      if (
        !data?.data?.wednesday_start_time ||
        data?.data?.wednesday_start_time === '00:00:00'
      ) {
        setShowField((prevShowField) => ({
          ...prevShowField,
          wed: false,
        }));
      }
      if (
        data?.data?.thursday_start_time &&
        data?.data?.thursday_start_time !== '00:00:00'
      ) {
        setShowField((prevShowField) => ({
          ...prevShowField,
          thu: true,
        }));
      }
      if (
        !data?.data?.thursday_start_time ||
        data?.data?.thursday_start_time === '00:00:00'
      ) {
        setShowField((prevShowField) => ({
          ...prevShowField,
          thu: false,
        }));
      }
      if (
        data?.data?.friday_start_time &&
        data?.data?.friday_start_time !== '00:00:00'
      ) {
        setShowField((prevShowField) => ({
          ...prevShowField,
          fri: true,
        }));
      }
      if (
        !data?.data?.friday_start_time ||
        data?.data?.friday_start_time === '00:00:00'
      ) {
        setShowField((prevShowField) => ({
          ...prevShowField,
          fri: false,
        }));
      }
      if (
        data?.data?.saturday_start_time &&
        data?.data?.saturday_start_time !== '00:00:00'
      ) {
        setShowField((prevShowField) => ({
          ...prevShowField,
          sat: true,
        }));
      }
      if (
        !data?.data?.saturday_start_time ||
        data?.data?.saturday_start_time === '00:00:00'
      ) {
        setShowField((prevShowField) => ({
          ...prevShowField,
          sat: false,
        }));
      }
      if (
        data?.data?.sunday_start_time &&
        data?.data?.sunday_start_time !== '00:00:00'
      ) {
        setShowField((prevShowField) => ({
          ...prevShowField,
          sun: true,
        }));
      }
      if (
        !data?.data?.sunday_start_time ||
        data?.data?.sunday_start_time === '00:00:00'
      ) {
        setShowField((prevShowField) => ({
          ...prevShowField,
          sun: false,
        }));
      }
    }
  };

  useEffect(() => {
    if (params?.id) {
      getShiftScheduleData();
    }
  }, [showConfirmation]);

  useEffect(() => {
    if (!showField.mon) {
      setValue('monday_start_time', null);
      setValue('monday_end_time', null);
    }
    if (!showField.tue) {
      setValue('tuesday_start_time', null);
      setValue('tuesday_end_time', null);
    }
    if (!showField.wed) {
      setValue('wednesday_start_time', null);
      setValue('wednesday_end_time', null);
    }
    if (!showField.thu) {
      setValue('thursday_start_time', null);
      setValue('thursday_end_time', null);
    }
    if (!showField.fri) {
      setValue('friday_start_time', null);
      setValue('friday_end_time', null);
    }
    if (!showField.sat) {
      setValue('saturday_start_time', null);
      setValue('saturday_end_time', null);
    }
    if (!showField.sat) {
      setValue('saturday_start_time', null);
      setValue('saturday_end_time', null);
    }
    if (!showField.sun) {
      setValue('sunday_start_time', null);
      setValue('sunday_end_time', null);
    }
  }, [showField]);

  const handleClickFunc = (event, day) => {
    const divName = event.currentTarget.getAttribute('name');
    if (divName === 'mon') {
      setShowField((prevShowField) => ({
        ...prevShowField,
        mon: !prevShowField.mon,
      }));
      setIsSubmit(false);
    }
    if (divName === 'tue') {
      setShowField((prevShowField) => ({
        ...prevShowField,
        tue: !prevShowField.tue,
      }));
      setIsSubmit(false);
    }
    if (divName === 'thu') {
      setShowField((prevShowField) => ({
        ...prevShowField,
        thu: !prevShowField.thu,
      }));
      setIsSubmit(false);
    }
    if (divName === 'wed') {
      setShowField((prevShowField) => ({
        ...prevShowField,
        wed: !prevShowField.wed,
      }));
      setIsSubmit(false);
    }
    if (divName === 'fri') {
      setShowField((prevShowField) => ({
        ...prevShowField,
        fri: !prevShowField.fri,
      }));
      setIsSubmit(false);
    }
    if (divName === 'sat') {
      setShowField((prevShowField) => ({
        ...prevShowField,
        sat: !prevShowField.sat,
      }));
      setIsSubmit(false);
    }
    if (divName === 'sun') {
      setShowField((prevShowField) => ({
        ...prevShowField,
        sun: !prevShowField.sun,
      }));
      setIsSubmit(false);
    }
  };

  const applyToAll = (startTime, endTime) => {
    if (showField.tue) {
      setValue('tuesday_start_time', startTime);
      setValue('tuesday_end_time', endTime);
    }
    if (showField.wed) {
      setValue('wednesday_start_time', startTime);
      setValue('wednesday_end_time', endTime);
    }
    if (showField.thu) {
      setValue('thursday_start_time', startTime);
      setValue('thursday_end_time', endTime);
    }
    if (showField.fri) {
      setValue('friday_start_time', startTime);
      setValue('friday_end_time', endTime);
    }
    if (showField.sat) {
      setValue('saturday_start_time', startTime);
      setValue('saturday_end_time', endTime);
    }
    if (showField.sun) {
      setValue('sunday_start_time', startTime);
      setValue('sunday_end_time', endTime);
    }
  };

  const onSubmit = async (data) => {
    if (Object.values(showField).some((value) => value === true)) {
      const modifiedFormData = {};
      Object.keys(data).forEach((key) => {
        const value = data[key];
        modifiedFormData[key] = value === undefined ? null : value;
      });
      const convertTime = (time) =>
        time ? moment(time).format('HH:mm:ss.SSSZ') : '00:00:00';

      const convertedData = Object.fromEntries(
        Object?.entries(modifiedFormData)?.map(([key, value]) => {
          if (key?.includes('time')) {
            return [key, convertTime(value)];
          }
          return [key, value];
        })
      );
      let body = {
        staff_id: +params?.id,
        ...convertedData,
        id: +convertedData?.id,
      };
      const response = await API.crm.contacts.staff.createShiftSchedule(
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
        getShiftScheduleData();
        setShowModal(true);
      } else {
        toast.error(response?.data?.response, { autoClose: 3000 });
      }
    } else {
      setIsSubmit(true);
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
          {heading ? <h3>{heading}</h3> : ''}
          <span className={styles.description}>
            Your current time zone for your work schedule is {timeZone}
          </span>
          <div className={styles.applyToAll}>
            <div className={styles.daysList}>
              <div
                name="mon"
                onClick={(event) => handleClickFunc(event, 'mon')}
                className={`${styles.days} ${
                  showField.mon ? styles.clicked : styles.normal
                }`}
              >
                <span
                  className={`styles.daysText ${
                    showField.mon
                      ? styles.textColorWhite
                      : styles.textColorBlack
                  }`}
                >
                  M
                </span>
              </div>
              <div
                name="tue"
                onClick={(event) => handleClickFunc(event, 'tue')}
                className={`${styles.days} ${
                  showField.tue ? styles.clicked : styles.normal
                }`}
              >
                <span
                  className={`styles.daysText ${
                    showField.tue
                      ? styles.textColorWhite
                      : styles.textColorBlack
                  }`}
                >
                  T
                </span>
              </div>
              <div
                name="wed"
                onClick={(event) => handleClickFunc(event, 'wed')}
                className={`${styles.days} ${
                  showField.wed ? styles.clicked : styles.normal
                }`}
              >
                <span
                  className={`styles.daysText ${
                    showField.wed
                      ? styles.textColorWhite
                      : styles.textColorBlack
                  }`}
                >
                  W
                </span>
              </div>
              <div
                name="thu"
                onClick={(event) => handleClickFunc(event, 'thu')}
                className={`${styles.days} ${
                  showField.thu ? styles.clicked : styles.normal
                }`}
              >
                <span
                  className={`styles.daysText ${
                    showField.thu
                      ? styles.textColorWhite
                      : styles.textColorBlack
                  }`}
                >
                  T
                </span>
              </div>
              <div
                name="fri"
                onClick={(event) => handleClickFunc(event, 'fri')}
                className={`${styles.days} ${
                  showField.fri ? styles.clicked : styles.normal
                }`}
              >
                <span
                  className={`styles.daysText ${
                    showField.fri
                      ? styles.textColorWhite
                      : styles.textColorBlack
                  }`}
                >
                  F
                </span>
              </div>
              <div
                name="sat"
                onClick={(event) => handleClickFunc(event, 'sat')}
                className={`${styles.days} ${
                  showField.sat ? styles.clicked : styles.normal
                }`}
              >
                <span
                  className={`styles.daysText ${
                    showField.sat
                      ? styles.textColorWhite
                      : styles.textColorBlack
                  }`}
                >
                  S
                </span>
              </div>
              <div
                name="sun"
                onClick={(event) => handleClickFunc(event, 'sun')}
                className={`${styles.days} ${
                  showField.sun ? styles.clicked : styles.normal
                }`}
              >
                <span
                  className={`styles.daysText ${
                    showField.sun
                      ? styles.textColorWhite
                      : styles.textColorBlack
                  }`}
                >
                  S
                </span>
              </div>
            </div>
            <div>
              <Controller
                name={`apply_to_all`}
                control={control}
                render={({ field }) => (
                  <FormCheckbox
                    displayName="Apply To All"
                    checked={applyAll}
                    classes={{ text: 'apply-to' }}
                    onChange={(e) => {
                      setApplyAll(!applyAll);
                      if (e.target.checked) {
                        if (
                          getValues()?.monday_start_time &&
                          getValues()?.monday_end_time
                        ) {
                          applyToAll(
                            getValues()?.monday_start_time,
                            getValues()?.monday_end_time
                          );
                          clearErrors();
                        }
                      } else {
                        applyToAll(null, null);
                      }
                    }}
                  />
                )}
              />
            </div>
          </div>
          {isSubmit ? (
            <div className={styles.error}>Please select at least one day</div>
          ) : (
            ''
          )}
          <form
            className={styles.formContainer}
            onSubmit={handleSubmit(onSubmit)}
          >
            {showField.mon ? (
              <div className={styles.fieldList}>
                <div className={styles.dayField}>Mon</div>
                <div className="d-flex">
                  <div className={`${styles.selectMarginShift}`}>
                    <Controller
                      name={`monday_start_time`}
                      control={control}
                      //   defaultValue={}
                      render={({ field }) => (
                        <NcpBlueprintTimerInput
                          timeGap={60}
                          value={field.value ? field.value : ''}
                          placeholder="Start Time*"
                          onBlur={field.onBlur}
                          onChange={(e) => {
                            field.onChange(e);
                          }}
                        />
                      )}
                    />
                    {errors?.monday_start_time?.message ? (
                      <div className={styles.error}>
                        {errors?.monday_start_time?.message}
                      </div>
                    ) : (
                      ''
                    )}
                  </div>
                  <div className={`${styles.selectMarginShift}`}>
                    <Controller
                      name={`monday_end_time`}
                      control={control}
                      //   defaultValue={}
                      render={({ field }) => (
                        <NcpBlueprintTimerInput
                          timeGap={60}
                          value={field.value ? field.value : ''}
                          placeholder="End Time*"
                          onBlur={field.onBlur}
                          onChange={(e) => {
                            field.onChange(e);
                          }}
                        />
                      )}
                    />
                    {errors?.monday_end_time?.message ? (
                      <div className={styles.error}>
                        {errors?.monday_end_time?.message}
                      </div>
                    ) : (
                      ''
                    )}
                  </div>
                </div>
              </div>
            ) : (
              ''
            )}
            {showField.tue ? (
              <div className={styles.fieldList}>
                <div className={styles.dayField}>Tue</div>

                <div className={`${styles.selectMarginShift}`}>
                  <Controller
                    name={`tuesday_start_time`}
                    control={control}
                    //   defaultValue={}
                    render={({ field }) => (
                      <NcpBlueprintTimerInput
                        timeGap={60}
                        value={field.value ? field.value : ''}
                        placeholder="Start Time*"
                        onBlur={field.onBlur}
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                        // error={
                        //   errors?.shifts?.[currentNumber]?.breakStartTime?.message
                        // }
                      />
                    )}
                  />
                  {errors?.tuesday_start_time?.message ? (
                    <div className={styles.error}>
                      {errors?.tuesday_start_time?.message}
                    </div>
                  ) : (
                    ''
                  )}
                </div>
                <div className={`${styles.selectMarginShift}`}>
                  <Controller
                    name={`tuesday_end_time`}
                    control={control}
                    //   defaultValue={}
                    render={({ field }) => (
                      <NcpBlueprintTimerInput
                        timeGap={60}
                        value={field.value ? field.value : ''}
                        placeholder="End Time*"
                        onBlur={field.onBlur}
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                      />
                    )}
                  />
                  {errors?.tuesday_end_time?.message ? (
                    <div className={styles.error}>
                      {errors?.tuesday_end_time?.message}
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            ) : (
              ''
            )}
            {showField.wed ? (
              <div className={styles.fieldList}>
                <div className={styles.dayField}>Wed</div>

                <div className={`${styles.selectMarginShift}`}>
                  <Controller
                    name={`wednesday_start_time`}
                    control={control}
                    //   defaultValue={}
                    render={({ field }) => (
                      <NcpBlueprintTimerInput
                        timeGap={60}
                        value={field.value ? field.value : ''}
                        placeholder="Start Time*"
                        onBlur={field.onBlur}
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                      />
                    )}
                  />
                  {errors?.wednesday_start_time?.message ? (
                    <div className={styles.error}>
                      {errors?.wednesday_start_time?.message}
                    </div>
                  ) : (
                    ''
                  )}
                </div>
                <div className={`${styles.selectMarginShift}`}>
                  <Controller
                    name={`wednesday_end_time`}
                    control={control}
                    //   defaultValue={}
                    render={({ field }) => (
                      <NcpBlueprintTimerInput
                        timeGap={60}
                        value={field.value ? field.value : ''}
                        placeholder="End Time*"
                        onBlur={field.onBlur}
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                      />
                    )}
                  />
                  {errors?.wednesday_end_time?.message ? (
                    <div className={styles.error}>
                      {errors?.wednesday_end_time?.message}
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            ) : (
              ''
            )}
            {showField.thu ? (
              <div className={styles.fieldList}>
                <div className={styles.dayField}>Thu</div>

                <div className={`${styles.selectMarginShift}`}>
                  <Controller
                    name={`thursday_start_time`}
                    control={control}
                    //   defaultValue={}
                    render={({ field }) => (
                      <NcpBlueprintTimerInput
                        timeGap={60}
                        value={field.value ? field.value : ''}
                        placeholder="Start Time*"
                        onBlur={field.onBlur}
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                      />
                    )}
                  />
                  {errors?.thursday_start_time?.message ? (
                    <div className={styles.error}>
                      {errors?.thursday_start_time?.message}
                    </div>
                  ) : (
                    ''
                  )}
                </div>
                <div className={`${styles.selectMarginShift}`}>
                  <Controller
                    name={`thursday_end_time`}
                    control={control}
                    //   defaultValue={}
                    render={({ field }) => (
                      <NcpBlueprintTimerInput
                        timeGap={60}
                        value={field.value ? field.value : ''}
                        placeholder="End Time*"
                        onBlur={field.onBlur}
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                      />
                    )}
                  />
                  {errors?.thursday_end_time?.message ? (
                    <div className={styles.error}>
                      {errors?.thursday_end_time?.message}
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            ) : (
              ''
            )}
            {showField.fri ? (
              <div className={styles.fieldList}>
                <div className={styles.dayField}>Fri</div>

                <div className={`${styles.selectMarginShift}`}>
                  <Controller
                    name={`friday_start_time`}
                    control={control}
                    //   defaultValue={}
                    render={({ field }) => (
                      <NcpBlueprintTimerInput
                        timeGap={60}
                        value={field.value ? field.value : ''}
                        placeholder="Start Time*"
                        onBlur={field.onBlur}
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                      />
                    )}
                  />
                  {errors?.friday_start_time?.message ? (
                    <div className={styles.error}>
                      {errors?.friday_start_time?.message}
                    </div>
                  ) : (
                    ''
                  )}
                </div>
                <div className={`${styles.selectMarginShift}`}>
                  <Controller
                    name={`friday_end_time`}
                    control={control}
                    //   defaultValue={}
                    render={({ field }) => (
                      <NcpBlueprintTimerInput
                        timeGap={60}
                        value={field.value ? field.value : ''}
                        placeholder="End Time*"
                        onBlur={field.onBlur}
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                      />
                    )}
                  />
                  {errors?.friday_end_time?.message ? (
                    <div className={styles.error}>
                      {errors?.friday_end_time?.message}
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            ) : (
              ''
            )}
            {showField.sat ? (
              <div className={styles.fieldList}>
                <div className={styles.dayField}>Sat</div>

                <div className={`${styles.selectMarginShift}`}>
                  <Controller
                    name={`saturday_start_time`}
                    control={control}
                    //   defaultValue={}
                    render={({ field }) => (
                      <NcpBlueprintTimerInput
                        timeGap={60}
                        value={field.value ? field.value : ''}
                        placeholder="Start Time*"
                        onBlur={field.onBlur}
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                      />
                    )}
                  />
                  {errors?.saturday_start_time?.message ? (
                    <div className={styles.error}>
                      {errors?.saturday_start_time?.message}
                    </div>
                  ) : (
                    ''
                  )}
                </div>
                <div className={`${styles.selectMarginShift}`}>
                  <Controller
                    name={`saturday_end_time`}
                    control={control}
                    //   defaultValue={}
                    render={({ field }) => (
                      <NcpBlueprintTimerInput
                        timeGap={60}
                        value={field.value ? field.value : ''}
                        placeholder="End Time*"
                        onBlur={field.onBlur}
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                      />
                    )}
                  />
                  {errors?.saturday_end_time?.message ? (
                    <div className={styles.error}>
                      {errors?.saturday_end_time?.message}
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            ) : (
              ''
            )}
            {showField.sun ? (
              <div className={styles.fieldList}>
                <div className={styles.dayField}>Sun</div>

                <div className={`${styles.selectMarginShift}`}>
                  <Controller
                    name={`sunday_start_time`}
                    control={control}
                    //   defaultValue={}
                    render={({ field }) => (
                      <NcpBlueprintTimerInput
                        timeGap={60}
                        value={field.value ? field.value : ''}
                        placeholder="Start Time*"
                        onBlur={field.onBlur}
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                      />
                    )}
                  />
                  {errors?.sunday_start_time?.message ? (
                    <div className={styles.error}>
                      {errors?.sunday_start_time?.message}
                    </div>
                  ) : (
                    ''
                  )}
                </div>
                <div className={`${styles.selectMarginShift}`}>
                  <Controller
                    name={`sunday_end_time`}
                    control={control}
                    //   defaultValue={}
                    render={({ field }) => (
                      <NcpBlueprintTimerInput
                        timeGap={60}
                        value={field.value ? field.value : ''}
                        placeholder="End Time*"
                        onBlur={field.onBlur}
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                      />
                    )}
                  />
                  {errors?.sunday_end_time?.message ? (
                    <div className={styles.error}>
                      {errors?.sunday_end_time?.message}
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            ) : (
              ''
            )}
            <div className={styles.shiftBtns}>
              <span
                className={styles.cancelShiftBtn}
                onClick={() => {
                  onCancel();
                  reset();
                  getShiftScheduleData();
                }}
              >
                Cancel
              </span>
              <button
                type="submit"
                className={styles.saveShiftBtn}
                onClick={onConfirm}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
      <SuccessPopUpModal
        title={'Success!'}
        message={'Shift Schedule Updated.'}
        modalPopUp={showModal}
        setModalPopUp={setShowModal}
        showActionBtns={true}
      />
    </section>
  );
};

export default ShiftScheduleModal;
