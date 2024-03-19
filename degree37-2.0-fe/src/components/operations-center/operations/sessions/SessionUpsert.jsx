import React, { useEffect, useState } from 'react';
import TopBar from '../../../common/topbar/index';
import styles from '../drives/index.module.scss';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import sessionSchema from './sessionSchema';
import SessionForm from './upsert/SessionForm';
import { API } from '../../../../api/api-routes';
import ScheduleShiftForm from './upsert/ScheduleShiftForm';
import SelectSessionForm from './upsert/SelectSessionForm';
import CustomFieldsForm from '../../../common/customeFileds/customeFieldsForm';
import { useNavigate } from 'react-router-dom';
import { OPERATIONS_CENTER_SESSIONS_PATH } from '../../../../routes/path';
import CancelModalPopUp from '../../../common/cancelModal';
import SuccessPopUpModal from '../../../common/successModal';

function SessionUpsert() {
  const navigate = useNavigate();
  const [formValue, setFormValue] = useState('clean_slate');
  const [donorCenters, setDonorCenters] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [collectionOperation, setCollectionOperation] = useState(null);
  const [status, setStatus] = useState([]);
  const [customFileds, setCustomFields] = useState();
  const [success, setSuccess] = useState(false);
  const [cancel, setCancel] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [shiftIndexes, setShiftIndexes] = useState([0]);
  const [shiftCounter, setShiftCounter] = React.useState(1);
  const [procedureTypes, setProcedureTypes] = React.useState([]);
  const [devices, setDevices] = React.useState([]);
  const [bookingRules, setBookingRules] = React.useState([]);
  const [customErrors, setCustomErrors] = React.useState({});
  const [OEF, setOEF] = useState({
    minOEF: 0,
    maxOEF: 0,
  });

  const {
    control,
    formState: { isDirty, errors: formErrors },
    handleSubmit,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(sessionSchema(customFileds)),
    defaultValues: {
      donor_center: null,
      promotions: [],
      collection_operation: null,
      status: null,
      slots: {},
      shifts: [
        {
          start_time: null,
          end_time: undefined,
          staff_break: false,
          break_start_time: undefined,
          break_end_time: undefined,
          oef_product: 0,
          reduce_slots: false,
          projections: [
            {
              procedure: null,
              procedure_type_qty: 1,
              staff_setup: null,
            },
          ],
          appointment_reduction: 0,
          devices: [],
        },
      ],
    },
    mode: 'all',
  });
  const watchDonorCenter = watch('donor_center');
  const watchSessionDate = watch('session_date');
  const watchPromotions = watch('promotions');
  const watchSlots = watch('slots');

  const breadcrumbsData = [
    { label: 'Operations Center', class: 'disable-label', link: '/' },
    {
      label: 'Operations',
      class: 'disable-label',
      link: '#',
    },
    {
      label: 'Sessions',
      class: 'disable-label',
      link: OPERATIONS_CENTER_SESSIONS_PATH.LIST,
    },
    {
      label: 'Create Session',
      class: 'disable-label',
      link: OPERATIONS_CENTER_SESSIONS_PATH.CREATE,
    },
  ];

  useEffect(() => {
    const donorCenter =
      watchDonorCenter &&
      donorCenters.find((dc) => dc.id === watchDonorCenter.value);

    if (donorCenter) {
      setOEF({
        minOEF: donorCenter.industry_category.minimum_oef,
        maxOEF: donorCenter.industry_category.maximum_oef,
      });
      setCollectionOperation({
        id: donorCenter.collection_operation?.id,
        name: donorCenter.collection_operation?.name,
      });
    } else setCollectionOperation(null);
  }, [donorCenters, watchDonorCenter]);

  useEffect(() => {
    const fetchDonorCenters = async () => {
      const { data } =
        await API.systemConfiguration.organizationalAdministrations.facilities.getDonorCenters();
      setDonorCenters(data?.data || []);
    };

    const fetchStatus = async () => {
      const { data } =
        await API.systemConfiguration.operationAdministrations.bookingDrives.operationStatus.getOperationStatus();
      setStatus(data?.data || []);
    };

    const fetchCustomFields = async () => {
      try {
        const { data } =
          await API.systemConfiguration.organizationalAdministrations.customFields.getModuleCustomFields(
            7
          );
        if (data?.status === 200) setCustomFields(data?.data || []);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchProcedureTypes = async () => {
      const { data } =
        await API.systemConfiguration.organizationalAdministrations.procedureTypes.list(
          {
            fetchAll: 'true',
            status: 'true',
            goal_type: 'true',
          }
        );
      setProcedureTypes(data?.data || []);
    };

    const fetchBookingRules = async () => {
      const { data } =
        await API.systemConfiguration.operationAdministrations.bookingDrives.bookingRules.getBookingRules();
      setBookingRules(data?.data || {});
    };

    fetchProcedureTypes();
    fetchDonorCenters();
    fetchStatus();
    fetchCustomFields();
    fetchBookingRules();
  }, []);

  useEffect(() => {
    const fetchPromotions = async () => {
      if (!collectionOperation || !watchSessionDate) return;
      const { data } =
        await API.systemConfiguration.operationAdministrations.marketingEquipment.promotions.getPromotionsForOperationAdministration(
          {
            collectionOperationId: collectionOperation.id,
            date: watchSessionDate.toISOString(),
            status: 'true',
          }
        );
      setPromotions(
        data?.data?.map((promo) => ({ id: promo?.id, name: promo?.name })) || []
      );
    };

    const fetchDevices = async () => {
      const { data } =
        await API.systemConfiguration.organizationalAdministrations.devices.getDriveDevices(
          {
            collection_operation: collectionOperation.id,
          }
        );
      setDevices(data?.data || []);
    };

    if (collectionOperation) {
      fetchDevices();
      fetchPromotions();
      setValue('collection_operation', collectionOperation);
    } else {
      setDevices([]);
      setPromotions([]);
      setValue('collection_operation', '');
    }
  }, [collectionOperation, watchSessionDate, setValue]);

  const handleCancel = async () => {
    if (!isDirty) navigate(OPERATIONS_CENTER_SESSIONS_PATH.LIST);
    setCancel(true);
  };

  const handleCustomFields = async (formData) => {
    const fields = [];
    for (const key in formData) {
      if (key > 0) {
        const value = formData[key]?.value ?? formData[key];
        fields.push({
          field_id: parseInt(key),
          field_data:
            typeof value === 'object' && !Array.isArray(value)
              ? new Date(value).toISOString()
              : value?.toString(),
        });
      }
    }
    return { fields_data: fields, custom_field_datable_type: 'sessions' };
  };

  const validateCustomErrors = () =>
    Object.values(customErrors).every((error) => error === '');

  const onSubmit = async (formData) => {
    if (!validateCustomErrors()) return;
    const customFieldsData = await handleCustomFields(formData);
    formData = { ...formData, custom_fields: customFieldsData };

    setLoading(true);
    try {
      console.log({ formData });
      // await API.operationCenter.sessions.create({
      //   date: new Date(formData?.session_date).toISOString(),
      //   promotion_ids: formData?.promotions?.map((promo) => parseInt(promo.id)),
      //   donor_center_id: parseInt(formData?.donor_center?.value),
      //   status_id: parseInt(formData?.status?.value),
      //   collection_operation_id: parseInt(formData?.collection_operation?.id),
      //   custom_fields: formData?.custom_fields,
      // });
      // setSuccess(true);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const addShift = () => {
    setShiftIndexes((prevShifts) => [...prevShifts, shiftCounter]);
    setShiftCounter((prevCounter) => prevCounter + 1);
  };

  const removeShift = (index) => () => {
    setShiftIndexes((prevShifts) => [
      ...prevShifts.filter((item) => item !== index),
    ]);
  };

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={breadcrumbsData}
        BreadCrumbsTitle={'Sessions'}
        SearchValue={null}
        SearchOnChange={null}
        SearchPlaceholder={null}
      />
      <div
        className="mainContentInner mt-4"
        style={{ border: '1px solid #F5F5F5' }}
      >
        <form className={styles.account} style={{ marginBottom: '150px' }}>
          <SelectSessionForm
            control={control}
            formValue={formValue}
            setFormValue={setFormValue}
          />

          <SessionForm
            control={control}
            formErrors={formErrors}
            donorCenterOptions={donorCenters?.map((dc) => ({
              label: dc.name,
              value: dc.id,
            }))}
            donorCenters={donorCenters}
            watch={watch}
            statusOptions={status?.map((status) => ({
              label: status.name,
              value: status.id,
            }))}
            promotions={promotions}
            selectedPromotions={watchPromotions}
            collectionOperation={collectionOperation}
            sessionDate={watchSessionDate}
            setValue={setValue}
          />

          {customFileds ? (
            <CustomFieldsForm
              control={control}
              formErrors={formErrors}
              customFileds={customFileds}
            />
          ) : null}

          {shiftIndexes.map((id, index) => {
            const fieldName = `shifts[${index}]`;
            return (
              <div className="form-container" key={fieldName}>
                <fieldset name={fieldName}>
                  <ScheduleShiftForm
                    shiftId={id}
                    shiftIndex={index}
                    control={control}
                    watch={watch}
                    setValue={setValue}
                    addShift={addShift}
                    removeShift={removeShift}
                    shiftIndexesLength={shiftIndexes?.length || 0}
                    formErrors={formErrors}
                    shiftFieldName={fieldName}
                    procedureTypes={procedureTypes}
                    procedureTypesOptions={procedureTypes.map((type) => ({
                      label: type.name,
                      value: type.id,
                      ...type,
                    }))}
                    OEF={OEF}
                    devicesOptions={devices.map((device) => ({
                      id: device.id,
                      name: device.name,
                    }))}
                    allowAppointmentAtShiftEndTime={
                      bookingRules?.maximum_draw_hours_allow_appt || false
                    }
                    customErrors={customErrors}
                    setCustomErrors={setCustomErrors}
                    slots={watchSlots}
                  />
                </fieldset>
              </div>
            );
          })}
        </form>

        <div className="form-footer">
          <button
            className="btn btn-secondary border-0"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            className={`btn btn-primary`}
            disabled={isLoading}
          >
            Create
          </button>
        </div>
      </div>

      <CancelModalPopUp
        title="Confirmation"
        message="Unsaved changes will be lost, do you wish to proceed?"
        modalPopUp={cancel}
        isNavigate={true}
        setModalPopUp={setCancel}
        redirectPath={OPERATIONS_CENTER_SESSIONS_PATH.LIST}
      />
      <SuccessPopUpModal
        title="Success!"
        message="Session created."
        modalPopUp={success}
        isNavigate={true}
        setModalPopUp={setSuccess}
        showActionBtns={true}
        redirectPath={OPERATIONS_CENTER_SESSIONS_PATH.LIST}
      />
    </div>
  );
}

export default SessionUpsert;
