import React from 'react';
import { Controller } from 'react-hook-form';
import styles from '../../operations-center/operations/drives/index.module.scss';
import DatePicker from 'react-datepicker';
import SelectDropdown from '../selectDropdown';
import FormCheckbox from '../form/FormCheckBox';
import FormInput from '../form/FormInput';
import FormToggle from '../form/FormToggle';
import FormText from '../form/FormText';

export default function CustomFieldsForm({
  control,
  formErrors,
  customFileds,
}) {
  const Options_base_id = (item) => {
    let array = [];
    if (item?.length > 0) {
      item?.forEach((OptionItem) => {
        array.push({
          label: OptionItem.type_name,
          value: OptionItem.type_value,
        });
      });
    }
    return array;
  };

  return (
    <>
      {customFileds?.length > 0 && (
        <div className="formGroup">
          <h5>Custom Fields</h5>
          {customFileds?.map((item, index) => {
            return (
              <React.Fragment key={index}>
                {item?.field_data_type == '4' ? (
                  <Controller
                    name={item?.id}
                    control={control}
                    render={({ field }) => {
                      return (
                        <SelectDropdown
                          placeholder={
                            item?.is_required
                              ? item?.field_name + '*'
                              : item?.field_name
                          }
                          showLabel={field?.value?.value}
                          defaultValue={field?.value}
                          selectedValue={field?.value}
                          options={Options_base_id(item?.pick_list)}
                          removeDivider
                          onChange={(e) => {
                            console.log({ e });
                            field.onChange(e);
                          }}
                          handleBlur={(e) => {
                            field.onChange(e);
                          }}
                          error={formErrors[item?.id]?.message}
                        />
                      );
                    }}
                  />
                ) : null}
                {item?.field_data_type == '5' ? (
                  <Controller
                    name={item?.id}
                    control={control}
                    render={({ field }) => {
                      // console.log(field, 'field');
                      return (
                        <FormInput
                          name={field.name}
                          classes={{ root: '' }}
                          displayName={
                            item?.is_required
                              ? item?.field_name + '*'
                              : item?.field_name
                          }
                          value={field?.value}
                          onChange={(e) => {
                            field.onChange(e);
                          }}
                          required={false}
                          error={formErrors[item?.id]?.message}
                        />
                      );
                    }}
                  />
                ) : null}
                {item?.field_data_type == '3' ? (
                  <Controller
                    name={item?.id}
                    control={control}
                    render={({ field }) => (
                      <FormInput
                        type="number"
                        name={field.name}
                        classes={{ root: '' }}
                        displayName={
                          item?.is_required
                            ? item?.field_name + '*'
                            : item?.field_name
                        }
                        value={field?.value}
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                        required={false}
                        error={formErrors[item?.id]?.message}
                      />
                    )}
                  />
                ) : null}
                {item?.field_data_type == '2' ? (
                  <Controller
                    name={item?.id}
                    control={control}
                    render={({ field }) => (
                      <FormInput
                        type="number"
                        name={field.name}
                        classes={{ root: '' }}
                        displayName={
                          item?.is_required
                            ? item?.field_name + '*'
                            : item?.field_name
                        }
                        value={field?.value}
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                        required={false}
                        error={formErrors[item?.id]?.message}
                      />
                    )}
                  />
                ) : null}
                {item?.field_data_type == '1' ? (
                  <Controller
                    name={item?.id}
                    control={control}
                    render={({ field }) => (
                      <div className="form-field">
                        <div className={`field`}>
                          <DatePicker
                            //disabled={true}
                            dateFormat="MM-dd-yyyy"
                            className={`custom-datepicker ${
                              field?.value ? '' : 'effectiveDate'
                            }`}
                            placeholderText={
                              item?.is_required
                                ? item?.field_name + '*'
                                : item?.field_name
                            }
                            selected={field?.value && new Date(field?.value)}
                            onChange={(e) => {
                              field.onChange(e);
                            }}
                            handleBlur={(e) => {
                              field.onChange(e);
                            }}
                          />
                          {formErrors[item?.id]?.message && (
                            <div className="error">
                              <p>{formErrors[item?.id]?.message}</p>
                            </div>
                          )}
                          {field?.value && (
                            <label
                              className={`text-secondary ${styles.labelselected} ml-1 mt-1 pb-2`}
                            >
                              {item?.is_required
                                ? item?.field_name + '*'
                                : item?.field_name}
                            </label>
                          )}
                        </div>
                      </div>
                    )}
                  />
                ) : null}
                {item?.field_data_type == '8' ? (
                  <Controller
                    name={item?.id}
                    control={control}
                    defaultValue={false}
                    render={({ field }) => (
                      <FormCheckbox
                        //disabled={true}
                        name={field.name}
                        displayName={
                          item?.is_required
                            ? item?.field_name + '*'
                            : item?.field_name
                        }
                        checked={field.value === 'true'}
                        classes={{
                          root: 'mt-2',
                          checkboxfield: 'checkboxfield',
                        }}
                        onChange={(e) =>
                          field.onChange(e.target.checked.toString())
                        }
                        error={formErrors[item?.id]?.message}
                      />
                    )}
                  />
                ) : null}
                {item?.field_data_type == '7' ? (
                  <Controller
                    name={item?.id}
                    control={control}
                    defaultValue={false}
                    render={({ field }) => (
                      console.log(field.value),
                      (
                        <FormToggle
                          name={field.name}
                          displayName={
                            item?.is_required
                              ? item?.field_name + '*'
                              : item?.field_name
                          }
                          checked={field.value === 'true'}
                          error={formErrors[item?.id]?.message}
                          classes={{ checkboxfield: 'checkboxfield' }}
                          handleChange={(event) => {
                            field.onChange({
                              target: {
                                value: event.target.checked.toString(),
                              },
                            });
                          }}
                        />
                      )
                    )}
                  />
                ) : null}
                {item?.field_data_type == '6' ? (
                  <Controller
                    name={item?.id}
                    control={control}
                    render={({ field }) => (
                      <FormText
                        name={field.name}
                        displayName={
                          item?.is_required
                            ? item?.field_name + '*'
                            : item?.field_name
                        }
                        value={field.value}
                        classes={{ root: 'customPadding' }}
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                        required={false}
                        error={formErrors[item?.id]?.message}
                        onBlur={field.onBlur}
                        // icon={<ToolTip text={'Please Enter Electrical Note'} />}
                      />
                    )}
                  />
                ) : null}
              </React.Fragment>
            );
          })}
        </div>
      )}
    </>
  );
}
