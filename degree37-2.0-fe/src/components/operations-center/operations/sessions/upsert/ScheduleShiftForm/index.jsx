import React from 'react';
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';
import { Controller } from 'react-hook-form';
import SvgComponent from '../../../../../common/SvgComponent';
import styles from '../../Session.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import ToolTip from '../../../../../common/tooltip';
import GlobalMultiSelect from '../../../../../common/GlobalMultiSelect';
import FormCheckbox from '../../../../../common/form/FormCheckBox';
import FormInput from '../../../../../common/form/FormInput';
import Projection from './Projection';
import moment from 'moment';

const getHoursAndMinutes = (date) => {
  const d = new Date(date);
  return [d.getHours(), d.getMinutes()];
};

const validateEndTime = (startTime, endTime) => {
  const [startTimeHours, startTimeMins] = getHoursAndMinutes(startTime);
  const [endTimeHours, endTimeMins] = getHoursAndMinutes(endTime);

  if (startTimeHours === endTimeHours) {
    return startTimeMins <= endTimeMins ? true : false;
  } else if (startTimeHours <= endTimeHours) {
    return true;
  }
  return false;
};

const totalHoursOfShift = (startTime, endTime) => {
  const [startTimeHours] = getHoursAndMinutes(startTime);
  const [endTimeHours] = getHoursAndMinutes(endTime);

  return endTimeHours - startTimeHours;
};

