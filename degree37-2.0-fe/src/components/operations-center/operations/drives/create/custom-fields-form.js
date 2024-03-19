import React from 'react';
import { Controller } from 'react-hook-form';
import styles from '../index.module.scss';
import DatePicker from 'react-datepicker';
import SelectDropdown from '../../../../common/selectDropdown';
import FormCheckbox from '../../../../common/form/FormCheckBox';
import FormInput from '../../../../common/form/FormInput';
import FormToggle from '../../../../common/form/FormToggle';
import FormText from '../../../../common/form/FormText';

export default function CustomFieldsForm({
  control,
  formErrors,
  locationsData,
  customFileds,
}) {
  const Options_base_id = (item) => {
    let array = [];
    if (item?.length > 0) {
      item?.map((OptionItem, index) => {
        array.push({
          label: OptionItem.type_name,
          value: OptionItem.type_value,
        });
      });
    }
    return array;
  };

  return (
    <div className="formGroup">
      <h5>Custom Fields</h5>
      {customFileds?.length > 0 &&
        customFileds?.map((item, index) => {
          return (
            <>
              {item?.field_data_type == '4' ? (
                <>
                  {' '}
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
                </>
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
                          className="custom-datepicker effectiveDate"
                          placeholderText={
                            item?.is_required ? 'Date' + '*' : 'Date'
                          }
                          selected={field?.value}
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
                        {field?.start_date && (
                          <label
                            className={`text-secondary ${styles.labelselected} ml-1 mt-1 pb-2`}
                          >
                            Date*
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
                      checked={field.value}
                      classes={{ root: 'mt-2' }}
                      onChange={(e) => field.onChange(e.target.checked)}
                      error={formErrors[item?.id]?.message}
                    />
                  )}
                />
              ) : null}
              {item?.field_data_type == '7' ? (
                <Controller
                  name={item?.id}
                  control={control}
                  defaultValue={true}
                  render={({ field }) => (
                    <FormToggle
                      name={field.name}
                      displayName={
                        item?.is_required
                          ? item?.field_name + '*'
                          : item?.field_name
                      }
                      checked={field.value}
                      error={formErrors[item?.id]?.message}
                      handleChange={(event) => {
                        field.onChange({
                          target: { value: event.target.checked },
                        });
                      }}
                    />
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
            </>
          );
        })}
    </div>
  );
}
