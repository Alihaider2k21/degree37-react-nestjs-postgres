import React, { useEffect, useState } from 'react';
import TopBar from '../../../common/topbar/index';
import FormInput from '../../../common/form/FormInput';
import SelectDropdown from '../../../common/selectDropdown';
import FormText from '../../../common/form/FormText';
import { useParams } from 'react-router-dom';
import 'rc-time-picker/assets/index.css';
import * as yup from 'yup';
import styles from './index.module.scss';

import {
  CRM_NON_COLLECTION_PROFILES_BLUEPRINTS_PATH,
  CRM_NON_COLLECTION_PROFILES_PATH,
} from '../../../../routes/path';

import NCPShiftForm from './NCPShiftForm';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import CancelModalPopUp from '../../../common/cancelModal';
import { toast } from 'react-toastify';
import moment from 'moment';
import SuccessPopUpModal from '../../../common/successModal';
import { API } from '../../../../api/api-routes';

const initialShift = {
  generatedId: Math.random().toString(36).substring(2),
  startTime: null,
  endTime: '',
  roles: [{ role: null, qty: null }],
  staffBreak: false,
  breakStartTime: '',
  breakEndTime: '',
  vehicles_ids: [],
  device_ids: [],
  shiftBreakStartTime: null,
  shiftBreakEndTime: null,
  showBreakTime: false,
};
const NonCollectionProfilesCreateBlueprints = () => {
  const [shifts, setShifts] = useState([initialShift]);
  const [closeModal, setCloseModal] = useState(false);
  const [locationOption, setLocationOption] = useState([]);
  const [showModel, setShowModel] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
    defaultValues: {
      shifts: [initialShift],
    },
  });

  const { append, remove } = useFieldArray({
    control,
    name: 'shifts',
  });

  const { id } = useParams();
  useEffect(() => {
    console.log({ errors });
  }, [errors]);
  const BreadcrumbsData = [
    { label: 'CRM', class: 'disable-label', link: '/crm/accounts' },
    {
      label: 'Non-Collection Profiles',
      class: 'active-label',
      link: CRM_NON_COLLECTION_PROFILES_PATH.LIST,
    },
    {
      label: 'View Non-Collection Profiles',
      class: 'active-label',
      link: CRM_NON_COLLECTION_PROFILES_PATH.VIEW.replace(':id', id),
    },
    {
      label: 'Blueprints',
      class: 'active-label',
      link: CRM_NON_COLLECTION_PROFILES_BLUEPRINTS_PATH.LIST.replace(':id', id),
    },
    {
      label: 'Add Blueprint',
      class: 'active-label',
      link: CRM_NON_COLLECTION_PROFILES_BLUEPRINTS_PATH.CREATE.replace(
        ':id',
        id
      ),
    },
  ];
  useEffect(() => {
    fetchLocation();
  }, []);
  const fetchLocation = async () => {
    const token = localStorage.getItem('token');

    try {
      const { data } = await API.nonCollectionProfiles.getCRMLocations(
        id,
        token
      );
      if (data?.data) {
        const locationOptionData = data?.data?.map((item) => {
          return {
            label: `${item?.name} - ${item?.room}`,
            value: item?.id,
          };
        });
        setLocationOption(locationOptionData);
      }
    } catch (e) {
      toast.error(`${e?.message}`, { autoClose: 3000 });
    } finally {
      // setIsLoading(false);
    }
  };
  const onSubmit = async (data) => {
    const shiftScheduleUpdate = data?.shifts.map((item) => {
      return {
        start_time: moment(item?.startTime).format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
        end_time: moment(item?.endTime).format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
        break_start_time: item?.showBreakTime
          ? moment(item?.breakStartTime).format('YYYY-MM-DDTHH:mm:ss.SSSZ')
          : null,
        break_end_time: item?.showBreakTime
          ? moment(item?.breakEndTime).format('YYYY-MM-DDTHH:mm:ss.SSSZ')
          : null,
        vehicles_ids: item?.vehicles_ids?.map((item) => parseInt(item.id, 10)),
        devices_ids: item?.device_ids?.map((item) => parseInt(item.id, 10)),
        shift_roles: item?.roles?.map((item) => ({
          role_id: parseInt(item.role.value, 10),
          qty: parseInt(item.qty, 10),
        })),
      };
    });
    let body = {
      blueprint_name: data?.blueprint_name,
      location_id: +data?.location?.value,
      additional_info: data?.additional_information,
      is_active: true,
      shift_schedule: shiftScheduleUpdate,
    };
    const accessToken = localStorage.getItem('token');
    try {
      setIsSubmitting(true);
      const { data } = await API.nonCollectionProfiles.createBlueprint(
        id,
        accessToken,
        body
      );
      if (data?.status === 'success') {
        setShowModel(true);
      } else if (data?.status === 400) {
        toast.error(`${data?.message?.[0] ?? data?.response}`, {
          autoClose: 3000,
        });
      } else {
        toast.error(`${data?.message?.[0] ?? data?.response}`, {
          autoClose: 3000,
        });
      }
      setTimeout(() => {
        setIsSubmitting(false);
      }, 2000);
    } catch (error) {
      setTimeout(() => {
        setIsSubmitting(false);
      }, 2000);
      // setLoading(false);
      toast.error(`${error?.message}`, { autoClose: 3000 });
    }
  };
  const handleRemoveShift = (index) => {
    if (shifts.length > 1) {
      const updatedShifts = [...shifts];
      updatedShifts.splice(index, 1);
      setShifts(updatedShifts);
    }
  };

  return (
    <div className="mainContent ">
      <SuccessPopUpModal
        title={'Success!'}
        message={'Blueprint created.'}
        modalPopUp={showModel}
        setModalPopUp={setShowModel}
        showActionBtns={true}
        isNavigate={true}
        redirectPath={`/crm/non-collection-profiles/${id}/blueprints`}
      />
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Blueprints'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />
      <div className="mainContentInner form-container">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="formGroup">
            <h5>Add Blueprint</h5>

            <Controller
              name={`blueprint_name`}
              control={control}
              defaultValue={''}
              render={({ field }) => (
                <FormInput
                  name="blueprint_name"
                  displayName="Blueprint Name"
                  value={field.value}
                  onChange={(e) => field.onChange(e)}
                  required
                  error={errors?.blueprint_name?.message}
                  handleBlur={field.onBlur}
                />
              )}
            />
            <Controller
              name={`location`}
              control={control}
              defaultValue={null}
              render={({ field }) => (
                <SelectDropdown
                  placeholder={'Location*'}
                  defaultValue={field.value}
                  selectedValue={field.value}
                  removeDivider
                  options={locationOption}
                  onBlur={field.onBlur}
                  showLabel
                  onChange={(e) => {
                    field.onChange(e);
                    setValue('location', e);
                  }}
                  error={errors?.location?.message}
                />
              )}
            />
            <Controller
              name={`additional_information`}
              control={control}
              defaultValue={''}
              render={({ field }) => (
                <FormText
                  name="additional_information"
                  displayName="Additional Information"
                  classes={{ root: 'w-100' }}
                  required
                  value={field.value}
                  handleBlur={field.onBlur}
                  onChange={(e) => field.onChange(e)}
                  error={errors?.additional_information?.message}
                />
              )}
            />
          </div>
          {shifts?.map((shift, index) => {
            return (
              <NCPShiftForm
                control={control}
                key={shift?.generatedId}
                shift={shift}
                removeShift={() => remove(index)}
                setShift={(updatedShift) => {
                  const updatedShifts = [...shifts];
                  updatedShifts[index] = updatedShift;
                  setShifts(updatedShifts);
                }}
                errors={errors}
                initialShift={initialShift}
                handleRemoveShift={handleRemoveShift}
                append={append}
                setShifts={setShifts}
                currentNumber={index}
                shifts={shifts}
                getValues={getValues}
                setValue={setValue}
              />
            );
          })}
        </form>
      </div>
      <div
        className={`form_footer ${styles.footerNonCollection} d-flex justify-content-end`}
      >
        <CancelModalPopUp
          title="Confirmation"
          message="Unsaved changes will be lost, do you wish to proceed?"
          modalPopUp={closeModal}
          isNavigate={true}
          setModalPopUp={setCloseModal}
          redirectPath={-1}
        />
        <span
          className="text-primary border-0 cursor-pointer cancel"
          onClick={() => {
            setCloseModal(true);
          }}
        >
          Cancel
        </span>
        <button
          type="button"
          disabled={isSubmitting}
          className={`rounded  btn btn-primary`}
          onClick={handleSubmit(onSubmit)}
        >
          Create
        </button>
      </div>
    </div>
  );
};

