import React, { useEffect, useState } from 'react';
import ShiftForm from './components/shiftForm';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import TopBar from '../../../../common/topbar/index';
import FormInput from '../../../../common/form/FormInput';
import bluePrintSchema from './bluePrintSchema';
import BluePrintButton from './components/bluePrintDayButton';
import { makeAuthorizedApiRequest } from '../../../../../helpers/Api';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import moment from 'moment';
import CancelModalPopUp from '../../../../common/cancelModal';
import SuccessPopUpModal from '../../../../common/successModal';
import { isEmpty } from 'lodash';
import { API } from '../../../../../api/api-routes';

function CreateDonorBluePrint() {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [disable, setDisabled] = useState(false);
  const { id } = useParams();
  const [weekdays, setWeekdays] = useState({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  });
  const [procedureOptions, setProcedureOptions] = useState([]);
  const [procedureProducts, setProcedureProducts] = useState({});
  const [devicesOptions, setDevicesOptions] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [minimumOef, setMinimumOef] = useState(0);
  const [maximumOef, setMaximumOef] = useState(0);
  const [shiftSlots, setShiftSlots] = useState([]);
  const [closeModal, setCloseModal] = useState(false);
  const [createLocationModal, setCreateLocationModal] = useState(false);
  const [staffSetupShiftOptions, setStaffSetupShiftOptions] = useState([]);
  const [customErrors, setCustomErrors] = useState({});
  const [collectionOperationId, setCollectionOperationId] = useState(null);
  const [bookingRules, setBookingRules] = useState({});

  const [shifts, setShifts] = useState([
    {
      startTime: '',
      endTime: '',
      projections: [
        {
          projection: 0,
          procedure: '25',
          product: '25',
          staffSetup: [],
        },
      ],
      staffSetupOptions: [],
      additionalStaffOptions: [],
      vehicleOptions: [],
      resources: [],
      devices: [],
      staffBreak: false,
      breakStartTime: '',
      breakEndTime: '',
      reduceSlot: false,
      reduction: 0,
      minOEF: 0,
      maxOEF: 0,
      minStaff: [0],
      maxStaff: [0],
    },
  ]);
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };
  const getDevices = async () => {
    const bearerToken = localStorage.getItem('token');
    try {
      const result = await fetch(
        `${BASE_URL}/devices/drives?collection_operation=${collectionOperationId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${bearerToken}`,
          },
        }
      );
      const data = await result.json();
      setDevicesOptions(convertToOptionsArray(data?.data, 'id'));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  function convertToOptionsArray(data, type) {
    if (!data) {
      return [];
    }
    if (type == 'id') {
      return data?.map((item) => ({
        name: item.name, // Assuming 'name' is the property you want to use as the label
        id: item.id, // Assuming 'id' is the property you want to use as the value
      }));
    }
    if (type == 'name') {
      return data?.map((item) => ({
        name: item.name, // Assuming 'name' is the property you want to use as the label
        value: item.id, // Assuming 'id' is the property you want to use as the value
      }));
    }
    return data?.map((item) => ({
      label: item.name, // Assuming 'name' is the property you want to use as the label
      value: item.id, // Assuming 'id' is the property you want to use as the value
    }));
  }
  const fetchProcedureTypes = async () => {
    try {
      const response = await makeAuthorizedApiRequest(
        'GET',
        `${BASE_URL}/procedure_types?goal_type=true&fetchAll=true`
      );
      const { data } = await response.json();

      const procedureOptions = data?.map((item) => {
        return {
          label: item.name,
          value: item.id,
          procedure_duration: item.procedure_duration,
        };
      });
      const productsMap = {};
      data?.map((item) => {
        productsMap[item.id] = {
          name: item?.procedure_types_products?.[0]?.products?.name,
          id: item?.procedure_types_products?.[0]?.products?.id,
          quantity: item?.procedure_types_products?.[0]?.quantity,
          yield: item?.procedure_types_products?.[0]?.quantity,
        };
      });

      setProcedureOptions(procedureOptions);
      setProcedureProducts(productsMap);
    } catch (error) {
      console.error(`Failed to fetch Locations data ${error}`, {
        autoClose: 3000,
      });
    }
  };

  const onSubmit = async (data) => {
    if (!Object.values(weekdays)?.filter((item) => item === true).length) {
      setCustomErrors((prev) => ({
        ...prev,
        weekdays: 'At least one day is required.',
      }));
      return;
    }

    let shiftErrors = [];
    let projection = [];
    // let shifts = [];
    const ShiftsBody = shifts?.map((item, index) => {
      setDisabled(true);
      console.log('itemsssss ', item);
      let shiftItemErrors = {};
      if (isEmpty(item?.startTime))
        shiftItemErrors['startTime'] = 'Start time is required.';
      if (isEmpty(item?.endTime))
        shiftItemErrors['endTime'] = 'End time is required.';
      if (
        !isEmpty(item?.startTime) &&
        !isEmpty(item?.endTime) &&
        item?.startTime > item?.endTime
      )
        shiftItemErrors['endTime'] =
          'End Time should be greater than start time';
      if (item?.staffBreak) {
        if (isEmpty(item?.breakEndTime))
          shiftItemErrors['breakEndTime'] = 'End time is required.';
        if (isEmpty(item?.breakStartTime))
          shiftItemErrors['breakStartTime'] = 'Start time is required.';
        if (
          !isEmpty(item?.breakStartTime) &&
          !isEmpty(item?.breakEndTime) &&
          item?.breakStartTime > item?.breakEndTime
        )
          shiftItemErrors['breakEndTime'] =
            'End Time should be greater than start time';
        if (
          item?.breakStartTime !== '' &&
          item?.startTime !== '' &&
          item?.startTime >= item?.breakStartTime
        ) {
          shiftItemErrors['breakStartTime'] =
            'Break start Time should be greater than Shift start time';
        }
        if (
          item?.breakEndTime !== '' &&
          item?.endTime !== '' &&
          item?.breakEndTime >= item?.endTime
        ) {
          shiftItemErrors['breakEndTime'] =
            'Break end Time should be less than Shift end time';
        }
      }
      if (item?.devices.length == 0)
        shiftItemErrors['devices'] = 'At least one device is required.';
      let projectionErrors = [];
      item?.projections?.forEach((element) => {
        let projItemErrors = {};
        if (element.projection == 0) {
          projItemErrors['projection'] = 'Projection is required.';
        }
        if (element.staffSetup.length == 0) {
          projItemErrors['staff_setup'] =
            'At least one Staff setup is required.';
        }
        if (Object.entries(projItemErrors)?.length)
          projectionErrors.push(projItemErrors);
      });
      // console.log(
      //   '{Object.entries(projectionErrors)?.length}',
      //   Object.entries(projectionErrors)?.length
      // );
      // console.log({ shifts });
      if (Object.entries(projectionErrors)?.length) {
        let errorArrays = [];
        for (let sh of shifts) {
          if (sh.projections.length) {
            errorArrays = sh.projections.map((projections) => {
              if (projections.projection) {
                return {};
              } else
                return {
                  projection: 'Projection is required.',
                  staff_setup: 'At least one Staff setup is required.',
                };
            });
          }
        }
        shiftItemErrors['projections'] = errorArrays;
        shiftErrors.push(shiftItemErrors);
      }

      // let procedure_type_id;
      // let procedure_type_qty;
      // let product_yield;
      // let staff_setups = [];
      // const start_time = [];

      // const slots = [];
      // item.projections.map((pro, indexing) => {
      //   procedure_type_id = +pro?.procedure?.value;
      //   procedure_type_qty = +pro?.procedure?.quantity;
      // });
      // item.projections.map((pro, indexing) => {
      //   product_yield = +pro?.product?.quantity;
      // });
      // item?.projections?.map((pro) => {
      //   pro?.staffSetup?.map((staff) => {
      //     staff_setups.push(staff.id);
      //   });
      // });
      let projectionData = [];
      for (const shiftProjectionsStaffItem of item.projections) {
        const staffSetupItem = shiftProjectionsStaffItem?.staffSetup?.map(
          (item) => {
            return parseInt(item.id);
          }
        );
        projectionData.push({
          procedure_type_id: shiftProjectionsStaffItem.procedure.value,
          procedure_type_qty: shiftProjectionsStaffItem.procedure.quantity,
          product_yield: shiftProjectionsStaffItem.product.quantity,
          staff_setups: staffSetupItem,
        });
      }
      projection = projectionData;

      const momentStart = moment(
        new Date(item?.startTime).toLocaleString('en-US', options)
      );
      const momentEnd = moment(
        new Date(item?.endTime).toLocaleString('en-US', options)
      );
      let count_products = 0;
      let count_procedures = 0;
      const duration =
        item?.endTime && item?.startTime
          ? moment.duration(item?.endTime.diff(item?.startTime))
          : 0;
      const hour = duration != 0 ? duration?.hours() : 0;
      let sumofProducts = 0;
      let sumofProcedures = 0;
      let sumofStaff_Setups = 0;
      item?.projections?.map((pro, indexing) => {
        sumofProducts += pro?.product?.quantity;
        sumofProcedures += +pro?.procedure?.quantity;
      });
      item?.projections.map((pro, indexing) => {
        let sumStaff = 0;
        pro?.staffSetup?.map((staff) => {
          sumStaff += +staff?.qty;
        });
        sumofStaff_Setups += sumStaff;
      });
      count_products = (sumofProducts / hour / sumofStaff_Setups).toFixed(2);
      count_procedures = (sumofProcedures / hour / sumofStaff_Setups).toFixed(
        2
      );

      const devices = item?.devices?.map((item) => parseInt(item.id));

      return {
        projections: projection,
        start_time: momentStart,
        end_time: momentEnd,
        break_start_time: moment(
          new Date(item?.breakStartTime).toLocaleString('en-US', options)
        ),
        break_end_time: moment(
          new Date(item?.breakEndTime).toLocaleString('en-US', options)
        ),
        reduce_slots: item?.reduction !== 0 ? true : false,
        reduction_percentage: item?.reduction,
        oef_products: +count_products,
        oef_procedures: +count_procedures,
        devices,
      };

      // return shifts;
    });

    if (shiftErrors.length) {
      setCustomErrors((prev) => ({
        ...prev,
        shifts: shiftErrors,
      }));
      return;
    }
    const body = {
      name: data?.name,
      weekdays: weekdays,
      oef_products: ShiftsBody[0]?.oef_products ?? 0,
      oef_procedures: ShiftsBody[0]?.oef_procedures ?? 0,
      shifts: ShiftsBody,
      donorcenter_id: id,
      // devices: devices,
      slots: Object.values(shiftSlots),
    };

    try {
      // if (!duplicateChecked) {
      // SetDuplicateChecked(true);
      const response = await makeAuthorizedApiRequest(
        'POST',
        `${BASE_URL}/facility/donor-center/bluePrints/create`,
        JSON.stringify(body)
      );
      let data = await response.json();

      if (data.status == 'success') {
        setCreateLocationModal(true);
        setDisabled(false);
      }
      // }
    } catch (error) {
      toast.error(`${data?.response}`, { autoClose: 3000 });
      setDisabled(false);
    }
  };

  const {
    handleSubmit,
    control,
    formState: { errors /*isDirty*/ },
    // setValue,
    // getValues,
    // watch,
  } = useForm({
    resolver: yupResolver(bluePrintSchema),
    defaultValues: {},
    mode: 'onChange',
  });

  const BreadcrumbsData = [
    {
      label: 'CRM',
      class: 'disable-label',
      link: '/crm/accounts',
    },
    {
      label: 'Donors Centers',
      class: 'disable-label',
      link: '/crm/donor_center',
    },
    {
      label: 'View Donors Centers',
      class: 'disable-label',
      link: `/crm/donor_center/${id}`,
    },
    {
      label: 'Blueprints',
      class: 'active-label',
      link: `/crm/donor-centers/${id}/blueprints`,
    },
    {
      label: 'Create Blueprint',
      class: 'active-label',
      link: '#',
    },
  ];

  const fetchBookingRules = async () => {
    const { data } =
      await API.systemConfiguration.operationAdministrations.bookingDrives.bookingRules.getBookingRules();
    setBookingRules(data?.data || {});
  };

  useEffect(() => {
    fetchFacility();
    fetchBookingRules();
  }, []);

  const fetchFacility = async () => {
    try {
      const response =
        await API.systemConfiguration.organizationalAdministrations.facilities.getSingle(
          id
        );
      const { data } = response;
      setCollectionOperationId(data?.[0]?.collection_operation?.id);
      setMaximumOef(data?.[0]?.industry_category?.maximum_oef);
      setMinimumOef(data?.[0]?.industry_category?.minimum_oef);
    } catch (err) {
      toast.error(err);
    }
  };

  useEffect(() => {
    if (collectionOperationId) getDevices();
  }, [collectionOperationId]);

  const handleDayClick = (day) => {
    setWeekdays((prevWeekdays) => ({
      ...prevWeekdays,
      [day]: !prevWeekdays[day],
    }));
    setCustomErrors((prev) => ({
      ...prev,
      weekdays: '',
    }));
  };

  useEffect(() => {
    fetchProcedureTypes();
    setFormErrors({}); // to remove
  }, []);

  return (
    <div className="mainContent">
      <CancelModalPopUp
        title="Confirmation"
        message="Unsaved changes will be lost, do you wish to proceed?"
        modalPopUp={closeModal}
        isNavigate={true}
        setModalPopUp={setCloseModal}
        redirectPath={`/crm/donor-centers/${id}/blueprints`}
      />
      <SuccessPopUpModal
        title="Success!"
        message={'Blueprint created.'}
        modalPopUp={createLocationModal}
        isNavigate={true}
        setModalPopUp={setCreateLocationModal}
        showActionBtns={true}
        redirectPath={`/crm/donor-centers/${id}/blueprints`}
      />
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Blueprints'}
        SearchValue={null}
        SearchOnChange={null}
        SearchPlaceholder={null}
      />
      <div className="mainContentInner form-container">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="formGroup ">
            <h5>Create Blueprint</h5>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <FormInput
                  name={field.name}
                  classes={{ root: '' }}
                  displayName="Blueprint Name"
                  onChange={(e) => {
                    field.onChange(e);
                  }}
                  value={field?.value}
                  required={false}
                  error={errors?.name?.message}
                />
              )}
            />
            <div className="form-field">
              <p
                className="w-100 mb-0"
                style={{ fontSize: '14px', color: '#858688' }}
              >
                Select Weekdays*
              </p>
              <div className="form-field w-100">
                <BluePrintButton
                  onClick={handleDayClick}
                  label={'M'}
                  name={'monday'}
                  weekdays={weekdays}
                />
                <BluePrintButton
                  onClick={handleDayClick}
                  label={'T'}
                  name={'tuesday'}
                  weekdays={weekdays}
                />
                <BluePrintButton
                  onClick={handleDayClick}
                  label={'W'}
                  name={'wednesday'}
                  weekdays={weekdays}
                />
                <BluePrintButton
                  onClick={handleDayClick}
                  label={'T'}
                  name={'thursday'}
                  weekdays={weekdays}
                />
                <BluePrintButton
                  onClick={handleDayClick}
                  label={'F'}
                  name={'friday'}
                  weekdays={weekdays}
                />
                <BluePrintButton
                  onClick={handleDayClick}
                  label={'S'}
                  name={'saturday'}
                  weekdays={weekdays}
                />
                <BluePrintButton
                  onClick={handleDayClick}
                  label={'S'}
                  name={'sunday'}
                  weekdays={weekdays}
                />
                <div className="error">
                  <p>{customErrors?.weekdays}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="">
            {shifts?.map((shift, index) => {
              return (
                <ShiftForm
                  key={index + 1}
                  shift={shift}
                  index={index}
                  errors={customErrors?.shifts?.[index]}
                  control={control}
                  setShifts={setShifts}
                  shifts={shifts}
                  formErrors={formErrors}
                  shiftDevicesOptions={devicesOptions}
                  procedureProducts={procedureProducts}
                  procedureTypesList={procedureOptions}
                  maximumOef={maximumOef}
                  minimumOef={minimumOef}
                  shiftSlots={shiftSlots}
                  setShiftSlots={setShiftSlots}
                  staffSetupShiftOptions={staffSetupShiftOptions}
                  setStaffSetupShiftOptions={setStaffSetupShiftOptions}
                  allowAppointmentAtShiftEndTime={
                    bookingRules?.maximum_draw_hours_allow_appt || false
                  }
                />
              );
            })}
          </div>
          <div className={`form-footer`}>
            <div className="d-flex">
              <button
                className="btn btn-secondary border-0"
                onClick={() => {
                  setCloseModal(true);
                }}
                disabled={disable}
              >
                Cancel
              </button>

              <button
                type="submit"
                className={` ${`btn btn-primary`}`}
                disabled={disable}
                // onClick={(e) => handleSubmit(e)}
              >
                Create
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateDonorBluePrint;