export default function ScheduleShiftForm({
  control,
  watch,
  setValue,
  shiftIndex,
  addShift,
  removeShift,
  shiftId,
  shiftIndexesLength,
  formErrors,
  shiftFieldName,
  procedureTypes,
  procedureTypesOptions,
  OEF,
  devicesOptions,
  allowAppointmentAtShiftEndTime,
  customErrors,
  setCustomErrors,
  slots,
}) {
  const [projectionIndexes, setProjectionIndexes] = React.useState([0]);
  const [viewAs, setViewAs] = React.useState('Products');
  const [shiftOEF, setShiftOEF] = React.useState(0);
  const [reductionStep, setReductionStep] = React.useState('0.5');

  const selectedProjections = watch(`${shiftFieldName}.projections`);
  const selectedDevices = watch(`${shiftFieldName}.devices`);
  const appointmentReduction = watch(`${shiftFieldName}.appointment_reduction`);
  const staffBreak = watch(`${shiftFieldName}.staff_break`);
  const staffBreakStart = watch(`${shiftFieldName}.break_start_time`);
  const staffBreakEnd = watch(`${shiftFieldName}.break_end_time`);
  const startTime = watch(`${shiftFieldName}.start_time`);
  const endTime = watch(`${shiftFieldName}.end_time`);
  const reduceSlots = watch(`${shiftFieldName}.reduce_slots`);

  const selectedProjectionsJSON = JSON.stringify(selectedProjections);

  const totalSlots = React.useMemo(() => {
    let sumOfSlots = 0;
    Object.values(slots)?.forEach((slotItem) => {
      slotItem?.forEach((item) => {
        sumOfSlots += item?.items?.length;
      });
    });
    return sumOfSlots;
  }, [slots]);

  React.useEffect(() => {
    let error_msg = '';
    if (endTime && !validateEndTime(startTime, endTime)) {
      error_msg = 'End time should be greater than start time';
    }
    setCustomErrors((prevErrors) => ({
      ...prevErrors,
      [`${shiftFieldName}.end_time`]: error_msg,
    }));
  }, [startTime, endTime, setCustomErrors, shiftFieldName]);

  React.useEffect(() => {
    const isBreakStartTimeLess = !validateEndTime(startTime, staffBreakStart);
    const isBreakStartTimeGreater = !validateEndTime(staffBreakStart, endTime);

    let error_msg = '';
    if (staffBreakStart && (isBreakStartTimeLess || isBreakStartTimeGreater)) {
      error_msg = isBreakStartTimeLess
        ? 'Break start time should be greater than shift start time'
        : 'Break start time should be less than shift end time';
    }

    setCustomErrors((prevErrors) => ({
      ...prevErrors,
      [`${shiftFieldName}.break_start_time`]: error_msg,
    }));
  }, [staffBreakStart, startTime, endTime, setCustomErrors, shiftFieldName]);

  React.useEffect(() => {
    const isBreakEndTimeLess = !validateEndTime(staffBreakStart, staffBreakEnd);
    const isBreakEndTimeGreater = !validateEndTime(staffBreakEnd, endTime);

    let error_msg = '';
    if (staffBreakEnd && (isBreakEndTimeLess || isBreakEndTimeGreater)) {
      error_msg = isBreakEndTimeLess
        ? 'Break end time should be greater than break start time'
        : 'Break end time should be less than shift end time';
    }
    setCustomErrors((prevErrors) => ({
      ...prevErrors,
      [`${shiftFieldName}.break_end_time`]: error_msg,
    }));
  }, [
    staffBreakStart,
    staffBreakEnd,
    endTime,
    shiftFieldName,
    setCustomErrors,
  ]);

  React.useEffect(() => {
    // FIXME: Following code is taken from DriveUpsert due to the shortage of time.
    // Need to fix if it is not working as expected.

    let shiftTotalSlots = [];
    const breakStartTime = staffBreakStart
      ? moment(staffBreakStart?.toDate())
      : '';
    const breakEndTime = staffBreakEnd ? moment(staffBreakEnd?.toDate()) : '';

    if (breakStartTime !== '') {
      breakStartTime.seconds(0);
      breakStartTime.milliseconds(0);
    }
    if (breakEndTime !== '') {
      breakEndTime.seconds(0);
      breakEndTime.milliseconds(0);
    }

    // Loop Over Each Projection
    for (const projection of selectedProjections) {
      // Loop Over each staff Setup selected for procedure in Projection
      for (let j = 0; j < projection?.staff_setup?.length; j++) {
        // Staff Setup Selected
        const staffSetupItem = projection?.staff_setup[j];
        if (!staffSetupItem) continue;

        // No Of Beds in Staff Setup
        const noOfBeds = staffSetupItem.beds;

        // No Of Concurrent Beds in Staff Setup
        const concurrentBeds = staffSetupItem.concurrent_beds;

        // Stagger Minutes for Staff Setup
        const stagger = staffSetupItem.stagger;

        // Procedure Duration for Procedure Selected
        const procedureDuration = projection?.procedure?.procedure_duration;

        // Start time of the shift
        const shiftStartTimeM = moment(startTime.toDate());
        shiftStartTimeM.seconds(0);
        shiftStartTimeM.milliseconds(0);

        // End time of the shift
        const shiftEndTimeM = moment(endTime.toDate());
        shiftEndTimeM.seconds(0);
        shiftEndTimeM.milliseconds(0);
        let noOfSlotsInBreak = 0;
        for (
          let start = moment(breakStartTime);
          start < breakEndTime;
          start.add(parseInt(procedureDuration), 'minutes')
        ) {
          noOfSlotsInBreak++;
        }

        const minNoOfReduceSlot = noOfSlotsInBreak - 1;
        const reductionValue =
          100 - (minNoOfReduceSlot / noOfSlotsInBreak) * 100;
        setReductionStep(parseInt(Math.floor(reductionValue)));
        const slotsToRemove = parseInt(
          Math.round(
            (parseFloat(appointmentReduction) / 100) * noOfSlotsInBreak
          )
        );
        let bedsCovered = 0;
        for (let bed = 0; bed < noOfBeds; bed++) {
          let skippedSlots = 0;
          // Below will contain slots for bed in Staff Setup Projection
          if (noOfBeds > concurrentBeds && bedsCovered === concurrentBeds) {
            shiftStartTimeM.add(stagger, 'minutes');
            bedsCovered = 1;
          } else {
            bedsCovered++;
          }
          const slotsForBedInStaffSetupProjection = [];
          for (
            let start = moment(shiftStartTimeM);
            start <= shiftEndTimeM;
            start.add(procedureDuration, 'minutes')
          ) {
            const slotStartTime = moment(start);
            const slotEndTime = moment(start).add(
              parseInt(procedureDuration),
              'minutes'
            );
            if (staffBreak) {
              // Handle Slots where shift has break
              if (breakStartTime !== '' && breakEndTime !== '' && reduceSlots) {
                // Handle Reduce Slots
                if (
                  !(
                    slotStartTime.isSameOrAfter(breakStartTime) &&
                    slotEndTime.isSameOrBefore(breakEndTime)
                  )
                ) {
                  if (allowAppointmentAtShiftEndTime) {
                    if (slotStartTime.isSameOrBefore(shiftEndTimeM))
                      slotsForBedInStaffSetupProjection.push({
                        startTime: slotStartTime,
                        endTime: slotEndTime,
                      });
                  } else {
                    if (
                      slotStartTime.isBefore(shiftEndTimeM) &&
                      slotEndTime.isBefore(shiftEndTimeM)
                    )
                      slotsForBedInStaffSetupProjection.push({
                        startTime: slotStartTime,
                        endTime: slotEndTime,
                      });
                  }
                }

                if (
                  slotStartTime.isSameOrAfter(breakStartTime) &&
                  slotEndTime.isSameOrBefore(breakEndTime)
                ) {
                  if (skippedSlots < slotsToRemove) {
                    if (allowAppointmentAtShiftEndTime) {
                      if (slotStartTime.isSameOrBefore(shiftEndTimeM))
                        slotsForBedInStaffSetupProjection.push({
                          startTime: slotStartTime,
                          endTime: slotEndTime,
                        });
                    } else {
                      if (
                        slotStartTime.isBefore(shiftEndTimeM) &&
                        slotEndTime.isBefore(shiftEndTimeM)
                      )
                        slotsForBedInStaffSetupProjection.push({
                          startTime: slotStartTime,
                          endTime: slotEndTime,
                        });
                    }
                    skippedSlots++;
                  }
                }
              } else {
                // Add Only rhe Slots that are not during a break  interval
                if (
                  !(
                    slotStartTime.isSameOrAfter(breakStartTime) &&
                    slotEndTime.isSameOrBefore(breakEndTime)
                  )
                ) {
                  if (allowAppointmentAtShiftEndTime) {
                    if (slotStartTime.isSameOrBefore(shiftEndTimeM))
                      slotsForBedInStaffSetupProjection.push({
                        startTime: slotStartTime,
                        endTime: slotEndTime,
                      });
                  } else {
                    if (
                      slotStartTime.isBefore(shiftEndTimeM) &&
                      slotEndTime.isBefore(shiftEndTimeM)
                    )
                      slotsForBedInStaffSetupProjection.push({
                        startTime: slotStartTime,
                        endTime: slotEndTime,
                      });
                  }
                }
              }
            } else {
              if (allowAppointmentAtShiftEndTime) {
                if (slotStartTime.isSameOrBefore(shiftEndTimeM))
                  slotsForBedInStaffSetupProjection.push({
                    startTime: slotStartTime,
                    endTime: slotEndTime,
                  });
              } else {
                if (
                  slotStartTime.isBefore(shiftEndTimeM) &&
                  slotEndTime.isBefore(shiftEndTimeM)
                )
                  slotsForBedInStaffSetupProjection.push({
                    startTime: slotStartTime,
                    endTime: slotEndTime,
                  });
              }
            }
          }
          const tempSlotsItem = {
            bed: bed,
            items: slotsForBedInStaffSetupProjection,
            procedure_type_id: projection?.procedure?.id,
            staff_setup_id: staffSetupItem?.id,
          };
          shiftTotalSlots.push(tempSlotsItem);
        }
      }
    }

    setValue('slots', { ...slots, [shiftIndex]: shiftTotalSlots });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedProjectionsJSON,
    allowAppointmentAtShiftEndTime,
    appointmentReduction,
    setValue,
    shiftIndex,
    staffBreak,
    staffBreakEnd,
    staffBreakStart,
    startTime,
    endTime,
    reduceSlots,
  ]);

  const handleSumOfProjections = React.useCallback(() => {
    return selectedProjections?.reduce(
      (sum, proj) =>
        sum +
        parseFloat(
          proj[viewAs === 'Products' ? 'product_yield' : 'procedure_type_qty']
        ),
      0
    );
  }, [selectedProjections, viewAs]);

  const handleOEF = React.useCallback(() => {
    const sumOfProjections = handleSumOfProjections();
    const sumOfStaff =
      selectedProjections?.reduce((sum, proj) => {
        return (
          sum +
          parseFloat(
            proj?.staff_setup?.reduce((setupSum, setup) => {
              return setupSum + parseFloat(setup?.sumstaffqty);
            }, 0)
          )
        );
      }, 0) || 0;
    const hours = totalHoursOfShift(startTime, endTime);
    const oef =
      sumOfProjections /
      (hours === 0 || isNaN(hours) ? 1 : hours) /
      Math.ceil(sumOfStaff);

    setShiftOEF(isNaN(oef) || !isFinite(oef) ? 0 : oef.toFixed(2));
  }, [selectedProjections, startTime, endTime, handleSumOfProjections]);

  React.useEffect(
    () => handleOEF(),
    [handleOEF, selectedProjectionsJSON, viewAs]
  );

  const handleDevicesChange = (devices) => {
    let devicesCopy = [...selectedDevices];
    devicesCopy = devicesCopy.some((item) => item.id === devices.id)
      ? devicesCopy.filter((item) => item.id !== devices.id)
      : [...devicesCopy, devices];
    setValue(`${shiftFieldName}.devices`, devicesCopy);
  };

  const handleDevicesChangeAll = (data) =>
    setValue(`${shiftFieldName}.devices`, data);

  const handleViewAs = () => {
    setViewAs(viewAs === 'Procedures' ? 'Products' : 'Procedures');
  };

  return (
    <div className="formGroup shift-form mb-4">
      <h5>
        Schedule Shift {shiftIndex + 1}
        <span className="shift-count">{shiftIndex + 1}</span>
      </h5>
      <Controller
        name={`${shiftFieldName}.start_time`}
        control={control}
        render={({ field }) => (
          <div className="form-field daily-hour">
            <div className="field custom-class">
              <TimePicker
                disabled={false}
                value={field?.value || null}
                onChange={field.onChange}
                showSecond={false}
                allowEmpty
                use12Hours
                placeholder={'Start Time*'}
                clearIcon={
                  <FontAwesomeIcon
                    icon={faTimes}
                    className={styles.timerCross}
                    role="button"
                  />
                }
                inputIcon={
                  <div className="cursor-pointer">
                    <SvgComponent name={'TimeClock'} />
                  </div>
                }
              />
              {field?.value && (
                <label
                  className={`text-secondary ${styles.labelselected} ml-1 mt-1 pb-2`}
                >
                  Start Time*
                </label>
              )}
            </div>
            {formErrors?.shifts?.[shiftIndex]?.start_time && (
              <div className="error">
                <p>{formErrors?.shifts[shiftIndex]?.start_time?.message}</p>
              </div>
            )}
          </div>
        )}
      />
      <Controller
        name={`${shiftFieldName}.end_time`}
        control={control}
        render={({ field }) => (
          <div className="form-field daily-hour">
            <div className="field custom-class">
              <TimePicker
                disabled={false}
                value={field?.value}
                onChange={field.onChange}
                showSecond={false}
                allowEmpty
                use12Hours
                placeholder={'End Time*'}
                clearIcon={
                  <FontAwesomeIcon
                    icon={faTimes}
                    className={styles.timerCross}
                    role="button"
                  />
                }
                inputIcon={
                  <div className="cursor-pointer">
                    <SvgComponent name={'TimeClock'} />
                  </div>
                }
              />
              {field?.value && (
                <label
                  className={`text-secondary ${styles.labelselected} ml-1 mt-1 pb-2 mb-2`}
                >
                  End Time*
                </label>
              )}
            </div>
            {(customErrors?.[`${shiftFieldName}.end_time`] ||
              formErrors?.shifts?.[shiftIndex]?.end_time) && (
              <div className="error">
                <p>
                  {customErrors?.[`${shiftFieldName}.end_time`] ||
                    formErrors?.shifts[shiftIndex]?.end_time?.message}
                </p>
              </div>
            )}
          </div>
        )}
      />
      {projectionIndexes.map((id, index) => {
        return (
          <Projection
            key={index}
            shiftFieldName={shiftFieldName}
            id={id}
            index={index}
            shiftIndex={shiftIndex}
            watch={watch}
            viewAs={viewAs}
            procedureTypes={procedureTypes}
            control={control}
            setValue={setValue}
            procedureTypesOptions={procedureTypesOptions}
            OEF={OEF}
            projectionIndexesLength={projectionIndexes.length}
            totalHoursOfShift={totalHoursOfShift(startTime, endTime)}
            setProjectionIndexes={setProjectionIndexes}
            triggerOEF={handleOEF}
            formErrors={formErrors}
          />
        );
      })}
      <div className="w-100">
        <p>Resources*</p>
      </div>
      <div className="form-field">
        <Controller
          name={`${shiftFieldName}.devices`}
          control={control}
          render={({ field }) => {
            return (
              <GlobalMultiSelect
                label="Devices"
                data={devicesOptions}
                selectedOptions={selectedDevices || []}
                error={formErrors?.shifts?.[shiftIndex]?.devices?.message || ''}
                onChange={handleDevicesChange}
                onSelectAll={handleDevicesChangeAll}
                onBlur={() => {}}
                isquantity={false}
                quantity={0}
                disabled={false}
              />
            );
          }}
        />
      </div>
      <div className="w-100">
        <Controller
          name={`${shiftFieldName}.staff_break`}
          control={control}
          defaultValue={false}
          render={({ field }) => (
            <FormCheckbox
              name={field.name}
              displayName="Staff Break"
              checked={field?.value}
              onChange={(e) => {
                field?.onChange(e);
                setValue(`${shiftFieldName}.break_start_time`, undefined);
                setValue(`${shiftFieldName}.break_end_time`, undefined);
                setValue(`${shiftFieldName}.reduce_slots`, false);
              }}
            />
          )}
        />
      </div>
      {staffBreak ? (
        <>
          <Controller
            name={`${shiftFieldName}.break_start_time`}
            control={control}
            render={({ field }) => (
              <div className="form-field daily-hour">
                <div className="field custom-class">
                  <TimePicker
                    disabled={false}
                    value={field?.value}
                    onChange={field.onChange}
                    showSecond={false}
                    allowEmpty
                    use12Hours
                    placeholder={'Start Time'}
                    clearIcon={
                      <FontAwesomeIcon
                        icon={faTimes}
                        className={styles.timerCross}
                        role="button"
                      />
                    }
                    inputIcon={
                      <div className="cursor-pointer">
                        <SvgComponent name={'TimeClock'} />
                      </div>
                    }
                  />
                  {field?.value && (
                    <label
                      className={`text-secondary ${styles.labelselected} ml-1 mt-1 pb-2 mb-2`}
                    >
                      Start Time
                    </label>
                  )}
                </div>
                {customErrors?.[`${shiftFieldName}.break_start_time`] && (
                  <div className="error">
                    <p>
                      {customErrors?.[`${shiftFieldName}.break_start_time`]}
                    </p>
                  </div>
                )}
              </div>
            )}
          />
          <Controller
            name={`${shiftFieldName}.break_end_time`}
            control={control}
            render={({ field }) => (
              <div className="form-field daily-hour">
                <div className="field custom-class">
                  <TimePicker
                    disabled={false}
                    value={field?.value}
                    onChange={field.onChange}
                    showSecond={false}
                    allowEmpty
                    use12Hours
                    placeholder={'End Time'}
                    clearIcon={
                      <FontAwesomeIcon
                        icon={faTimes}
                        className={styles.timerCross}
                        role="button"
                      />
                    }
                    inputIcon={
                      <div className="cursor-pointer">
                        <SvgComponent name={'TimeClock'} />
                      </div>
                    }
                  />
                  {field?.value && (
                    <label
                      className={`text-secondary ${styles.labelselected} ml-1 mt-1 pb-2 mb-2`}
                    >
                      End Time
                    </label>
                  )}
                </div>
                {customErrors?.[`${shiftFieldName}.break_end_time`] && (
                  <div className="error">
                    <p>{customErrors?.[`${shiftFieldName}.break_end_time`]}</p>
                  </div>
                )}
              </div>
            )}
          />
          <Controller
            name={`${shiftFieldName}.reduce_slots`}
            control={control}
            defaultValue={false}
            render={({ field }) => (
              <FormCheckbox
                name={field.name}
                displayName="Reduce Slots"
                classes={{ root: 'mt-2' }}
                checked={field?.value}
                onChange={(e) => {
                  field?.onChange(e);
                  setValue(`${shiftFieldName}.appointment_reduction`, 0);
                }}
              />
            )}
          />
          {reduceSlots ? (
            <Controller
              name={`${shiftFieldName}.appointment_reduction`}
              control={control}
              defaultValue={false}
              render={({ field }) => (
                <>
                  <div className="form-field">
                    <div className="field">
                      <span className="text-sm">
                        Appointment Reduction{' '}
                        {`(${
                          appointmentReduction ? appointmentReduction : 0
                        }%)`}{' '}
                      </span>
                      <div className="d-flex align-items-center">
                        <span className="text-sm me-1">0%</span>
                        <input
                          type="range"
                          className={`form-range ${styles.range}`}
                          min="0"
                          max="100"
                          step={reductionStep}
                          value={field?.value ? field?.value : 0}
                          onChange={(e) =>
                            setValue(
                              `${shiftFieldName}.appointment_reduction`,
                              e.target.value
                            )
                          }
                        />
                        <span className="text-sm ms-1">100%</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            />
          ) : (
            <div className="w-50"></div>
          )}
        </>
      ) : null}
      <Controller
        name={`${shiftFieldName}.oef_product`}
        control={control}
        render={({ field }) => (
          <FormInput
            name={field.name}
            showLabel={true}
            displayName={`OEF (${viewAs})`}
            value={shiftOEF}
            required={false}
            disabled={true}
          />
        )}
      />
      <div className="col-md-6 text-end">
        <p className="text-right mt-2" style={{ color: '#005375' }}>
          <button
            type="button"
            className="bg-body border-0 text-primary"
            onClick={handleViewAs}
          >
            View As {viewAs === 'Procedures' ? 'Products' : 'Procedures'}
          </button>
        </p>
      </div>{' '}
      <p className="w-100 d-flex align-items-center">
        <span className={`ms-2`}>
          <ToolTip
            text={
              'OEF range (minimum and maximum OEF ) is fetched from industry category based on selected account from drive section.'
            }
          />
        </span>
        <span className="ms-1">
          {viewAs} {handleSumOfProjections()} | Slots {totalSlots}
        </span>
      </p>
      <div className="w-100 text-right">
        {shiftIndex + 1 === shiftIndexesLength ? (
          <button
            type="button"
            className="btn btn-primary right-btn btn-md"
            onClick={addShift}
          >
            Add Shift
          </button>
        ) : (
          <button
            onClick={removeShift(shiftId)}
            type="button"
            className="btn btn-danger right-btn btn-md"
          >
            Remove Shift
          </button>
        )}
      </div>
    </div>
  );
}
