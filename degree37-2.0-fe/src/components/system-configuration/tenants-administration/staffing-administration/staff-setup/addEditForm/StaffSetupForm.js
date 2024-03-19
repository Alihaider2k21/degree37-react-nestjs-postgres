import React from 'react';
import FormInput from '../../../../../common/form/FormInput';
import SelectDropdown from '../../../../../common/selectDropdown';
import { LocationType, opertaionType } from '../data';
import ToolTip from '../../../../../common/tooltip';

const StaffSetupForm = ({
  id,
  errors,
  setStaffSetup,
  staffSetup,
  handleErrorState,
  procedureOptions = [],
}) => {
  const handleOnChangeStaffSetup = (e) => {
    const { name, value } = e.target;
    setStaffSetup({ ...staffSetup, [name]: value });
    handleErrorState({ [name]: value }, name);
  };
  const handleDropDownChange = (e, name) => {
    const { value } = e;
    setStaffSetup({ ...staffSetup, [name]: e });
    handleErrorState({ [name]: value }, name);
  };

  return (
    <div className="formGroup">
      <h5>{id ? 'Edit' : 'Create'} Staff Setup</h5>
      <SelectDropdown
        placeholder={'Operation Type*'}
        name="operation"
        options={opertaionType.filter(
          (item) => item?.value !== 'Operation Type'
        )}
        onChange={(e) => handleDropDownChange(e, 'operation')}
        error={errors?.operation}
        selectedValue={staffSetup?.operation}
        removeTheClearCross={true}
        removeDivider={true}
        showLabel={true}
      />
      <div className="w-50 d-none d-lg-block" />
      <FormInput
        label="Name"
        displayName="Name"
        name="name"
        error={errors?.name}
        required
        value={staffSetup?.name}
        onChange={(e) => {
          e.target.value = e.target.value.replace(/^\s+/g, '');
          handleOnChangeStaffSetup(e);
        }}
      />
      <FormInput
        label="Short Name"
        name="shortName"
        displayName="Short Name"
        error={errors?.shortName}
        required
        value={staffSetup?.shortName}
        onChange={(e) => {
          e.target.value = e.target.value.replace(/^\s+/g, '');
          handleOnChangeStaffSetup(e);
        }}
      />
      <SelectDropdown
        placeholder={'Procedure Type*'}
        name={'procedure'}
        options={procedureOptions}
        error={errors?.procedure}
        onChange={(e) => handleDropDownChange(e, 'procedure')}
        selectedValue={staffSetup?.procedure}
        removeTheClearCross={true}
        removeDivider={true}
        showLabel={true}
      />
      {!staffSetup?.operation || staffSetup?.operation?.value === 'DRIVE' ? (
        <SelectDropdown
          placeholder={'Location Type*'}
          name={'location'}
          options={LocationType?.filter(
            (item) => item?.value !== 'Location Type'
          )}
          error={errors?.location}
          onChange={(e) => handleDropDownChange(e, 'location')}
          selectedValue={staffSetup?.location}
          removeTheClearCross={true}
          removeDivider={true}
          showLabel={true}
        />
      ) : (
        ''
      )}
      <FormInput
        label="Beds"
        name="beds"
        type="number"
        min={1}
        displayName="Beds"
        error={errors?.beds}
        required
        value={staffSetup?.beds}
        onChange={(e) => handleOnChangeStaffSetup(e)}
      />
      <FormInput
        label="Concurrent Beds"
        name="concurrentBeds"
        type="number"
        min={1}
        displayName="Concurrent Beds"
        error={errors?.concurrentBeds}
        required={true}
        value={staffSetup?.concurrentBeds}
        onChange={(e) => handleOnChangeStaffSetup(e)}
      />
      <div className={`form-field`}>
        <div className={`h-100 field password`}>
          <input
            type="number"
            min={0}
            className={'form-control'}
            name={'staggerSlots'}
            value={staffSetup?.staggerSlots}
            onChange={(e) => handleOnChangeStaffSetup(e)}
            placeholder=" "
            required
          />
          <label>Stagger Slots*</label>
          <div className="icon">
            <ToolTip
              text={
                'If appointments should be staggered, enter the number of minutes between concurrent slots.'
              }
            />
          </div>
        </div>
        {errors?.staggerSlots && (
          <div>
            <div className="error">
              <p>{errors?.staggerSlots}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffSetupForm;
