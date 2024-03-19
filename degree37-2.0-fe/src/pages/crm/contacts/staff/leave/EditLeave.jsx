import React from 'react';
import Layout from '../../../../../components/common/layout';
import TopBar from '../../../../../components/common/topbar/index';
import FormInput from '../../../../../components/common/form/FormInput';
import FormText from '../../../../../components/common/form/FormText';
import SelectDropdown from '../../../../../components/common/selectDropdown';
import CancelModalPopUp from '../../../../../components/common/cancelModal';
import SuccessPopUpModal from '../../../../../components/common/successModal';
import ConfirmModal from '../../../../../components/common/confirmModal';
import ConfirmArchiveIcon from '../../../../../assets/images/ConfirmArchiveIcon.png';
import styles from './index.module.scss';
import DatePicker from 'react-datepicker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchData } from '../../../../../helpers/Api';
import { toast } from 'react-toastify';
import { StaffBreadCrumbsData } from '../../../../../components/crm/contacts/staff/StaffBreadCrumbsData';

const schema = yup
  .object({
    begin_date: yup.string().required('Required'),
    end_date: yup.string().required('Required'),
    type: yup.string().required('Required'),
    hours: yup
      .number()
      .min(1)
      .max(999)
      .typeError('Hours must be a number')
      .required('Required'),
    note: yup.string().max(500).required('Required'),
  })
  .required();

