import React, { Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import FormInput from '../../../../../common/form/FormInput';
import SelectDropdown from '../../../../../common/selectDropdown';

const StafConfigForm = ({
  staffConfig,
  setStaffConfig,
  handleAppend,
  handleRemove,
  handleErrorState,
  errors,
  check,
  setCheck,
  id,
  rolesOptions,
}) => {
  const handleOnChangeStaffConfig = (e, index, isRole) => {
    let name;
    let value;
    if (isRole) {
      name = isRole;
      value = e;
    } else {
      name = e.target.name;
      value = e.target.value;
    }
    const updatedConfig = staffConfig?.map((config, i) =>
      i === index ? { ...config, [name]: value } : config
    );
    setStaffConfig(updatedConfig);
    handleErrorState(name, index);
  };
  return (
    <div className="formGroup position-relative">
      <h5>{id && 'Edit '}Configuration</h5>
      {staffConfig?.length > 0 &&
        staffConfig?.map((item, index) => (
          <Fragment key={index}>
            <SelectDropdown
              placeholder={'Contact Role*'}
              name={'role'}
              options={rolesOptions}
              value={item?.role}
              onChange={(e) => handleOnChangeStaffConfig(e, index, 'role')}
              error={errors?.length > 0 && errors[index]?.role}
              selectedValue={item?.role}
              removeTheClearCross={true}
              removeDivider={true}
              // disabled={id ? true : false}
              showLabel
            />
            <FormInput
              name="qty"
              required
              type="number"
              min={1}
              displayName="Qty"
              value={item?.qty}
              onChange={(e) => handleOnChangeStaffConfig(e, index)}
              error={errors?.length > 0 && errors[index]?.qty}
              // disabled={id ? true : false}
            />
            <FormInput
              displayName="Lead Time"
              name="leadTime"
              required
              type="number"
              min={1}
              value={item?.leadTime}
              onChange={(e) => handleOnChangeStaffConfig(e, index)}
              error={errors?.length > 0 && errors[index]?.leadTime}
              // disabled={id ? true : false}
            />
            <FormInput
              displayName="Setup Time"
              name="setupTime"
              required
              type="number"
              min={1}
              value={item?.setupTime}
              onChange={(e) => handleOnChangeStaffConfig(e, index)}
              error={errors?.length > 0 && errors[index]?.setupTime}
              // disabled={id ? true : false}
            />
            <FormInput
              displayName="Breakdown Time"
              name="breakdownTime"
              required
              type="number"
              min={1}
              value={item?.breakdownTime}
              onChange={(e) => handleOnChangeStaffConfig(e, index)}
              error={errors?.length > 0 && errors[index]?.breakdownTime}
              // disabled={id ? true : false}
            />
            <FormInput
              displayName="Wrapup Time"
              name="wrapupTime"
              required
              type="number"
              min={1}
              value={item?.wrapupTime}
              onChange={(e) => handleOnChangeStaffConfig(e, index)}
              error={errors?.length > 0 && errors[index]?.wrapupTime}
              // disabled={id ? true : false}
            />
            <div className="w-100 mb-2 pb-2">
              <div className="d-flex justify-content-end align-items-center">
                <div
                  className={`icon ${'cursor-pointer'} text-secondary me-2`}
                  onClick={() => handleRemove(item?.row_id)}
                  tabIndex={0}
                  onKeyDown={() => handleRemove(item?.row_id)}
                >
                  <FontAwesomeIcon icon={faMinus} size="md" />
                </div>
                <div
                  className={`icon ms-1 ${'cursor-pointer'} text-primary ms-3`}
                  onClick={() => handleAppend()}
                  tabIndex={0}
                  onKeyDown={() => handleAppend()}
                >
                  <FontAwesomeIcon icon={faPlus} size="xs" />
                </div>
              </div>
            </div>
          </Fragment>
        ))}
      <div className="form-field checkbox">
        <span className="toggle-text">{check ? 'Active' : 'Inactive'}</span>
        <label htmlFor="toggle" className="switch">
          <input
            type="checkbox"
            id="toggle"
            className="toggle-input"
            name="is_active"
            checked={check}
            onChange={(e) => setCheck(e.target.checked ? true : false)}
          />
          <span className="slider round"></span>
        </label>
      </div>
    </div>
  );
};

export default StafConfigForm;
