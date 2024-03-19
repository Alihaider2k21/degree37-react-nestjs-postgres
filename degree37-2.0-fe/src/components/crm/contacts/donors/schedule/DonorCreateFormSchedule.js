import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { CRM_DONOR_SCHEDULE_PATH } from '../../../../../routes/path';

import TopBar from '../../../../common/topbar/index';
import FormInput from '../../../../common/form/FormInput';
import SelectDropdown from '../../../../common/selectDropdown';
import SuccessPopUpModal from '../../../../common/successModal';
import FormText from '../../../../common/form/FormText';
import { DonorBreadCrumbsData } from '../../donor/DonorBreadCrumbsData';
import moment from 'moment';

const DonorCreateFormSchedule = () => {
  const bearerToken = localStorage.getItem('token');
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const [donationTypeOption, setDonationTypeOption] = useState([]);
  const [startTimeOption, setStartTimeOption] = useState([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownDisabled, setIsDropDownDisabled] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [dateLoc, setDateLoc] = useState({
    date: '',
    location: '',
  });
  const {
    handleSubmit,
    control,
    getValues,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  });
  const [searchParams] = useSearchParams();
  const { donorId } = useParams();
  const fetchDropdownData = async () => {
    try {
      const result = await fetch(
        `${BASE_URL}/contact-donors/donor-appointments/create-details/${donorId}?id=${searchParams.get(
          'id'
        )}&type=${searchParams.get('type')}`,
        {
          method: 'GET',
          headers: { authorization: `Bearer ${bearerToken}` },
        }
      );
      const data = await result.json();
      if (data?.status === 200) {
        setDonationTypeOption(data?.data?.donationType);
        setDateLoc({
          date: moment(data?.data?.locationDate?.[0]?.date).format(
            'YYYY-MM-DD'
          ),
          location: data?.data?.locationDate?.[0]?.location,
        });
      } else toast.error('Error fetching donation type data.');
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDropdownData();
  }, []);

  const BreadcrumbsData = [
    ...DonorBreadCrumbsData,
    {
      label: 'View Donor',
      class: 'active-label',
      link: `/crm/contacts/donor/${donorId}/view`,
    },
    {
      label: 'Schedule',
      class: 'active-label',
      link: CRM_DONOR_SCHEDULE_PATH.LIST.replace(':donorId', donorId),
    },
    {
      label: 'Create Appointment',
      class: 'active-label',
      link: CRM_DONOR_SCHEDULE_PATH.CREATE_FORM.replace(':donorId', donorId),
    },
  ];
  const submitHandler = async () => {
    try {
      setIsLoading(true);
      const res = await axios.post(
        `${BASE_URL}/contact-donors/appointments`,
        {
          note: getValues('note'),
          slot_id: Number(getValues('appointment_time')?.value),
          procedure_type_id: Number(getValues('donation_type')?.value),
          appointmentable_id: Number(searchParams.get('id')),
          appointmentable_type: searchParams.get('type'),
          donor_id: Number(donorId),
        },
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        }
      );
      setIsLoading(false);

      if (res?.data?.status_code === 201) {
        setShowSuccessMessage(true);
      }
    } catch (error) {
      setIsLoading(false);
      console.log({ error });
      toast.error(error?.response?.data?.message?.[0]);
    }
  };
  const handleCancel = () => {
    if (isDirty) setShowCancelModal(true);
    else navigate(-1);
  };

  const watchFields = watch(['donation_type']);
  useEffect(() => {
    setIsDropDownDisabled(true);
    if (watchFields[0]?.value) {
      setValue('appointment_time', null);
      getStartTime();
    }
  }, [watchFields[0]?.value]);

  const getStartTime = async () => {
    try {
      const result = await fetch(
        `${BASE_URL}/contact-donors/donor-appointments/create-details/start-time/${donorId}?shiftId=${
          watchFields[0]?.value
        }&id=${searchParams.get('id')}&type=${searchParams.get('type')}`,
        {
          method: 'GET',
          headers: { authorization: `Bearer ${bearerToken}` },
        }
      );
      const data = await result.json();
      if (data?.status === 200) {
        setStartTimeOption(
          data?.data?.map((single) => {
            return {
              label: moment(single?.time?.label).format('hh:mm A z'),
              value: single.value,
            };
          })
        );

        setIsDropDownDisabled(false);
      } else toast.error('Error fetching donation type data.');
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Schedule'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />
      <div className="mainContentInner form-container">
        <form>
          <div className="formGroup">
            <h5>Create Appointment</h5>

            <Controller
              name={`name`}
              control={control}
              defaultValue={''}
              render={({ field }) => (
                <FormInput
                  name="date"
                  disabled={true}
                  required={false}
                  displayName="Date"
                  value={dateLoc.date}
                />
              )}
            />
            <Controller
              name={`donation_type`}
              control={control}
              defaultValue={null}
              render={({ field }) => (
                <SelectDropdown
                  placeholder={'Donation Type*'}
                  defaultValue={field.value}
                  selectedValue={field.value}
                  removeDivider
                  options={donationTypeOption}
                  onBlur={field.onBlur}
                  showLabel
                  onChange={(e) => {
                    field.onChange(e);
                    setValue('donation_type', e);
                  }}
                  error={errors?.donation_type?.message}
                />
              )}
            />
            <Controller
              name={`alternate_name`}
              control={control}
              defaultValue={''}
              render={({ field }) => (
                <FormInput
                  name="alternate_name"
                  displayName="Location"
                  value={dateLoc.location}
                  disabled={true}
                  required={false}
                />
              )}
            />

            <Controller
              name={`appointment_time`}
              control={control}
              defaultValue={null}
              render={({ field }) => (
                <SelectDropdown
                  placeholder={'Appointment Time*'}
                  defaultValue={field.value}
                  selectedValue={field.value}
                  removeDivider
                  options={startTimeOption}
                  onBlur={field.onBlur}
                  disabled={isDropdownDisabled}
                  showLabel
                  onChange={(e) => {
                    field.onChange(e);
                    setValue('appointment_time', e);
                  }}
                  error={errors?.appointment_time?.message}
                />
              )}
            />

            <Controller
              name={`note`}
              control={control}
              defaultValue={''}
              render={({ field }) => (
                <FormText
                  name="note"
                  classes={{ root: 'w-100' }}
                  displayName="Note"
                  value={field.value}
                  onChange={(e) => field.onChange(e)}
                  required
                  error={errors?.note?.message}
                  handleBlur={field.onBlur}
                />
              )}
            />
          </div>
        </form>
      </div>
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
          disabled={isLoading}
          className={` ${`btn btn-primary`}`}
          onClick={handleSubmit(submitHandler)}
        >
          Create
        </button>
        <SuccessPopUpModal
          title="Success!"
          message={'Donor appointment created.'}
          modalPopUp={showSuccessMessage}
          isNavigate={true}
          redirectPath={-2}
          showActionBtns={true}
          isArchived={false}
          setModalPopUp={setShowSuccessMessage}
        />
        <SuccessPopUpModal
          title="Confirmation"
          message={'Unsaved changes will be lost. Do you want to continue?'}
          modalPopUp={showCancelModal}
          setModalPopUp={setShowCancelModal}
          showActionBtns={false}
          isArchived={true}
          archived={() => navigate(-2)}
          acceptBtnTitle="Ok"
          rejectBtnTitle="Cancel"
        />
      </div>
    </div>
  );
};

export default DonorCreateFormSchedule;

const schema = yup.object().shape({
  note: yup
    .string()
    .required('Note is required.')
    .min(2, 'Min characters allowed for note are 500')
    .max(500, 'Max characters allowed for note are 500'),
  donation_type: yup
    .object({
      name: yup.string(),
      id: yup.string(),
    })
    .required('Donation type is required.'),

  appointment_time: yup
    .object({
      name: yup.string(),
      id: yup.string(),
    })
    .required('Appointment time is required.'),
});
