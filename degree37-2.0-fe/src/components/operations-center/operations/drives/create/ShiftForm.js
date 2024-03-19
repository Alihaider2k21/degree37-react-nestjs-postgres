import React, { useEffect, useMemo, useRef, useState } from 'react';
import FormInput from '../../../../common/form/FormInput';
import FormCheckbox from '../../../../common/form/FormCheckBox';
import SvgComponent from '../../../../common/SvgComponent';
import { Controller } from 'react-hook-form';
import styles from '../index.module.scss';
import GlobalMultiSelect from '../../../../common/GlobalMultiSelect';
import SelectDropdown from '../../../../common/selectDropdown';
import { makeAuthorizedApiRequest } from '../../../../../helpers/Api';
import moment from 'moment';
import ToolTip from '../../../../common/tooltip';
import ShareStaffModal from './share-staff-modal';
import { API } from '../../../../../api/api-routes';
import { toast } from 'react-toastify';
import LinkVehiclesmodel from './linkVehiclesmodel';
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
  getValues,
  formErrors,
  errors,
  shiftDevicesOptions,
  shiftResourcesOptions,
  staffSetupOptions,
  collectionOperationId,
  driveDate,
  travelMinutes,
  procedureTypesList,
  procedureProducts,
  location_type,
  watch,
  industryCategories,
  isOverrideUser,
  allowAppointmentAtShiftEndTime,
  shiftSlots,
  setShiftSlots,
  setStaffSetupShiftOptions,
  staffSetupShiftOptions,
  selectedLinkDrive,
  setSelectedLinkDrive,
}) => {
  const [disableReduction, setDisableReduction] = useState(true);
  const account = watch('account');
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [startDate, setStartDate] = useState();
  const [startShiftTimeToolTip, setStartShiftTimeToolTip] = useState('');
  const [endShiftTimeToolTip, setEndShiftTimeToolTip] = useState('');
  // const [shareStaffModal, setShareStaffModal] = useState(false);
  const [dailyHours, setDailyHours] = useState();
  const [reductionStep, setReductionStep] = useState('0.5');
  const [viewAs, setViewAs] = useState('Products');
  const [totalSlots, setTotalSlots] = useState(0);
  const debouncedFetch = useRef(null);
  const [shareStaffModal, setShareStaffModal] = useState(false);
  const [shareStaffData, setShareStaffData] = useState([]);
  const [staffShareRequired, setStaffShareRequired] = useState(0);
  const [linkableVehicles, setLinkAbleVehicles] = useState(null);
  const [vehiclesModel, setVehiclesModel] = useState(false);
  const [indexStaff, setIndexStaff] = useState(-1);
  const [valueStaff, setValueStaff] = useState(-1);
  // const [projectionOptions, setProjectionOptions] = useState({});
  const [endTimeDisabled, setEndTimeDisabled] = useState(true);
  const [staffBreakendTimeDisabled, setStaffBreakendTimeDisabled] =
    useState(true);

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
    Object.values(shiftSlots)?.[index]?.map((slotItem) => {
      sumOfSlots += slotItem?.items?.length;
    });
    setTotalSlots(sumOfSlots);
  }, [shiftSlots]);

  const fetchStagingSitesAndDonorCenters = async (
    driveDate,
    collectionOperationId
  ) => {
    const {
      data: { data },
    } =
      await API.systemConfiguration.organizationalAdministrations.facilities.getStagingSitesAndDonorCenters(
        driveDate,
        collectionOperationId
      );
    setShareStaffData(data);
  };

  // Fetch the Daily Hours based on drive date and collection operation of Account selected
  const fetchDailyHours = async () => {
    if (driveDate && collectionOperationId) {
      try {
        fetchStagingSitesAndDonorCenters(driveDate, collectionOperationId);
        const response = await makeAuthorizedApiRequest(
          'GET',
          `${BASE_URL}/booking-drive/daily-hour/drive?collectionOperation=${collectionOperationId}&driveDate=${moment(
            driveDate
          )}`
        );
        const data = await response.json();
        setDailyHours(data?.data?.[0]);
      } catch (error) {
        console.error(`Failed to fetch Locations data ${error}`, {
          autoClose: 3000,
        });
      }
    }
  };
  useEffect(() => {
    fetchDailyHours();
  }, [collectionOperationId, driveDate]);

  // Tooltip for Start and End time of Shift based on Daily Hours, Drive Date and Travel time of Location
  useEffect(() => {
    const driveDay = moment(driveDate).format('ddd').toLocaleLowerCase();

    const earliestDepartureTime =
      dailyHours?.[`${driveDay}_earliest_depart_time`] || null;

    const latestReturnTime =
      dailyHours?.[`${driveDay}_latest_return_time`] || null;

    if (earliestDepartureTime) {
      const earliestDepartureTimeM = moment(earliestDepartureTime);
      earliestDepartureTimeM.add(travelMinutes, 'minute');
      setStartShiftTimeToolTip(
        'The preferred shift start time based on daily hours is ' +
          earliestDepartureTimeM.format('h:mm A')
      );
    }
    if (latestReturnTime) {
      const latestReturnTimeM = moment(latestReturnTime);
      latestReturnTimeM.subtract(travelMinutes, 'minute');
      setEndShiftTimeToolTip(
        'The preferred shift end time based on daily hours is ' +
          latestReturnTimeM.format('h:mm A')
      );
    }
  }, [dailyHours, travelMinutes, driveDate]);

  const fetchStaffSetupConfigurations = async (ids) => {
    try {
      const driveDay = moment(driveDate).format('ddd').toLocaleLowerCase();
      const earliestDepartureTime =
        dailyHours?.[`${driveDay}_earliest_depart_time`] || null;
      const latestReturnTime =
        dailyHours?.[`${driveDay}_latest_return_time`] || null;
      const earliestDepartureTimeM = moment(earliestDepartureTime);
      const latestReturnTimeM = moment(latestReturnTime);
      let leadTime = 0;
      let setupTime = 0;
      let breakdownTime = 0;
      let wrapupTime = 0;
      const response = await makeAuthorizedApiRequest(
        'GET',
        `${BASE_URL}/staffing-admin/staff-setup/drives/byIds?ids=${ids.join(
          ','
        )}`
      );
      const data = await response.json();
      data?.data?.map((item) => {
        const staffConfiguration = item.staff_configuration[0];
        if (leadTime < staffConfiguration.lead_time)
          leadTime = staffConfiguration.lead_time;
        if (setupTime < staffConfiguration.setup_time)
          setupTime = staffConfiguration.setup_time;
        if (breakdownTime < staffConfiguration.breakdown_time)
          breakdownTime = staffConfiguration.breakdown_time;
        if (wrapupTime < staffConfiguration.wrapup_time)
          wrapupTime = staffConfiguration.wrapup_time;
      });
      if (earliestDepartureTime) {
        earliestDepartureTimeM.add(travelMinutes, 'minute');
        earliestDepartureTimeM.add(leadTime, 'minute');
        earliestDepartureTimeM.add(setupTime, 'minute');
        setStartShiftTimeToolTip(
          'The preferred shift start time based on daily hours and staff setup is ' +
            earliestDepartureTimeM.format('h:mm A')
        );
      }
      if (latestReturnTime) {
        latestReturnTimeM.subtract(travelMinutes, 'minute');
        latestReturnTimeM.subtract(breakdownTime, 'minute');
        latestReturnTimeM.subtract(wrapupTime, 'minute');
        setEndShiftTimeToolTip(
          'The preferred shift end time based on daily hours and staff setup is ' +
            latestReturnTimeM.format('h:mm A')
        );
      }
    } catch (error) {
      console.error(`Error fetching data ${error}`, {
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    const staffSetupSelected = shift?.projections?.map(
      (item) => item.staffSetup
    )[0];

    const staffSetupSelectedIds = staffSetupSelected?.map((item) => item.id);
    if (staffSetupSelectedIds?.length)
      fetchStaffSetupConfigurations(staffSetupSelectedIds);
  }, [shift, travelMinutes]);
  // Fetch the Staff setup based on the procedure type and Location type of selected location
  const fetchStaffSetups = async (
    pIndex,
    procedure_type_id,
    minStaff,
    maxStaff
  ) => {
    try {
      const response = await makeAuthorizedApiRequest(
        'GET',
        `${BASE_URL}/staffing-admin/staff-setup/drive?location_type=${location_type}&operation_type=DRIVE&procedure_type_id=${procedure_type_id}&minStaff=${minStaff}&maxStaff=${maxStaff}&collectionOperation=${collectionOperationId}&drive_date=${driveDate}`
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

      const additionalStaffSetups = data?.additionalStaffSetups?.map((item) => {
        return {
          name:
            item.sumstaffqty < shift.minStaff
              ? item.name + '   (S)'
              : item.name,
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
                          additionalStaffSetups: additionalStaffSetups,
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

  useEffect(() => {
    if (collectionOperationId && location_type && shift?.startTime) {
      setStartDate(getValues()?.start_date);
      fetchVehicles(index);
    }
  }, [collectionOperationId, location_type, shift?.startTime]);
  // Fetch the Vehicles based on the collection operation of Account selected and Location type of selected location
  const fetchVehicles = async (index) => {
    const locationTypeData = {
      Outside: 1,
      Inside: 2,
      Combination: 3,
    };
    if (
      collectionOperationId &&
      location_type != '' &&
      shift?.startTime != ''
    ) {
      const formatDate = moment(startDate).format('YYYY-MM-DD');
      const formatTime = moment(shift?.startTime).format('HH:mm:ss.SSSSSS');
      const timeStamp = formatDate + ' ' + formatTime;
      try {
        const response = await makeAuthorizedApiRequest(
          'GET',
          `${BASE_URL}/vehicles/drives?location_type=${locationTypeData[location_type]}&collection_operation=${collectionOperationId}&start_time=${timeStamp}`
        );
        const data = await response.json();
        const vehicleOptions =
          data?.data?.map((item) => {
            return {
              name: item?.name,
              id: item?.id,
            };
          }) || [];
        setShifts((prev) => {
          return prev?.map((i, j) =>
            j === index
              ? {
                  ...i,
                  vehicleOptions: vehicleOptions,
                }
              : i
          );
        });
      } catch (error) {
        console.error(`Error fetching data ${error}`, {
          autoClose: 3000,
        });
      }
    }
  };
  useEffect(() => {
    getLinkableVehicles();
  }, []);
  const getLinkableVehicles = async () => {
    try {
      const response = await makeAuthorizedApiRequest(
        'GET',
        `${BASE_URL}/drives/linkvehicles`
      );
      const data = await response.json();
      const vehicles = data?.data?.map((item, index) => {
        let date;
        let account;
        let location;
        let start_time;
        let end_time;
        let vehicles_name = null;
        let staffSetup;
        let total_time;
        let id;
        item?.drives?.map((d, i) => {
          date = d?.date;
          id = d?.shifts?.[0].id;
          account = d?.account?.name;
          location = d?.location?.name;
          let long = d?.shifts?.length;
          start_time = moment(d?.shifts?.[0]?.start_time).format('hh:mm a');
          end_time = moment(d?.shifts?.[long - 1]?.end_time).format('hh:mm a')
            ? moment(d?.shifts?.[long - 1]?.end_time).format('hh:mm a')
            : moment(d?.shifts?.[0]?.end_time).format('hh:mm a');

          total_time = `${start_time} - ${end_time}`;
          let sum = 0;
          staffSetup = d?.staff_config?.map((ds, iii) => {
            return (sum += ds?.qty);
          });
          staffSetup = staffSetup + '-staff';
          for (let veh of d?.vehicles || []) {
            vehicles_name = vehicles_name
              ? vehicles_name +
                (veh && veh.name !== undefined ? ', ' + veh.name : '')
              : veh && veh.name !== undefined
              ? veh.name
              : null;
          }
        });
        return {
          id,
          date,
          account,
          location,
          start_time,
          end_time,
          vehicles_name,
          staffSetup,
          total_time,
        };
      });
      if (vehicles?.length) {
        setLinkAbleVehicles(vehicles);
      }
    } catch (err) {
      toast.error(`Error fetching data ${err}`, {
        autoClose: 3000,
      });
    }
  };
  const getLinkedShiftDetails = async (id) => {
    try {
      const response = await makeAuthorizedApiRequest(
        'GET',
        `${BASE_URL}/drives/linkvehicles/${id}`
      );
      const data = await response.json();
      const vehicles = data && data?.data && data?.data?.vehicles;
      const staff = data && data?.data && data?.data?.staff;
      const procedure = data && data?.data && data?.data?.projection;
      const product = data && data?.data && data?.data?.products;
      const sample = shifts;
      if (sample && sample[index]) {
        sample[index].resources = [];
        for (let sam of vehicles) {
          if (sample[index].resources) {
            sample[index].resources.push({
              name: sam && sam?.name,
              id: sam && sam?.id,
            });
          }
        }
        sample[index].projections[0].staffSetup = [];
        for (let sam of staff) {
          if (sample[index]?.projections[0]?.staffSetup) {
            sample[index]?.projections[0]?.staffSetup.push({
              name: sam && sam?.name,
              id: sam && sam?.id,
            });
          }
        }

        sample[index].projections[0].procedure = {};
        sample[index].projections[0].procedure.label =
          procedure?.procedure_type?.name;
        sample[index].projections[0].procedure.procedure_duration =
          procedure?.procedure_type?.procedure_duration;
        sample[index].projections[0].procedure.quantity =
          procedure?.procedure_type_qty;
        sample[index].projections[0].procedure.value = procedure?.id;

        sample[index].projections[0].product = {};
        sample[index].projections[0].product.name = product?.name;
        sample[index].projections[0].product.quantity =
          parseInt(procedure?.product_yield) *
          parseInt(procedure?.procedure_type_qty);
        sample[index].projections[0].product.yield = procedure?.product_yield;
        sample[index].projections[0].product.value = product?.id;

        sample[index].projections[0].projection = {};
        sample[index].projections[0].projection.label =
          procedure?.procedure_type?.name;
        sample[index].projections[0].projection.procedure_duration =
          procedure?.procedure_type?.procedure_duration;
        sample[index].projections[0].projection.value = procedure?.id;

        // sample[index]?.projections[0]?.staffSetup?.push(staff);
      }
      if (shifts && shifts[index]) {
        setShifts((prevShifts) => {
          const newShifts = [...prevShifts];
          newShifts[index].resources = sample[index].resources;
          newShifts[index].projections[0] = sample[index].projections[0];
          return newShifts;
        });
        // shifts[index].resources = sample[index].resources;
        // shifts[index].projections[0].staffSetup =
        //   sample[index].projections[0].staffSetup;
      }
      // console.log({ shift }, 'updated');
      // const vehicles = data?.data?.map((item, index) => {
      //   let date;
      //   let account;
      //   let location;
      //   let start_time;
      //   let end_time;
      //   let vehicles_name = null;
      //   let staffSetup;
      //   let total_time;
      //   let id;
      //   item?.drives?.map((d, i) => {
      //     console.log('bdfibsdifbdjbfijdbfid');
      //     date = d?.date;
      //     id = d?.shifts?.[0].id;
      //     account = d?.account?.name;
      //     location = d?.location?.name;
      //     let long = d?.shifts?.length;
      //     console.log({ long });

      //     start_time = moment(d?.shifts?.[0]?.start_time).format('hh:mm a');
      //     end_time = moment(d?.shifts?.[long - 1]?.end_time).format('hh:mm a')
      //       ? moment(d?.shifts?.[long - 1]?.end_time).format('hh:mm a')
      //       : moment(d?.shifts?.[0]?.end_time).format('hh:mm a');

      //     total_time = `${start_time} - ${end_time}`;
      //     let sum = 0;
      //     staffSetup = d?.staff_config?.map((ds, iii) => {
      //       return (sum += ds?.qty);
      //     });
      //     staffSetup = staffSetup + '-staff';
      //     for (let veh of d?.vehicles || []) {
      //       vehicles_name = vehicles_name
      //         ? vehicles_name +
      //           (veh && veh.name !== undefined ? ', ' + veh.name : '')
      //         : veh && veh.name !== undefined
      //         ? veh.name
      //         : null;
      //     }
      //   });
      //   return {
      //     id,
      //     date,
      //     account,
      //     location,
      //     start_time,
      //     end_time,
      //     vehicles_name,
      //     staffSetup,
      //     total_time,
      //   };
      // });
      // if (vehicles?.length) {
      //   setLinkAbleVehicles(vehicles);
      // }
    } catch (err) {
      toast.error(`Error fetching data ${err}`, {
        autoClose: 3000,
      });
    }
  };
  useEffect(() => {
    if (selectedLinkDrive?.length == 1) {
      getLinkedShiftDetails(selectedLinkDrive[0]);
    }
  }, [selectedLinkDrive]);
  // Fetch OEF Details from Industry Category of Selected account
  const fetchOEFDetails = async () => {
    if (shift.endTime && shift.startTime) {
      const { maximum_oef, minimum_oef } = industryCategories?.[
        account?.value
      ] || { maximum_oef: 0, minimum_oef: 0 };

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
      // console.log({
      //   sumProducts,
      //   sumProcedures,
      //   hours,
      //   minimum_oef,
      //   maximum_oef,
      //   procedureToHourRatio,
      // });
      // console.log({ procedureToHourRatio });
      const minStaffArray = [];
      const maxStaffArray = [];
      shift.projections?.map((item) => {
        minStaffArray.push(
          Math.round(item?.procedure?.quantity / hours / maximum_oef)
        );
        maxStaffArray.push(
          Math.floor(item?.procedure?.quantity / hours / minimum_oef)
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
        return prev?.map((i, j) =>
          j === index
            ? {
                ...i,
                minOEF: minimum_oef,
                maxOEF: maximum_oef,
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
  // console.log({ shift });
  useMemo(
    () => fetchOEFDetails(),
    [account, shift.startTime, shift.endTime, shift.projections, driveDate]
  );

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

  const addProjections = (i) => {
    setShifts((prev) => {
      return prev?.map((shift, index) =>
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

  const addRemoveShiftSetup = (i, j, e) => {
    const currentState = shifts[i]?.projections[j]?.staffSetup;
    if (parseInt(e.qty) < shift.minStaff) {
      setShareStaffModal(true);
      setStaffShareRequired(Math.round(shift.minStaff - parseInt(e.qty)));
    }
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
          : item
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

  const addRemoveResources = (i, e) => {
    const currentState = shifts[i].resources;
    if (currentState.find((item) => item.id === e.id)) {
      const output = shifts?.map((item, index) =>
        i === index
          ? {
              ...item,
              resources: shifts[i].resources.filter((s) => s.id !== e.id),
            }
          : i
      );
      setShifts([...output]);
    } else {
      const output = shifts?.map((item, index) =>
        i === index
          ? {
              ...item,
              resources: [...shifts[i].resources, e],
            }
          : item
      );
      setShifts([...output]);
    }
  };

  const addRemoveDevices = (i, e) => {
    const currentState = shifts[i].devices;
    if (currentState.find((item) => item.id === e.id)) {
      const output = shifts?.map((item, index) =>
        i === index
          ? {
              ...item,
              devices: shifts[i].devices.filter((s) => s.id !== e.id),
            }
          : i
      );
      setShifts([...output]);
    } else {
      const output = shifts?.map((item, index) =>
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

  const selectUnselectAllShiftSetup = (i, j, checked, data) => {
    const output = shifts?.map((item, index) =>
      i === index
        ? {
            ...item,
            projections: shifts[i].projections?.map((x, y) =>
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

  const selectUnselectAllDevices = (i, checked, data) => {
    const output = shifts?.map((item, index) =>
      i === index
        ? {
            ...item,
            devices: checked ? [] : data,
          }
        : i
    );
    setShifts([...output]);
  };

  const selectUnselectAllResources = (i, checked, data) => {
    const output = shifts?.map((item, index) =>
      i === index
        ? {
            ...item,
            resources: checked ? [] : data,
          }
        : i
    );
    setShifts([...output]);
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

  const removeNewShift = (index) => {
    setShifts((prev) => {
      return prev.filter((s, i) => i !== index);
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

  // useEffect(() => {
  //   console.log({ procedureTypesList, shift });
  //   const exitingItems = [];
  //   shift?.projections?.map((pItem) => {
  //     if (pItem?.procedure?.value) exitingItems.push(pItem?.procedure?.value);
  //   });
  //   const newList = procedureTypesList?.filter(
  //     (item) => !exitingItems.includes(item.value)
  //   );
  //   console.log({ exitingItems, newList });
  // }, [shift.projections, procedureTypesList]);

  // const getProjectionOptions = (pIndex) => {
  //   console.log({ procedureTypesList, shift });
  //   const exitingItems = [];
  //   shift?.projections?.map((pItem) => {
  //     if (pItem?.procedure?.value) exitingItems.push(pItem?.procedure?.value);
  //   });
  //   const newList = procedureTypesList?.filter(
  //     (item) => !exitingItems.includes(item.value)
  //   );
  //   setProjectionOptions((prev) => {
  //     return {
  //       ...prev,
  //       pIndex: newList,
  //     };
  //   });
  // };

  // useEffect(() => {
  //   setProjectionOptions({
  //     0: procedureTypesList,
  //   });
  //   console.log({ projectionOptions });
  // }, [procedureTypesList]);

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

  const createDayjsObject = (momentObject, hour, minute) => {
    const year = momentObject.year();
    const month = momentObject.month(); // Note: Moment.js months are zero-indexed
    const day = momentObject.date();
    return dayjs()
      .year(year)
      .month(month)
      .date(day)
      .hour(hour)
      .minute(minute)
      .second(0)
      .millisecond(0);
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
                      const dayJsDate = createDayjsObject(
                        moment(driveDate),
                        e.hour(),
                        e.minute()
                      );
                      setEndTimeDisabled(false);
                      setShifts((prev) => {
                        return prev?.map((i, j) =>
                          j === index ? { ...i, startTime: dayJsDate } : i
                        );
                      });
                      field.onChange(e);
                    }}
                    className="w-100 shift"
                    label="Start Time*"
                  />
                </LocalizationProvider>
              </div>
              {startShiftTimeToolTip != '' && (
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
                      const dayJsDate = createDayjsObject(
                        moment(driveDate),
                        e.hour(),
                        e.minute()
                      );
                      setShifts((prev) => {
                        return prev?.map((i, j) =>
                          j === index ? { ...i, endTime: dayJsDate } : i
                        );
                      });
                      field.onChange(e);
                    }}
                    className="w-100 shift"
                    label="End Time*"
                  />
                </LocalizationProvider>
              </div>
              {endShiftTimeToolTip != '' && (
                <ToolTip text={endShiftTimeToolTip} />
              )}
              {errors?.endTime && (
                <div className="error">
                  <div className="error">
                    <p>{errors?.endTime}</p>
                  </div>
                </div>
              )}
              {shift?.endTime !== '' &&
              shift?.startTime !== '' &&
              shift?.startTime >= shift?.endTime ? (
                <div className="error">
                  <p>End Time should be greater than start time</p>
                </div>
              ) : null}
            </div>
          )}
        />
        {shift?.projections?.map((projection, pIndex) => {
          return (
            <React.Fragment key={'project' + pIndex}>
              <div className="w-100">
                <p className={styles.bold}>Projection*</p>
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
                          if (location_type && collectionOperationId)
                            fetchVehicles(index);
                          setShifts((prev) => {
                            return prev?.map((i, j) =>
                              j === index
                                ? {
                                    ...i,
                                    projections: prev[j].projections?.map(
                                      (x, y) =>
                                        y === pIndex
                                          ? {
                                              ...x,
                                              projection: e,
                                              procedure: { ...e, quantity: 1 },
                                              product:
                                                procedureProducts[e.value],
                                            }
                                          : x
                                    ),
                                  }
                                : i
                            );
                          });
                        } else {
                          setShifts((prev) => {
                            console.log(
                              'prev[index]?.projections',
                              prev[index]?.projections[pIndex]
                            );
                            return prev?.map((i, j) => {
                              console.log(
                                '{j === index}',
                                prev[j]?.projections.length ? 'A' : 'V'
                              );
                              return j === index
                                ? {
                                    ...i,
                                    projections:
                                      prev[j]?.projections &&
                                      prev[j]?.projections?.map((x, y) => {
                                        console.log(
                                          '{y === pIndex}',
                                          { y },
                                          { pIndex }
                                        );
                                        return y === pIndex
                                          ? {
                                              ...x,
                                              projection: {},
                                              procedure: {},
                                              product: {},
                                              staffSetup: [],
                                            }
                                          : x;
                                      }),
                                  }
                                : i;
                            });
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
                {shift.projections[pIndex].projection?.label && (
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
                                return prev?.map((i, j) =>
                                  j === index
                                    ? {
                                        ...i,
                                        projections: prev[j].projections?.map(
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
                        {shift.projections[pIndex].product.name}
                      </span>
                      <Controller
                        name={`shift_projections_product_${pIndex}`}
                        control={control}
                        render={({ field }) => (
                          <FormInput
                            value={shift.projections[pIndex].product.quantity}
                            name={field.name}
                            classes={{ root: '' }}
                            required={false}
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
                                        projections: prev[j].projections?.map(
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
              {isOverrideUser && (
                <Controller
                  name="Staff_setup"
                  control={control}
                  render={({ field }) => {
                    return (
                      <div className="form-field">
                        <div className={`field`}>
                          <GlobalMultiSelect
                            data={
                              // staffSetupShiftOptions?.[index]?.projections?.[
                              //   pIndex
                              // ]?.staffSetupOptions || []
                              [
                                ...(staffSetupShiftOptions?.[
                                  index
                                ]?.projections?.[
                                  pIndex
                                ]?.staffSetupOptions?.filter((item) => {
                                  const exitingItems = [];
                                  shifts?.map((shiftIterateItem) => {
                                    shiftIterateItem?.projections?.map(
                                      (item) => {
                                        item?.staffSetup?.map((ss) => {
                                          exitingItems.push(ss.id);
                                        });
                                      }
                                    );
                                  });
                                  return !exitingItems.includes(item.id);
                                }) || []),
                                ...(staffSetupShiftOptions?.[
                                  index
                                ]?.projections?.[
                                  pIndex
                                ]?.staffSetupOptions?.filter((item) => {
                                  const exitingItems = [];
                                  shift?.projections?.map((item) => {
                                    item?.staffSetup?.map((ss) => {
                                      exitingItems.push(ss.id);
                                    });
                                  });
                                  return exitingItems.includes(item.id);
                                }) || []),
                              ]
                            }
                            selectedOptions={projection.staffSetup}
                            error={''}
                            onChange={(e) => {
                              addRemoveShiftSetup(index, pIndex, e);
                            }}
                            onSelectAll={(e) => {
                              selectUnselectAllShiftSetup(
                                index,
                                pIndex,
                                projection?.staffSetup?.length ===
                                  staffSetupShiftOptions[index]?.projections[
                                    pIndex
                                  ]?.staffSetupOptions.length,
                                staffSetupShiftOptions[index]?.projections[
                                  pIndex
                                ]?.staffSetupOptions || []
                              );
                            }}
                            additionlOptions={
                              staffSetupShiftOptions?.[index]?.projections?.[
                                pIndex
                              ]?.additionalStaffSetups || []
                            }
                            allowAdditionalOptions={
                              staffSetupShiftOptions?.[index]?.projections?.[
                                pIndex
                              ]?.additionalStaffSetups?.length > 0
                                ? true
                                : false
                            }
                            additionlOptionsToggleOnText={'Show All'} // optional, default value: Show All
                            additionlOptionsToggleOffText={'Hide'} // optional, default value: Hide
                            label={'Staff Setup*'}
                            isquantity={false}
                            quantity={0}
                            disabled={false}
                          />
                        </div>
                      </div>
                    );
                  }}
                />
              )}
              {!isOverrideUser && (
                <Controller
                  name="Staff_setup"
                  control={control}
                  render={({ field }) => {
                    return (
                      <div className="form-field">
                        <div className={`field`}>
                          <GlobalMultiSelect
                            data={
                              staffSetupShiftOptions?.[index]?.projections?.[
                                pIndex
                              ]?.staffSetupOptions || []
                            }
                            selectedOptions={projection.staffSetup}
                            error={''}
                            onChange={(e) => {
                              addRemoveShiftSetup(index, pIndex, e);
                            }}
                            onSelectAll={(e) => {
                              selectUnselectAllShiftSetup(
                                index,
                                pIndex,
                                projection?.staffSetup?.length ===
                                  staffSetupShiftOptions[index]?.projections[
                                    pIndex
                                  ]?.staffSetupOptions.length,
                                staffSetupShiftOptions[index]?.projections[
                                  pIndex
                                ]?.staffSetupOptions || []
                              );
                            }}
                            label={'Staff Setup*'}
                            isquantity={false}
                            quantity={0}
                            disabled={false}
                          />
                        </div>
                      </div>
                    );
                  }}
                />
              )}
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
                      ? shift?.minStaff?.[pIndex]
                      : 0}
                    -{' '}
                    {!isNaN(shift?.maxStaff?.[pIndex])
                      ? shift?.maxStaff?.[pIndex]
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
          <p className={styles.bold}>Resources*</p>
        </div>
        <Controller
          name="Vehicle"
          control={control}
          render={({ field }) => {
            return (
              <div className="form-field">
                <div className={`field`}>
                  <GlobalMultiSelect
                    data={shift?.vehicleOptions}
                    linkDrive={shifts?.length == 1 ? true : false}
                    showModel={setVehiclesModel}
                    selectedOptions={shift?.resources}
                    error={''}
                    onChange={(e) => {
                      addRemoveResources(index, e);
                    }}
                    // onClick={setVehiclesModel(true)}
                    onSelectAll={(e) => {
                      selectUnselectAllResources(
                        index,
                        shift?.resources?.length ===
                          shift?.vehicleOptions?.length,
                        shift?.vehicleOptions
                      );
                    }}
                    label={'Vehicles*'}
                    isquantity={false}
                    quantity={0}
                    disabled={false}
                  />
                </div>
              </div>
            );
          }}
        />
        <Controller
          name="Devices"
          control={control}
          render={({ field }) => {
            return (
              <div className="form-field">
                <div className={`field`}>
                  <GlobalMultiSelect
                    data={shiftDevicesOptions}
                    selectedOptions={shift.devices}
                    error={''}
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
                </div>
              </div>
            );
          }}
        />
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
                    return prev?.map((i, j) =>
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
        {shift.staffBreak && (
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
                          const dayJsDate = createDayjsObject(
                            moment(driveDate),
                            e.hour(),
                            e.minute()
                          );
                          setStaffBreakendTimeDisabled(false);
                          setShifts((prev) => {
                            return prev?.map((i, j) =>
                              j === index
                                ? { ...i, breakStartTime: dayJsDate }
                                : i
                            );
                          });
                          field.onChange(e);
                        }}
                        className="w-100 shift"
                        label="Start Time*"
                      />
                    </LocalizationProvider>
                  </div>
                  {formErrors?.[`staff_start_time`] && (
                    <div className="error">
                      <div className="error">
                        <p>{formErrors?.[`staff_start_time`].message}</p>
                      </div>
                    </div>
                  )}
                  {/* {shift?.breakStartTime !== '' &&
                  shift?.breakStartTime >= shift?.breakEndTime ? (
                    <div className="error">
                      <p>Start Time should be less than end time</p>
                    </div>
                  ) : null} */}
                  {shift?.breakStartTime !== '' &&
                  shift?.startTime !== '' &&
                  shift?.startTime >= shift?.breakStartTime ? (
                    <div className="error">
                      <p>
                        Break start Time should be greater than Shift start time
                      </p>
                    </div>
                  ) : null}
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
                          const dayJsDate = createDayjsObject(
                            moment(driveDate),
                            e.hour(),
                            e.minute()
                          );
                          setShifts((prev) => {
                            return prev?.map((i, j) =>
                              j === index
                                ? { ...i, breakEndTime: dayJsDate }
                                : i
                            );
                          });
                          field.onChange(e);
                        }}
                        className="w-100 shift"
                        label="End Time*"
                      />
                    </LocalizationProvider>
                  </div>
                  {formErrors?.[`staff_end_time`] && (
                    <div className="error">
                      <div className="error">
                        <p>{formErrors?.[`staff_end_time`].message}</p>
                      </div>
                    </div>
                  )}
                  {/* {shift?.breakEndTime !== '' &&
                  shift?.breakStartTime !== '' &&
                  shift?.breakStartTime >= shift?.breakEndTime ? (
                    <div className="error">
                      <p>End Time should be greater than start time</p>
                    </div>
                  ) : null} */}
                  {shift?.breakEndTime !== '' &&
                  shift?.endTime !== '' &&
                  shift?.breakEndTime >= shift?.endTime ? (
                    <div className="error">
                      <p>Break end Time should be less than Shift end time</p>
                    </div>
                  ) : null}
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
                        if (e.target.checked) {
                          setShifts((prev) => {
                            return prev?.map((i, j) =>
                              j === index
                                ? {
                                    ...i,
                                    reduction: reductionStep,
                                    reduceSlot: e.target.checked,
                                  }
                                : i
                            );
                          });
                        } else {
                          setShifts((prev) => {
                            return prev?.map((i, j) =>
                              j === index
                                ? {
                                    ...i,
                                    reduction: 0,
                                    reduceSlot: e.target.checked,
                                  }
                                : i
                            );
                          });
                        }
                      }}
                    />
                  )}
                />
              </div>
            </div>
            <div className="form-field">
              <div className="field">
                <span className="app-red">
                  <span></span>
                  Appointment Reduction (
                  {parseFloat(shift?.reduction)?.toFixed(2) < reductionStep
                    ? reductionStep
                    : parseFloat(shift?.reduction)?.toFixed(2)}
                  %)
                </span>
                <input
                  name="staff_Appointment_Reduction"
                  type="range"
                  className="form-range"
                  min="0"
                  max="100"
                  step={reductionStep}
                  id="customRange3"
                  disabled={disableReduction}
                  value={shift.reduction}
                  onChange={(e) => {
                    console.log('e.target.value', e.target.value);
                    setShifts((prev) => {
                      return prev?.map((i, j) =>
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
            onClick={(e) => {
              e.preventDefault();
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
      <ShareStaffModal
        setModal={setShareStaffModal}
        modal={shareStaffModal}
        shift={shift}
        staffShareRequired={staffShareRequired}
        shareStaffData={shareStaffData}
      />
      <LinkVehiclesmodel
        setModal={setVehiclesModel}
        modal={vehiclesModel}
        shift={shift}
        staffShareRequired={0}
        // selectedItems={setSelectedLinkDrive}
        shareStaffData={linkableVehicles}
        selectedLinkDrive={selectedLinkDrive}
        setSelectedLinkDrive={setSelectedLinkDrive}
      />
    </>
  );
};

export default ShiftForm;
