import React, { useState } from 'react';
import FormInput from '../../common/form/FormInput';
import TopBar from '../../common/topbar/index';
import FormToggle from '../../common/form/FormToggle';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import SuccessPopUpModal from '../../common/successModal';
import { useNavigate } from 'react-router-dom';
import { OPERATIONS_CENTER, OS_PROSPECTS_PATH } from '../../../routes/path';
import FormText from '../../common/form/FormText';
import FormFooter from '../../common/FormFooter';

const ProspectsCreate = () => {
  const navigate = useNavigate();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const {
    handleSubmit,
    control,
    getValues,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  });

  const BreadcrumbsData = [
    {
      label: 'Operations Center',
      class: 'disable-label',
      link: OPERATIONS_CENTER.DASHBOARD,
    },
    {
      label: 'Prospect',
      class: 'active-label',
      link: OS_PROSPECTS_PATH.CREATE,
    },
    {
      label: 'Create Prospect',
      class: 'active-label',
      link: OS_PROSPECTS_PATH.CREATE,
    },
  ];

  const submitHandler = async () => {
    try {
      setIsLoading(true);
      navigate(OS_PROSPECTS_PATH.BUILD_SEGMENTS, {
        state: {
          name: getValues('name'),
          description: getValues('description'),
          is_active: getValues('is_active'),
        },
      });
      setIsLoading(false);
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

  return (
    <div className="mainContent ">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Prospect'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />
      <div className="mainContentInner form-container">
        <form>
          <div className="formGroup">
            <h5>Create Prospect</h5>

            <Controller
              name={`name`}
              control={control}
              defaultValue={''}
              render={({ field }) => (
                <FormInput
                  name="name"
                  displayName="Prospect Name"
                  value={field.value}
                  onChange={(e) => field.onChange(e)}
                  required
                  error={errors?.name?.message}
                  handleBlur={field.onBlur}
                />
              )}
            />
            <div className="w-50" />

            <Controller
              name={`description`}
              control={control}
              defaultValue={''}
              render={({ field }) => (
                <FormText
                  name="description"
                  classes={{ root: 'w-100' }}
                  displayName="Description"
                  value={field.value}
                  onChange={(e) => field.onChange(e)}
                  required
                  error={errors?.description?.message}
                  handleBlur={field.onBlur}
                />
              )}
            />
            <div className="mt-3 w-100 bg-primary" />
            <Controller
              name={`is_active`}
              control={control}
              defaultValue={true}
              render={({ field }) => (
                <FormToggle
                  name={'is_active'}
                  displayName={'Active/Inactive'}
                  checked={field.value}
                  classes={{ root: 'w-50' }}
                  handleChange={(e) => {
                    field.onChange(e.target.checked);
                  }}
                />
              )}
            />
          </div>
        </form>
      </div>
      <FormFooter
        enableCancel={true}
        onClickCancel={handleCancel}
        enableCreate={true}
        onClickCreate={handleSubmit}
        disabled={isLoading}
      />
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
          Build Segment
        </button>
        <SuccessPopUpModal
          title="Success!"
          message={'Prospect created.'}
          modalPopUp={showSuccessMessage}
          isNavigate={true}
          redirectPath={-1}
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
          archived={() => navigate(-1)}
          acceptBtnTitle="Ok"
          rejectBtnTitle="Cancel"
        />
      </div>
    </div>
  );
};

export default ProspectsCreate;

const schema = yup.object().shape({
  name: yup
    .string()
    .required('Prospect name is required.')
    .min(2, 'Min characters allowed for Name are 2')
    .max(50, 'Max characters allowed for Name are 50'),
  description: yup
    .string()
    .required('Description is required.')
    .max(500, 'Max characters allowed for Description are 500')
    .test(
      'min-length',
      'Min characters allowed for Alternate Name are 2',
      function (value) {
        if (value && value?.length === 1) {
          return false;
        }
        return true;
      }
    ),
  is_active: yup.bool().default(true),
});