export default function EditStaffLeave() {
  const params = useParams();
  const navigate = useNavigate();

  const [showConfirmation, setConfirmation] = React.useState(false);
  const [showCancelModal, setShowCancelModal] = React.useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = React.useState(false);
  const [type, setType] = React.useState(null);
  const [changesMade, setChangesMade] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);

  const {
    watch,
    setError,
    setValue,
    getValues,
    trigger,
    control,
    formState: { errors, isValid },
  } = useForm({
    mode: 'all',
    resolver: yupResolver(schema),
    defaultValues: {
      hours: 0,
    },
  });

  const beginDate = watch('begin_date');
  const endDate = watch('end_date');

  const BreadcrumbsData = [
    ...StaffBreadCrumbsData,
    {
      label: 'View Staff',
      class: 'disable-label',
      link: `/crm/contacts/staff/${params?.staffId}/view`,
    },
    {
      label: 'Leave',
      class: 'disable-label',
      link: `/crm/contacts/staff/${params?.staffId}/view/leave`,
    },
    {
      label: 'Edit Leave',
      class: 'active-label',
      link: `/crm/contacts/staff/${params?.staffId}/view/leave/${params?.id}/edit`,
    },
  ];

  const typeOptions = [
    { label: 'Sick', value: 'SICK' },
    { label: 'Casual', value: 'CASUAL' },
  ];

  React.useEffect(() => {
    fetchData(`/staff-leave/${params?.id}/find`, 'GET')
      .then((res) => {
        const data = res?.data;
        setValue('begin_date', new Date(data.begin_date));
        setValue('end_date', new Date(data.end_date));
        setValue('type', data.type);
        setType(typeOptions.find((obj) => obj.value === data.type) || null);
        setValue('hours', data.hours);
        setValue('note', data.note);
        trigger();
      })
      .catch((err) => {
        console.error(err);
        if (err.status_code === 404) navigate('/not-found');
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id]);

  const handleSave = async (e, redirect = false) => {
    e.preventDefault();
    const data = getValues();

    if (!isValid) {
      await trigger();
      return;
    }

    setLoading(true);
    try {
      const url = `/staff-leave/${params?.id}/edit`;
      const payload = {
        ...data,
        staff_id: params?.staffId,
        begin_date: new Date(data.begin_date).toISOString(),
        end_date: new Date(data.end_date).toISOString(),
      };
      const res = await fetchData(url, 'PUT', payload);
      if (redirect) {
        setShowSuccessMessage(true);
        setTimeout(() => {
          navigate(`/crm/contacts/staff/${params?.staffId}/view/leave`);
        }, 1000);
      } else toast.success(res.response);
    } catch (err) {
      console.error(`APIError ${err.status_code}: ${err.response}`);
      toast.error(err.response, { autoClose: 3000 });
    }
    setLoading(false);
  };

  const handleArchive = async (e) => {
    e.preventDefault();

    setLoading(true);
    const url = `/staff-leave/${params?.id}/archive`;
    await fetchData(url, 'PATCH');
    setConfirmation(false);
    navigate(`/crm/contacts/staff/${params?.staffId}/view/leave`);
    setLoading(false);
  };

  const handleChange = (field, e) => {
    const { name, value } = e.target;
    field.onChange({ target: { name, value } });
    setChangesMade(true);
  };

  const handleCancel = () => {
    if (changesMade) setShowCancelModal(true);
    else navigate(`/crm/contacts/staff/${params?.staffId}/view/leave`);
  };

  return (
    <Layout>
      <TopBar
        className={styles.topBar}
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Leave'}
      />
      <div className="mainContentInner">
        <form>
          <div className={`${styles.container} h-screen`}>
            <div className="formGroup">
              <h5>Edit Leave</h5>

              <div className="d-flex w-100 gap-3">
                <Controller
                  name="begin_date"
                  control={control}
                  render={({ field }) => (
                    <div className="form-field w-100">
                      <div className={styles.fieldDate}>
                        <DatePicker
                          name={field.name}
                          dateFormat="MM/dd/yyyy"
                          className="custom-datepicker form-control"
                          placeholderText="Begin Date"
                          maxDate={endDate}
                          selected={field.value}
                          onChange={(date) => {
                            field.onChange({ target: { value: date } });
                          }}
                        />
                        {field.value && <label>Begin Date</label>}
                      </div>
                      {errors?.begin_date?.message && (
                        <div className="error">
                          <p>{errors?.begin_date?.message}</p>
                        </div>
                      )}
                    </div>
                  )}
                />
                <Controller
                  name="end_date"
                  control={control}
                  render={({ field }) => (
                    <div className="form-field w-100">
                      <div className={styles.fieldDate}>
                        <DatePicker
                          name={field.name}
                          dateFormat="MM/dd/yyyy"
                          className="custom-datepicker form-control"
                          placeholderText="End Date"
                          selected={field.value}
                          minDate={beginDate}
                          onChange={(date) => {
                            field.onChange({ target: { value: date } });
                          }}
                        />
                        {field.value && <label>End Date</label>}
                      </div>
                      {errors?.end_date?.message && (
                        <div className="error">
                          <p>{errors?.end_date?.message}</p>
                        </div>
                      )}
                    </div>
                  )}
                />
              </div>
              <div className="d-flex w-100 gap-3">
                <SelectDropdown
                  placeholder="Type"
                  options={typeOptions}
                  selectedValue={type}
                  onChange={(option) => {
                    setType(option);
                    setValue('type', option?.value || null);
                  }}
                  onBlur={() => setError('type')}
                  error={errors?.type?.message}
                  showLabel
                  removeDivider
                />
                <Controller
                  name="hours"
                  control={control}
                  render={({ field }) => (
                    <FormInput
                      type="number"
                      displayName="Hours"
                      classes={{ root: styles.field }}
                      name={field.name}
                      onChange={(e) => handleChange(field, e)}
                      value={field.value}
                      min={0}
                      required={false}
                      error={errors?.hours?.message}
                      icon={<FontAwesomeIcon icon={faClock} />}
                    />
                  )}
                />
              </div>
              <Controller
                name="note"
                control={control}
                render={({ field }) => (
                  <FormText
                    name={field.name}
                    displayName="Note"
                    classes={{ root: `w-100 ${styles.field}` }}
                    onChange={(e) => handleChange(field, e)}
                    value={field.value}
                    required={false}
                    error={errors?.note?.message}
                  />
                )}
              />
            </div>
          </div>

          <div className="form-footer position-sticky">
            <div className="w-100">
              <button
                type="button"
                className="btn btn-md btn-danger border-0 float-start"
                onClick={() => setConfirmation(true)}
                disabled={isLoading}
              >
                Archive
              </button>

              <button
                type="button"
                className="btn btn-md btn-primary float-end"
                onClick={(e) => handleSave(e)}
                disabled={isLoading}
              >
                Save Changes
              </button>

              <button
                type="button"
                className="btn btn-md btn-secondary float-end"
                onClick={(e) => handleSave(e, true)}
                disabled={isLoading}
              >
                Save & Close
              </button>

              <button
                type="button"
                className="btn btn-md btn-secondary border-0 float-end"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>

      <CancelModalPopUp
        title="Confirmation"
        message={'Unsaved changes will be lost. Do you want to continue?'}
        modalPopUp={showCancelModal}
        setModalPopUp={setShowCancelModal}
        showActionBtns={false}
        isNavigate={true}
        redirectPath={`/crm/contacts/staff/${params?.staffId}/view/leave`}
      />

      <SuccessPopUpModal
        title="Success!"
        message={'Leaves updated.'}
        modalPopUp={showSuccessMessage}
        isNavigate={true}
        redirectPath={`/crm/contacts/staff/${params?.staffId}/view/leave`}
        showActionBtns={true}
        isArchived={false}
        setModalPopUp={setShowSuccessMessage}
      />

      <ConfirmModal
        showConfirmation={showConfirmation}
        onCancel={() => setConfirmation(false)}
        onConfirm={handleArchive}
        icon={ConfirmArchiveIcon}
        heading={'Confirmation'}
        description={'Are you sure you want to archive?'}
      />
    </Layout>
  );
}
