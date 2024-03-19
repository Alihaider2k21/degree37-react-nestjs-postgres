import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import SelectDropdown from '../../../../common/selectDropdown';
import FormRadioButtons from '../../../../common/form/FormRadioButtons';
import styles from '../../drives/index.module.scss';
import sessionStyles from '../Session.module.scss';

export default function SelectSessionForm({
  control,
  formValue,
  setFormValue,
  formFields = [
    { label: 'Session Blueprint', value: 'session_blueprint', disabled: false },
    { label: 'Copy Session', value: 'copy_session', disabled: false },
    { label: 'Clean Slate', value: 'clean_slate', disabled: false },
  ],
}) {
  const [activeDays, setActiveDays] = useState([]);

  const toggleActiveDay = (day) => {
    if (activeDays.includes(day)) {
      // Day is active, so deactivate it
      setActiveDays(activeDays.filter((activeday) => activeday !== day));
    } else {
      // Day is not active, so activate it
      setActiveDays([...activeDays, day]);
    }
  };

  const donorCenterNameOptions = [
    { label: 'name', value: '1' },
    { label: 'name2', value: '2' },
    { label: 'name3', value: '3' },
  ];
  const copySessionDate = [
    { label: '01-08-2023', value: '1' },
    { label: '08-12-2023', value: '2' },
    { label: '15-09-2023', value: '3' },
  ];
  const weekDays = [
    { label: 'M', value: 'monday' },
    { label: 'T', value: 'tuesday' },
    { label: 'W', value: 'wednesday' },
    { label: 'T', value: 'thursday' },
    { label: 'F', value: 'friday' },
    { label: 'S', value: 'saturday' },
    { label: 'S', value: 'sunday' },
  ];

  return (
    <div className="formGroup mt-5">
      <h5>Select Session Form</h5>
      <div className="d-flex gap-5">
        {formFields?.map((formField, index) => (
          <FormRadioButtons
            label={formField.label}
            value={formField.value}
            key={index}
            className={`${styles.formCheckBoxes} gap-2`}
            selected={formValue}
            handleChange={(event) => setFormValue(event.target.value)}
            disabled={formField.disabled}
          />
        ))}
      </div>
      <div className="formGroup p-0 border-0">
        {formValue === 'copy_session' ? (
          <>
            <Controller
              name="copy_session_DCN"
              control={control}
              render={({ field }) => {
                return (
                  <SelectDropdown
                    styles={{ root: 'mb-0' }}
                    searchable={true}
                    placeholder={'Donor Center Name'}
                    showLabel={field?.value?.value}
                    defaultValue={field?.value}
                    selectedValue={field?.value}
                    removeDivider
                    onChange={field.onChange}
                    handleBlur={field.onChange}
                    options={donorCenterNameOptions}
                  />
                );
              }}
            />
            <Controller
              name="copy_session_date"
              control={control}
              render={({ field }) => {
                return (
                  <SelectDropdown
                    styles={{ root: 'mb-0' }}
                    searchable={true}
                    placeholder={'Date'}
                    showLabel={field?.value?.value}
                    defaultValue={field?.value}
                    selectedValue={field?.value}
                    removeDivider
                    onChange={field.onChange}
                    handleBlur={field.onChange}
                    options={copySessionDate}
                  />
                );
              }}
            />
          </>
        ) : formValue === 'session_blueprint' ? (
          <>
            <Controller
              name="session_blueprint_DCN"
              control={control}
              render={({ field }) => {
                return (
                  <SelectDropdown
                    searchable={true}
                    placeholder={'Donor Center Name'}
                    showLabel={field?.value?.value}
                    defaultValue={field?.value}
                    selectedValue={field?.value}
                    removeDivider
                    onChange={field.onChange}
                    handleBlur={field.onChange}
                    options={donorCenterNameOptions}
                  />
                );
              }}
            />
            <Controller
              name="session_blueprint_BN"
              control={control}
              render={({ field }) => {
                return (
                  <SelectDropdown
                    searchable={true}
                    placeholder={'Blueprint Name'}
                    showLabel={field?.value?.value}
                    defaultValue={field?.value}
                    selectedValue={field?.value}
                    removeDivider
                    onChange={field.onChange}
                    handleBlur={field.onChange}
                    options={donorCenterNameOptions}
                  />
                );
              }}
            />
            <div className="w-100">
              <p className="text-sm mb-1">Blueprint Applies To*</p>
            </div>
            <div className="d-flex gap-2">
              {weekDays.map((day) => (
                <div
                  className={`${sessionStyles.weekBadge} ${
                    activeDays.includes(day.value) && sessionStyles.active
                  }`}
                  onClick={() => toggleActiveDay(day.value)}
                  id={day.value}
                  key={day.value}
                >
                  {day.label}
                </div>
              ))}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
