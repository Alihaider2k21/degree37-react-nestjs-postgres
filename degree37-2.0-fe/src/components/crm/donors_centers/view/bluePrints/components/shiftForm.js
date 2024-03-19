import React, { useEffect, useMemo, useRef, useState } from 'react';
import FormInput from '../../../../../common/form/FormInput';
import FormCheckbox from '../../../../../common/form/FormCheckBox';
import SvgComponent from '../../../../../common/SvgComponent';
import { Controller } from 'react-hook-form';
import GlobalMultiSelect from '../../../../../common/GlobalMultiSelect';
import SelectDropdown from '../../../../../common/selectDropdown';
import 'rc-time-picker/assets/index.css';
import ToolTip from '../../../../../common/tooltip';
import moment from 'moment';
import { makeAuthorizedApiRequest } from '../../../../../../helpers/Api';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker as MyTimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';

const ShiftForm = ({
  shift,
  index,
  control,
  setShifts,
  shifts,
  errors,
  formErrors,
  shiftDevicesOptions,
  procedureTypesList,
  procedureProducts,
  allowAppointmentAtShiftEndTime,
  maximumOef,
  minimumOef,
  shiftSlots,
  setShiftSlots,
  staffSetupShiftOptions,
  setStaffSetupShiftOptions,
}) => {
  const [disableReduction, setDisableReduction] = useState(false);
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [startShiftTimeToolTip] = useState('');
  const [endShiftTimeToolTip] = useState('');
  const [reductionStep, setReductionStep] = useState('0.5');
  const [viewAs, setViewAs] = useState('Products');
  const [totalSlots, setTotalSlots] = useState(0);
  const debouncedFetch = useRef(null);
  const [endTimeDisabled, setEndTimeDisabled] = useState(true);
  const [staffBreakendTimeDisabled, setStaffBreakendTimeDisabled] =
    useState(true);
  const [indexStaff, setIndexStaff] = useState(-1);
  const [valueStaff, setValueStaff] = useState(-1);

  useMemo(() => {
    // Loop Over Each Projection
    let shiftTotalSlots = [];
    for (let i = 0; i < shift?.projections?.length; i++) {
      const projectionItem = shift.projections[i];
      const breakStartTime = shift.breakStartTime
        ? moment(shift.breakStartTime.toDate())
        : '';
      if (breakStartTime != '') {
        breakStartTime.seconds(0);
        breakStartTime.milliseconds(0);
      }
      const breakEndTime = shift.breakEndTime
        ? moment(shift.breakEndTime.toDate())
        : '';
      if (breakEndTime != '') {
        breakEndTime.seconds(0);
        breakEndTime.milliseconds(0);
      }
      const hasStaffBreak = shift.staffBreak;
      const reduceSlots = shift.reduceSlot;
      // Loop Over each staff Setup selected for procedure in Projection
      for (let j = 0; j < projectionItem?.staffSetup?.length; j++) {
        // Staff Setup Selected
        const staffSetupItem = projectionItem?.staffSetup[j];

        // No Of Beds in Staff Setup
        const noOfBeds = staffSetupItem.beds;

        // No Of Concurrent Beds in Staff Setup
        const concurrentBeds = staffSetupItem.concurrent_beds;

        // Stagger Minutes for Staff Setup
        const stagger = staffSetupItem.stagger;

        // Procedure Duration for Procedure Selected
        const procedureDuration = projectionItem?.procedure?.procedure_duration;

        // Start time of the shift
        const shiftStartTimeM = moment(shift.startTime.toDate());
        shiftStartTimeM.seconds(0);
        shiftStartTimeM.milliseconds(0);

        // End time of the shift
        const shiftEndTimeM = moment(shift.endTime.toDate());
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
          Math.round((parseFloat(shift.reduction) / 100) * noOfSlotsInBreak)
        );
        let bedsCovered = 0;
        for (let bed = 0; bed < noOfBeds; bed++) {
          let skippedSlots = 0;
          // Below will contain slots for bed in Staff Setup Projection
          if (noOfBeds > concurrentBeds && bedsCovered == concurrentBeds) {
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
            if (hasStaffBreak) {
              // Handle Slots where shift has break
              if (breakStartTime != '' && breakEndTime != '' && reduceSlots) {
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
            procedure_type_id:
              shifts[index]?.projections?.[i]?.procedure?.value,
            staff_setup_id:
              shifts[index]?.projections?.[i]?.staffSetup?.[j]?.id,
          };
          shiftTotalSlots.push(tempSlotsItem);
        }
      }
    }
    setShiftSlots((prev) => ({
      ...prev,
      [index]: shiftTotalSlots,
    }));
  }, [
    index,
    shift.startTime,
    shift.endTime,
    shift.reduceSlot,
    shift.breakStartTime,
    shift.breakEndTime,
    shift.reduction,
    shift.projections,
    shift.staffBreak,
  ]);

  useEffect(() => {
    let sumOfSlots = 0;
    Object.values(shiftSlots)?.map((slotItem) => {
      slotItem?.map((ite) => {
        sumOfSlots += ite?.items?.length;
      });
    });
    setTotalSlots(sumOfSlots);
  }, [shiftSlots]);

  const fetchStaffSetups = async (
    pIndex,
    procedure_type_id,
    minStaff,
    maxStaff
  ) => {
    try {
      const response = await makeAuthorizedApiRequest(
        'GET',
        `${BASE_URL}/staffing-admin/staff-setup/blueprint/donor_center?operation_type=SESSION&procedure_type_id=${procedure_type_id}&minStaff=${minStaff}&maxStaff=${maxStaff}`
      );
      const data = await response.json();

      const staffOptions = data?.data?.map((item) => {
        return {
          name: item.name,
          id: item.id,
          qty: item.sumstaffqty,
          beds: item.beds,
          concurrent_beds: item.concurrent_beds,
          stagger: item.stagger_slots,
        };
      });
      setStaffSetupShiftOptions(() => {
        return shifts?.map((item, i) =>
          i === index
            ? {
                projections: shifts[index]?.projections?.map(
                  (x, y) =>
                    pIndex === y
                      ? {
                          ...staffSetupShiftOptions?.[index]?.projections?.[
                            pIndex
                          ],
                          staffSetupOptions: staffOptions,
                        }
                      : staffSetupShiftOptions?.[i]?.projections?.[y] // i or index
                ),
              }
            : staffSetupShiftOptions?.[i] || item
        );
      });
    } catch (error) {
      console.error(`Error fetching data ${error}`, {
        autoClose: 3000,
      });
    }
  };
  const debouncedFecthStaff = async (index, value, minStaff, maxStaff) => {
    if (value) {
      if (debouncedFetch.current) {
        clearTimeout(debouncedFetch.current);
      }
      // Debounce the fetch function
      debouncedFetch.current = setTimeout(() => {
        // Your fetchStaffSetups logic goes here
        // Remember to handle cleanup and setStaffSetupShiftOptions accordingly
        fetchStaffSetups(index, value, minStaff, maxStaff);
      }, 1000); // Adjust the timeout as needed

      return () => {
        // Clear the timeout on component unmount or when the dependencies change
        clearTimeout(debouncedFetch.current);
      };
    }
  };
  const selectUnselectAllDevices = (i, checked, data) => {
    const output = shifts.map((item, index) =>
      i === index
        ? {
            ...item,
            devices: checked ? [] : data,
          }
        : i
    );
    setShifts([...output]);
  };
  const addRemoveDevices = (i, e) => {
    const currentState = shifts[i].devices;
    if (currentState.find((item) => item.id === e.id)) {
      const output = shifts.map((item, index) => {
        return i === index
          ? {
              ...item,
              devices: item.devices.filter((s) => s.id !== e.id),
            }
          : i;
      });
      setShifts([...output]);
    } else {
      const output = shifts.map((item, index) =>
        i === index
          ? {
              ...item,
              devices: [...shifts[i].devices, e],
            }
          : item
      );
      setShifts([...output]);
    }
  };

  const addRemoveShiftSetup = (i, j, e) => {
    const currentState = shifts[i]?.projections[j]?.staffSetup;

    if (currentState?.find((item) => item.id === e.id)) {
      const output = shifts?.map((item, index) =>
        i === index
          ? {
              ...item,
              projections: shifts[index]?.projections?.map((x, y) =>
                j === y
                  ? {
                      ...x,
                      staffSetup: shifts[i]?.projections[j]?.staffSetup.filter(
                        (s) => s.id !== e.id
                      ),
                    }
                  : x
              ),
            }
          : i
      );
      setShifts([...output]);
    } else {
      const output = shifts?.map((item, index) =>
        i === index
          ? {
              ...item,
              projections: shifts[index]?.projections?.map((x, y) =>
                j === y
                  ? {
                      ...x,
                      staffSetup: [
                        ...(shifts?.[i]?.projections?.[j]?.staffSetup || []),
                        e,
                      ],
                    }
                  : x
              ),
            }
          : item
      );
      setShifts([...output]);
    }
  };

  const selectUnselectAllShiftSetup = (i, j, checked, data) => {
    const output = shifts.map((item, index) =>
      i === index
        ? {
            ...item,
            projections: shifts[i].projections.map((x, y) =>
              j === y
                ? {
                    ...x,
                    staffSetup: checked ? [] : data,
                  }
                : x
            ),
          }
        : i
    );
    setShifts([...output]);
  };
  const addProjections = (i) => {
    setShifts((prev) => {
      return prev.map((shift, index) =>
        index === i
          ? {
              ...shift,
              projections: [
                ...prev[index].projections,
                { projection: 0, procedure: 25, product: 25, staffSetup: [] },
              ],
            }
          : shift
      );
    });
  };
  const resetProjections = (i, pIndex) => {
    setShifts((prev) => {
      return prev.map((shift, index) =>
        index === i
          ? {
              ...shift,
              projections: shifts[index]?.projections?.map((x, y) =>
                pIndex === y
                  ? {
                      projection: 0,
                      procedure: 25,
                      product: 25,
                      staffSetup: [],
                    }
                  : x
              ),
            }
          : shift
      );
    });
  };

  const removeProjection = (i, pIndex) => {
    setShifts((prev) => {
      return prev.map((shift, index) =>
        index === i
          ? {
              ...shift,
              projections: shifts[index]?.projections?.filter(
                (x, y) => pIndex !== y
              ),
            }
          : shift
      );
    });
  };
  const fetchOEFDetails = async () => {
    if (shift.endTime && shift.startTime) {
      let sumProducts = 0;
      let sumProcedures = 0;

      shift.projections?.map((item) => {
        if (item?.procedure?.quantity) {
          sumProcedures += parseInt(item?.procedure?.quantity);
        }
        if (item?.product?.quantity) {
          sumProducts += parseInt(item?.product?.quantity);
        }
      });
      const hours =
        shift.endTime && shift.startTime
          ? moment.duration(shift.endTime.diff(shift.startTime)).hours()
          : 0;

      // const procedureToHourRatio = sumProcedures / hours;
      const minStaffArray = [];
      const maxStaffArray = [];
      shift.projections?.map((item) => {
        minStaffArray.push(
          Math.round(item?.procedure?.quantity / hours / maximumOef)
        );
        maxStaffArray.push(
          Math.floor(item?.procedure?.quantity / hours / minimumOef)
        );
      });
      if (indexStaff != -1 && valueStaff != -1)
        debouncedFecthStaff(
          indexStaff,
          shift?.projections?.[indexStaff]?.procedure?.value,
          minStaffArray[indexStaff],
          maxStaffArray[indexStaff]
        );
      setShifts((prev) => {
        return prev.map((i, j) =>
          j === index
            ? {
                ...i,
                minOEF: minimumOef,
                maxOEF: maximumOef,
                maxStaff: maxStaffArray,
                minStaff: minStaffArray,
                sumProcedures,
                sumProducts,
                hours,
              }
            : i
        );
      });
    }
  };

  useMemo(
    () => fetchOEFDetails(),
    [shift.startTime, shift.endTime, shift.projections]
  );

  const removeNewShift = (index) => {
    setShifts((prev) => {
      return prev.filter((s, i) => i !== index);
    });
  };

  const addNewShift = () => {
    const defaultState = {
      startTime: '',
      endTime: '',
      projections: [
        { projection: 0, procedure: 25, product: 25, staffSetup: [] },
      ],
      resources: [],
      devices: [],
      staffBreak: false,
      breakStartTime: '',
      breakEndTime: '',
      reduceSlot: false,
      reduction: 0,
      OEF: 0,
      minStaff: [0],
      maxStaff: [0],
    };
    setShifts((prev) => {
      return [...prev, defaultState];
    });
  };

  const getOEFValue = () => {
    const productHoursRation = shift.sumProducts / shift.hours;
    const procedureHoursRation = shift.sumProcedures / shift.hours;
    let sumStaff = 0;
    shift?.projections?.map((proj) => {
      proj.staffSetup?.map((ss) => {
        sumStaff += parseFloat(ss.qty);
      });
    });
    const oef =
      (viewAs == 'Products' ? productHoursRation : procedureHoursRation) /
      Math.ceil(sumStaff);
    return isNaN(oef) ? 0 : oef.toFixed(2);
  };

  return (
    <>
      <div className="formGroup shift-form" key={'shifts' + index}>
        <h5>
          Schedule Shift {index + 1}
          <span className="shift-count">{index + 1}</span>
        </h5>{' '}
        <Controller
          name={`start_time${index}`}
          control={control}
          render={({ field }) => (
            <div className="form-field">
              <div className={`field shiftTime`}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <MyTimePicker
                    classes={{ root: 'dsd' }}
                    valueType="time"
                    value={dayjs(shift?.startTime)}
                    onChange={(e) => {
                      setEndTimeDisabled(false);
                      setShifts((prev) => {
                        return prev?.map((i, j) =>
                          j === index ? { ...i, startTime: e } : i
                        );
                      });
                      field.onChange(e);
                    }}
                    className="w-100 shift"
                    label="Start Time*"
                  />
                </LocalizationProvider>
              </div>

              {startShiftTimeToolTip !== '' && (
                <ToolTip text={startShiftTimeToolTip} />
              )}
              {errors?.startTime && (
                <div className="error">
                  <div className="error">
                    <p>{errors?.startTime}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        />
        <Controller
          name={`end_time${index}`}
          control={control}
          render={({ field }) => (
            <div className="form-field">
              <div className={`field shiftTime`}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <MyTimePicker
                    classes={{ root: 'dsd' }}
                    valueType="time"
                    value={dayjs(shift?.endTime)}
                    disabled={endTimeDisabled}
                    onChange={(e) => {
                      setShifts((prev) => {
                        return prev?.map((i, j) =>
                          j === index ? { ...i, endTime: e } : i
                        );
                      });
                      field.onChange(e);
                    }}
                    className="w-100 shift"
                    label="End Time*"
                  />
                </LocalizationProvider>
              </div>
              {endShiftTimeToolTip !== '' && (
                <ToolTip text={endShiftTimeToolTip} />
              )}
              {errors?.endTime && (
                <div className="error">
                  <div className="error">
                    <p>{errors?.endTime}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        />
        {shift?.projections?.map((projection, pIndex) => {
          return (
            <React.Fragment key={'project' + pIndex}>
              <div className="w-100">
                <p>Projection*</p>
              </div>
              <Controller
                name="Projection"
                control={control}
                render={({ field }) => {
                  return (
                    <SelectDropdown
                      placeholder={'Projection*'}
                      showLabel={
                        projection.projection &&
                        projection.projection.value !== 0
                          ? true
                          : false
                      }
                      defaultValue={projection.projection?.value}
                      selectedValue={projection.projection}
                      removeDivider
                      onChange={(e) => {
                        if (e?.value) {
                          setShifts((prev) => {
                            return prev.map((i, j) =>
                              j === index
                                ? {
                                    ...i,
                                    projections: prev[j].projections.map(
                                      (x, y) =>
                                        y === pIndex
                                          ? {
                                              ...x,
                                              projection: e,
                                              procedure: { ...e, quantity: 1 },
                                              product:
                                                procedureProducts?.[e?.value],
                                            }
                                          : x
                                    ),
                                  }
                                : i
                            );
                          });
                        } else {
                          setShifts((prev) => {
                            return prev.map((i, j) =>
                              j === index
                                ? {
                                    ...i,
                                    projections: prev[j].projections.map(
                                      (x, y) =>
                                        y === pIndex
                                          ? {
                                              ...x,
                                              projection: 0,
                                              procedure: 0,
                                              product: 0,
                                            }
                                          : x
                                    ),
                                  }
                                : i
                            );
                          });
                        }
                      }}
                      handleBlur={(e) => {
                        field.onChange(e);
                      }}
                      options={procedureTypesList?.filter((item) => {
                        const exitingItems = [];
                        shift?.projections?.map((pItem) => {
                          if (pItem?.procedure?.value)
                            exitingItems.push(pItem?.procedure?.value);
                        });
                        return !exitingItems.includes(item.value);
                      })}
                      error={errors?.projections?.[pIndex]?.projection}
                    />
                  );
                }}
              />
              <div className="col-md-6 pro-sec">
                {shift.projections[pIndex].projection != 0 && (
                  <div className="row">
                    <div className="col-md-6 d-flex">
                      <span className="pro-label">
                        {shift.projections[pIndex].procedure.label}
                      </span>
                      <Controller
                        name={`shift_projections_procedure_${pIndex}`}
                        control={control}
                        render={({ field }) => (
                          <FormInput
                            value={shift.projections[pIndex].procedure.quantity}
                            name={field.name}
                            classes={{ root: '' }}
                            required={false}
                            type="number"
                            min="1"
                            onChange={(e) => {
                              setIndexStaff(pIndex);
                              setValueStaff(e.target.value);
                              const output = shifts?.map((item, sIndex) =>
                                sIndex === index
                                  ? {
                                      ...item,
                                      projections: shifts[
                                        index
                                      ]?.projections?.map((x, y) =>
                                        pIndex === y
                                          ? {
                                              ...x,
                                              staffSetup: [],
                                            }
                                          : x
                                      ),
                                    }
                                  : item
                              );
                              setShifts([...output]);
                              setShifts((prev) => {
                                return prev.map((i, j) =>
                                  j === index
                                    ? {
                                        ...i,
                                        projections: prev[j].projections.map(
                                          (x, y) =>
                                            y === pIndex
                                              ? {
                                                  ...x,
                                                  procedure: {
                                                    ...x.procedure,
                                                    quantity: e.target.value,
                                                  },
                                                  product: {
                                                    ...x['product'],
                                                    quantity:
                                                      e.target.value /
                                                      (1 / x['product'].yield),
                                                  },
                                                }
                                              : x
                                        ),
                                      }
                                    : i
                                );
                              });
                            }}
                          />
                        )}
                      />
                    </div>
                    <div className="col-md-6 d-flex text-right">
                      <span className="pro-label">
                        {shift?.projections?.[pIndex]?.product?.name}
                      </span>
                      <Controller
                        name="25"
                        control={control}
                        render={({ field }) => (
                          <FormInput
                            style={{ minWidth: '48px' }}
                            value={
                              shift?.projections?.[pIndex]?.product?.quantity
                            }
                            name={field.name}
                            classes={{ root: '' }}
                            required={false}
                            type="number"
                            min="1"
                            onChange={(e) => {
                              const output = shifts?.map((item, sIndex) =>
                                sIndex === index
                                  ? {
                                      ...item,
                                      projections: shifts[
                                        index
                                      ]?.projections?.map((x, y) =>
                                        pIndex === y
                                          ? {
                                              ...x,
                                              staffSetup: [],
                                            }
                                          : x
                                      ),
                                    }
                                  : item
                              );
                              setShifts([...output]);
                              setShifts((prev) => {
                                return prev.map((i, j) =>
                                  j === index
                                    ? {
                                        ...i,
                                        projections: prev[j]?.projections.map(
                                          (x, y) =>
                                            y === pIndex
                                              ? {
                                                  ...x,
                                                  procedure: {
                                                    ...x.procedure,
                                                    quantity:
                                                      e.target.value *
                                                      (1 / x['product'].yield),
                                                  },
                                                  product: {
                                                    ...x['product'],
                                                    quantity: e.target.value,
                                                  },
                                                }
                                              : x
                                        ),
                                      }
                                    : i
                                );
                              });
                            }}
                          />
                        )}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="col-md-6">
                <Controller
                  name="Staff_setup"
                  control={control}
                  render={({ field }) => {
                    return (
                      <GlobalMultiSelect
                        data={
                          staffSetupShiftOptions[index]?.projections[pIndex]
                            ?.staffSetupOptions || []
                        }
                        selectedOptions={projection.staffSetup}
                        onChange={(e) => {
                          addRemoveShiftSetup(index, pIndex, e);
                        }}
                        onSelectAll={(e) => {
                          selectUnselectAllShiftSetup(
                            index,
                            pIndex,
                            projection?.staffSetup?.length ===
                              staffSetupShiftOptions[index]?.projections[pIndex]
                                ?.staffSetupOptions.length,
                            staffSetupShiftOptions[index]?.projections[pIndex]
                              ?.staffSetupOptions || []
                          );
                        }}
                        label={'Staff Setup*'}
                        isquantity={false}
                        quantity={0}
                        disabled={false}
                        error={errors?.projections?.[pIndex]?.staff_setup}
                      />
                    );
                  }}
                />
              </div>
              <div className="col-md-6">
                <p className="oef">
                  <span className={`ms-2`}>
                    <ToolTip
                      text={
                        'OEF range (minimum and maximum OEF ) is fetched from industry category based on selected account from drive section.'
                      }
                    />
                  </span>
                  <span className="ps-2">
                    OEF requires{' '}
                    {!isNaN(shift?.minStaff?.[pIndex])
                      ? shift?.minStaff?.[pIndex] >= 0
                        ? shift?.minStaff?.[pIndex]
                        : 0
                      : 0}
                    -{' '}
                    {!isNaN(shift?.maxStaff?.[pIndex])
                      ? shift?.maxStaff?.[pIndex] >= 0
                        ? shift?.maxStaff?.[pIndex]
                        : 0
                      : 0}{' '}
                    staff
                  </span>
                </p>
                <p className="res-add-btn">
                  {pIndex == shift.projections.length - 1 && (
                    <button
                      onClick={() => {
                        resetProjections(index, pIndex);
                      }}
                      type="button"
                    >
                      <SvgComponent name={'ResetIcon'} />
                    </button>
                  )}
                  {pIndex !== shift.projections.length - 1 &&
                    shift.projections.length > 1 && (
                      <button
                        onClick={() => {
                          removeProjection(index, pIndex);
                        }}
                        type="button"
                      >
                        <SvgComponent name={'TagsMinusIcon'} />
                      </button>
                    )}
                  <button
                    onClick={() => {
                      addProjections(index, pIndex);
                    }}
                    type="button"
                  >
                    <SvgComponent name={'PlusIcon'} />
                  </button>
                </p>
              </div>
            </React.Fragment>
          );
        })}{' '}
        <div className="w-100">
          <p>Resources*</p>
        </div>
        <div className="col-md-6">
          <Controller
            name="Devices"
            control={control}
            render={({ field }) => {
              return (
                <GlobalMultiSelect
                  data={shiftDevicesOptions}
                  selectedOptions={shift.devices}
                  error={errors?.devices}
                  onChange={(e) => {
                    addRemoveDevices(index, e);
                  }}
                  onSelectAll={(e) => {
                    selectUnselectAllDevices(
                      index,
                      shift.devices.length === shiftDevicesOptions.length,
                      shiftDevicesOptions
                    );
                  }}
                  label={'Devices'}
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
            name="staff_break"
            control={control}
            defaultValue={false}
            render={({ field }) => (
              <FormCheckbox
                name={field.name}
                displayName="Staff Break"
                checked={shift.staffBreak}
                classes={{ root: 'mt-2' }}
                onChange={(e) => {
                  setShifts((prev) => {
                    return prev.map((i, j) =>
                      j === index
                        ? {
                            ...i,
                            staffBreak: e.target.checked,
                          }
                        : i
                    );
                  });
                }}
              />
            )}
          />
        </div>
        {shift?.staffBreak && (
          <>
            <Controller
              name={`staff_start_time${index}`}
              control={control}
              render={({ field }) => (
                <div className="form-field">
                  <div className={`field shiftTime`}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <MyTimePicker
                        classes={{ root: 'dsd' }}
                        valueType="time"
                        value={dayjs(shift?.breakStartTime)}
                        onChange={(e) => {
                          setStaffBreakendTimeDisabled(false);
                          setShifts((prev) => {
                            return prev?.map((i, j) =>
                              j === index ? { ...i, breakStartTime: e } : i
                            );
                          });
                          field.onChange(e);
                        }}
                        className="w-100 shift"
                        label="Start Time*"
                      />
                    </LocalizationProvider>
                  </div>
                  {/* {formErrors?.[`staff_start_time`] && (
                    <div className="error">
                      <div className="error">
                        <p>{formErrors?.[`staff_start_time`].message}</p>
                      </div>
                    </div>
                  )} */}
                  {errors?.breakStartTime && (
                    <div className="error">
                      <div className="error">
                        <p>{errors?.breakStartTime}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            />
            <Controller
              name={`staff_end_time${index}`}
              control={control}
              render={({ field }) => (
                <div className="form-field">
                  <div className={`field shiftTime`}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <MyTimePicker
                        classes={{ root: 'dsd' }}
                        valueType="time"
                        value={dayjs(shift?.breakEndTime)}
                        disabled={staffBreakendTimeDisabled}
                        onChange={(e) => {
                          setShifts((prev) => {
                            return prev?.map((i, j) =>
                              j === index ? { ...i, breakEndTime: e } : i
                            );
                          });
                          field.onChange(e);
                        }}
                        className="w-100 shift"
                        label="End Time*"
                      />
                    </LocalizationProvider>
                  </div>
                  {/* {formErrors?.[`staff_end_time`] && (
                    <div className="error">
                      <div className="error">
                        <p>{formErrors?.[`staff_end_time`].message}</p>
                      </div>
                    </div>
                  )} */}
                  {errors?.breakEndTime && (
                    <div className="error">
                      <div className="error">
                        <p>{errors?.breakEndTime}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            />
            <div className="form-field">
              <div className="field">
                <Controller
                  name="staff_Reduce_Slots"
                  control={control}
                  render={({ field }) => (
                    <FormCheckbox
                      name={field.name}
                      displayName="Reduce Slots"
                      checked={shift.reduceSlot}
                      classes={{ root: 'mt-2' }}
                      onChange={(e) => {
                        e?.target?.checked
                          ? setDisableReduction(false)
                          : setDisableReduction(true);
                        shift.reduction = 0.0;
                        setShifts((prev) => {
                          return prev.map((i, j) =>
                            j === index
                              ? {
                                  ...i,
                                  reduceSlot: e.target.checked,
                                }
                              : i
                          );
                        });
                      }}
                    />
                  )}
                />
              </div>
            </div>
            <div className="form-field">
              <div className="field">
                <span className="app-red">
                  Appointment Reduction ({shift.reduction}%){' '}
                </span>
                <input
                  name="staff_Appointment_Reduction"
                  type="range"
                  className="form-range"
                  min="0"
                  max="100"
                  step={reductionStep}
                  id="customRange3"
                  value={shift.reduction}
                  disabled={disableReduction}
                  onChange={(e) => {
                    setShifts((prev) => {
                      return prev.map((i, j) =>
                        j === index
                          ? {
                              ...i,
                              reduction: e.target.value,
                            }
                          : i
                      );
                    });
                  }}
                ></input>
              </div>
            </div>
          </>
        )}
        <Controller
          name="OEF (Products)"
          control={control}
          render={({ field }) => (
            <FormInput
              name={field.name}
              classes={{ root: '' }}
              displayName={`OEF (${viewAs})`}
              value={getOEFValue()}
              required={false}
              disabled={true}
            />
          )}
        />
        <div className="col-md-6 text-right">
          <button
            className="btn btn-md btn-link p-0 editBtn text-right view-pro"
            color="primary"
            type="button"
            onClick={() => {
              if (viewAs === 'Products') {
                setViewAs('Procedures');
              } else {
                setViewAs('Products');
              }
            }}
          >
            View as {viewAs === 'Procedures' ? 'Products' : 'Procedures'}
          </button>
        </div>
        <p className="w-100 pro-slot">
          {viewAs}{' '}
          {viewAs === 'Procedures' ? shift.sumProcedures : shift.sumProducts} |
          Slots {totalSlots}
        </p>
        <div className="w-100 text-right">
          <button
            onClick={() => {
              addNewShift();
            }}
            type="button"
            className="btn btn-primary right-btn btn-md"
          >
            Add Shift
          </button>
          {index !== 0 ? (
            <button
              onClick={() => {
                removeNewShift(index);
              }}
              type="button"
              className="btn btn-danger right-btn btn-md"
            >
              Remove Shift
            </button>
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
};

export default ShiftForm;