const schema = yup.object().shape({
  blueprint_name: yup.string().required('Blueprint name is required.'),
  additional_information: yup
    .string()
    .required('Additional Information is required.'),
  location: yup
    .object({
      label: yup.string().required(),
      value: yup.string().required(),
    })
    .required('Location is required.'),
  // location: yup.string().required('Location name is required.'),
  shifts: yup.array().of(
    yup.object().shape({
      startTime: yup.string().required('Start Time is required.'),
      endTime: yup
        .string()
        .when('startTime', (startTime, schema) => {
          return schema.test(
            'is-greater',
            'End Time must be greater than Start Time',
            function (endTime) {
              if (!startTime || !endTime) {
                return true;
              }
              const startTimeDate = new Date(`${startTime}`);
              const endTimeDate = new Date(`${endTime}`);
              const momentStartTime = moment(startTimeDate).format('HH:mm');
              const momentEndTime = moment(endTimeDate).format('HH:mm');
              const [hour1, minute1] = momentStartTime.split(':').map(Number);
              const [hour2, minute2] = momentEndTime.split(':').map(Number);
              if (hour1 < hour2) {
                return true;
              } else if (hour1 === hour2 && minute1 < minute2) {
                return true;
              }

              return false;
            }
          );
        })
        .required('End Time is required.'),
      roles: yup.array().of(
        yup.object().shape({
          role: yup
            .object({
              label: yup.string().required(),
              value: yup.string().required(),
            })
            .required('Role is required.'),
          qty: yup
            .number()
            .typeError('Quantity must be a number.')
            .required('Quantity is required.')
            .min(1, 'Quantity must be at least 1.'),
        })
      ),
      staffBreak: yup.boolean(),
      breakStartTime: yup.string().when('showBreakTime', {
        is: true,
        then: () => yup.string().required('Start Time is required.'),
      }),
      breakEndTime: yup.string().when('showBreakTime', {
        is: true,
        then: () =>
          yup
            .string()
            .when('breakStartTime', (breakStartTime, schema) => {
              return schema.test(
                'is-greater',
                'End Time must be greater than Start Time',
                function (breakEndTime) {
                  if (!breakStartTime || !breakEndTime) {
                    return true; // Let other validators handle empty values
                  }
                  const startTimeDate = new Date(`${breakStartTime}`);
                  const endTimeDate = new Date(`${breakEndTime}`);
                  const momentStartTime = moment(startTimeDate).format('HH:mm');
                  const momentEndTime = moment(endTimeDate).format('HH:mm');
                  const [hour1, minute1] = momentStartTime
                    .split(':')
                    .map(Number);
                  const [hour2, minute2] = momentEndTime.split(':').map(Number);
                  if (hour1 < hour2) {
                    return true;
                  } else if (hour1 === hour2 && minute1 < minute2) {
                    return true;
                  }

                  return false;
                }
              );
            })
            .required('End Time is required.'),
      }),
      vehicles_ids: yup
        .array()
        .of(
          yup.object({
            id: yup.string().required('Vehicle Setup is required.'),
            name: yup.string().required('Vehicle Setup is required.'),
          })
        )
        .min(1, 'Vehicle Setup is required.')
        .required('Vehicle Setup is required.'),
      device_ids: yup
        .array()
        .of(
          yup.object({
            name: yup.string().required('Device Setup is required.'),
            id: yup.string().required('Device Setup is required.'),
          })
        )
        .min(1, 'Device Setup is required.')
        .required('Device Setup is required.'),
      // showBreakTime: yup.boolean(),
    })
  ),
});
export default NonCollectionProfilesCreateBlueprints;
