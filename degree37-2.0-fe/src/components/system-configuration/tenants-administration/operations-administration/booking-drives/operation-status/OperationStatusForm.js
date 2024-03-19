import React from 'react';
// import validationSchema from './OperationStatusSchema';
// import * as Yup from 'yup';
import { Controller } from 'react-hook-form';
import Form from '../../../../../common/form/Form';
import FormInput from '../../../../../common/form/FormInput';
import FormText from '../../../../../common/form/FormText';
import FormRadioButtons from '../../../../../common/form/FormRadioButtons';
import FormCheckbox from '../../../../../common/form/FormCheckBox';
import FormToggle from '../../../../../common/form/FormToggle';
import GlobalMultiSelect from '../../../../../common/GlobalMultiSelect';

const colors = {
  GREEN: 'Green',
  YELLOW: 'Yellow',
  RED: 'Red',
  BLUE: 'Blue',
  LAVENDER: 'Lavender',
  GREY: 'Grey',
};

const OperationStatusForm = (props) => {
  const {
    operationStatusFormData,
    editScreen,
    showConfirmationDialog,
    setShowConfirmationDialog,
    showSuccessDialog,
    setShowSuccessDialog,
    onConfirmNavigate,
    BreadcrumbsData,
    handleSubmit,
    successModalMessage,
    eventName,
    BreadCrumbsTitle,
    control,
    isDirty,
    formErrors,
    getValues,
    modalPopUp,
    setModalPopUp,
    handleArchive,
    archiveStatus,
    setArchiveStatus,
  } = props;

  return (
    <Form
      editScreen={editScreen}
      showConfirmationDialog={showConfirmationDialog}
      setShowConfirmationDialog={setShowConfirmationDialog}
      showSuccessDialog={showSuccessDialog}
      setShowSuccessDialog={setShowSuccessDialog}
      onConfirmNavigate={onConfirmNavigate}
      isDisabled={true}
      isStateDirty={isDirty}
      BreadcrumbsData={BreadcrumbsData}
      handleSubmit={handleSubmit}
      successModalMessage={successModalMessage}
      eventName={eventName}
      BreadCrumbsTitle={BreadCrumbsTitle}
      modalPopUp={modalPopUp}
      setModalPopUp={setModalPopUp}
      setArchiveStatus={setArchiveStatus}
      archiveStatus={archiveStatus}
      handleArchive={handleArchive}
    >
      <div className="formGroup">
        {editScreen ? (
          <h5>Edit Operation Status</h5>
        ) : (
          <h5>Create Operation Status</h5>
        )}

        <Controller
          name="operationStatusName"
          control={control}
          render={({ field }) => (
            <FormInput
              label="Name"
              displayName="Name"
              classes={{ root: '' }}
              name="operationStatusName"
              value={field?.value}
              required
              error={formErrors?.operationStatusName?.message}
              onChange={(e) => {
                const filteredValue = e.target.value.replace(/^\s+/g, '');
                field.onChange({ target: { value: filteredValue } });
              }}
              handleBlur={(e) => {
                const filteredValue = e.target.value.replace(/^\s+/g, '');
                field.onChange({ target: { value: filteredValue } });
              }}
              maxLength={50}
            />
          )}
        />
        <div className="form-field">
          <Controller
            name="selectedAppliesTo"
            control={control}
            classes={{ root: '' }}
            render={({ field }) => (
              <GlobalMultiSelect
                label="Applies To*"
                data={operationStatusFormData?.appliesTo}
                selectedOptions={field.value}
                error={formErrors?.selectedAppliesTo?.message}
                onChange={(e) => {
                  field.onChange({
                    target: {
                      value: getValues('selectedAppliesTo').some(
                        (item) => item.id === e.id
                      )
                        ? getValues('selectedAppliesTo').filter(
                            (item) => item.id !== e.id
                          )
                        : [...getValues('selectedAppliesTo'), e],
                    },
                  });
                }}
                onSelectAll={(data) => {
                  field.onChange({
                    target: {
                      value: data,
                    },
                  });
                }}
              />
            )}
          />
        </div>

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <FormText
              name="description"
              displayName="Description"
              value={field.value}
              error={formErrors?.description?.message}
              classes={{ root: 'w-100' }}
              required
              onChange={(e) => {
                const filteredValue = e.target.value.replace(/^\s+/g, '');
                field.onChange({ target: { value: filteredValue } });
              }}
              handleBlur={(e) => {
                const filteredValue = e.target.value.replace(/^\s+/g, '');
                field.onChange({ target: { value: filteredValue } });
              }}
            />
          )}
        />
        <div className="w-100">
          <div className="form-field w-100">
            <p>Select Chip Color*</p>
          </div>
          <div className="d-flex opt-radio">
            <Controller
              name="chipColor"
              control={control}
              render={({ field }) =>
                Object.keys(colors).map((colorKey) => {
                  const color = colors[colorKey];
                  return (
                    <FormRadioButtons
                      key={colorKey}
                      name="chip-color"
                      label={color}
                      value={color}
                      className=""
                      selected={field.value}
                      // className="w-25"
                      colorfull={true}
                      handleChange={(event) => {
                        field.onChange({
                          target: { value: event.target.value },
                        });
                      }}
                    />
                  );
                })
              }
            />
          </div>

          {formErrors?.chipColor?.message && (
            <div className="error">
              <p
                style={{
                  fontSize: '13px',
                  color: '#ff1e1e',
                }}
              >
                {formErrors?.chipColor?.message}
              </p>
            </div>
          )}
        </div>

        <Controller
          name="schedulable"
          control={control}
          render={({ field }) => (
            <FormCheckbox
              name="schedulable"
              displayName="Schedulable"
              checked={field.value}
              value={field.value}
              classes={{ root: 'w-50' }}
              handleChange={(event) => {
                field.onChange({ target: { value: event.target.checked } });
              }}
            />
          )}
        />

        <Controller
          name="holdsResources"
          control={control}
          render={({ field }) => (
            <FormCheckbox
              name="holdsResources"
              displayName="Holds Resources"
              checked={field.value}
              value={field.value}
              classes={{ root: 'w-50' }}
              handleChange={(event) => {
                field.onChange({ target: { value: event.target.checked } });
              }}
            />
          )}
        />
        <Controller
          name="ContributeToScheduled"
          control={control}
          render={({ field }) => (
            <FormCheckbox
              name="ContributeToScheduled"
              displayName="Contribute To Scheduled"
              checked={field.value}
              value={field.value}
              classes={{ root: 'w-50' }}
              handleChange={(event) => {
                field.onChange({ target: { value: event.target.checked } });
              }}
            />
          )}
        />

        <Controller
          name="requiresApproval"
          control={control}
          render={({ field }) => (
            <FormCheckbox
              name="requiresApproval"
              displayName="Requires Approval"
              checked={field.value}
              value={field.value}
              classes={{ root: 'w-50' }}
              handleChange={(event) => {
                field.onChange({ target: { value: event.target.checked } });
              }}
            />
          )}
        />

        <Controller
          name="isActive"
          control={control}
          render={({ field }) => (
            <FormToggle
              name="isActive"
              displayName={field.value ? 'Active' : 'Inactive'}
              checked={field.value}
              classes={{ root: 'pt-2' }}
              handleChange={(event) => {
                field.onChange({ target: { value: event.target.checked } });
              }}
            />
          )}
        />
      </div>
    </Form>
  );
};

export default OperationStatusForm;
