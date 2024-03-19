import React, { useEffect, useState } from 'react';
import styles from '../index.module.scss';
import SvgComponent from '../../../../common/SvgComponent';
import FormInput from '../../../../common/form/FormInput';
import { Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import SelectDropdown from '../../../../common/selectDropdown';
import FormCheckbox from '../../../../common/form/FormCheckBox';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker as MyTimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import moment from 'moment';
// import { isEmpty } from 'lodash';

export default function MarketingEquipmentForm({
  control,
  formErrors,
  marketing,
  setMarketing,
  promotional,
  setPromotional,
  singleItemOption,
  promotionalOptions,
  setValue,
  approvals,
  customErrors,
  setCustomErrors,
  getValues,
  watch,
}) {
  const [minDate, setMinDate] = useState(null);
  const [marketingMaxDate, setMarketingMaxDate] = useState(null);
  const [endTimeDisabled, setEndTimeDisabled] = useState(true);
  const marketing_start_date = watch('marketing_start_date');
  const start_date = getValues()?.start_date;
  const maxDate =
    start_date && moment(start_date).isValid()
      ? moment(start_date).subtract(60, 'days').toDate()
      : null;
  useEffect(() => {
    if (approvals?.promotional_items) {
      setValue('marketing_order_status', 'Pending Approval');
    }
    if (approvals?.marketing_materials) {
      setValue('promotioanal_order_status', 'Pending Approval');
    }
    if (marketing_start_date && moment(marketing_start_date).isValid()) {
      setMinDate(moment(marketing_start_date).toDate());
    }
    setMarketingMaxDate(moment(start_date).toDate());
  }, [
    approvals,
    marketing_start_date,
    marketingMaxDate,
    minDate,
    endTimeDisabled,
  ]);
  return (
    <div className="formGroup marketing">
      <h5>Marketing</h5>
      <div className="w-100">
        <Controller
          name="online_scheduling_allowed"
          control={control}
          defaultValue={false}
          render={({ field }) => (
            <FormCheckbox
              labelClass={styles.bold}
              name={field.name}
              displayName="Online Scheduling"
              checked={field.value}
              classes={{ root: 'mt-2' }}
              onChange={(e) => field.onChange(e.target.checked)}
            />
          )}
        />
      </div>
      <Controller
        name="marketing_start_date"
        control={control}
        render={({ field }) => (
          <div className="form-field">
            <div className={`field`}>
              <DatePicker
                dateFormat="MM-dd-yyyy"
                className="custom-datepicker effectiveDate"
                placeholderText="Start Date*"
                selected={field.value}
                error={formErrors?.marketing_start_date?.message}
                maxDate={maxDate}
                onChange={(e) => {
                  field.onChange(e);
                }}
                handleBlur={(e) => {
                  field.onChange(e);
                }}
              />
              {field?.value && (
                <label
                  className={`text-secondary ${styles.labelselected} ml-1 mt-1 pb-2`}
                >
                  Start Date*
                </label>
              )}
            </div>
            {formErrors.marketing_start_date && (
              <div className="error">
                <div className="error">
                  <p>{formErrors.marketing_start_date.message}</p>
                </div>
              </div>
            )}
          </div>
        )}
      />
      <Controller
        name="marketing_end_date"
        control={control}
        render={({ field }) => (
          <div className="form-field">
            <div className={`field`}>
              <DatePicker
                dateFormat="MM-dd-yyyy"
                className="custom-datepicker effectiveDate"
                placeholderText="End Date*"
                selected={field?.value}
                minDate={maxDate}
                maxDate={marketingMaxDate}
                error={formErrors?.marketing_end_date?.message}
                onChange={(e) => {
                  field.onChange(e);
                }}
                handleBlur={(e) => {
                  field.onChange(e);
                }}
              />
              {field?.value && (
                <label
                  className={`text-secondary ${styles.labelselected} ml-1 mt-1 pb-2`}
                >
                  End Date*
                </label>
              )}
            </div>
            {formErrors.marketing_end_date && (
              <div className="error">
                <div className="error">
                  <p>{formErrors.marketing_end_date.message}</p>
                </div>
              </div>
            )}
          </div>
        )}
      />
      <Controller
        name={`marketing_start_time`}
        control={control}
        render={({ field }) => (
          <div className="form-field">
            <div className={`field shiftTime`}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MyTimePicker
                  classes={{ root: 'dsd' }}
                  valueType="time"
                  value={field?.value ? dayjs(field?.value) : `'hh:mm·aa'`}
                  onChange={(e) => {
                    setEndTimeDisabled(false);
                    field.onChange(e);
                  }}
                  className="w-100 shift"
                  label="Start Time*"
                />
              </LocalizationProvider>
            </div>
            {formErrors?.marketing_start_time && (
              <div className="error">
                <div className="error">
                  <p>{formErrors?.marketing_start_time.message}</p>
                </div>
              </div>
            )}
          </div>
        )}
      />
      <Controller
        name={`marketing_end_time`}
        control={control}
        render={({ field }) => (
          <div className="form-field">
            <div className={`field shiftTime`}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MyTimePicker
                  classes={{ root: 'dsd' }}
                  valueType="time"
                  value={field?.value ? dayjs(field?.value) : `'hh:mm·aa'`}
                  disabled={endTimeDisabled}
                  onChange={(e) => {
                    field.onChange(e);
                  }}
                  className="w-100 shift"
                  label="End Time*"
                />
              </LocalizationProvider>
            </div>
            {formErrors?.marketing_end_time && (
              <div className="error">
                <div className="error">
                  <p>{formErrors?.marketing_end_time.message}</p>
                </div>
              </div>
            )}
          </div>
        )}
      />
      <div className="w-100 mt-4">
        <p className={styles.bold}>Marketing Materials</p>
      </div>
      <div className="col-md-12">
        <div className="row">
          <div className="col-md-6">
            <Controller
              name="instructional_information"
              control={control}
              render={({ field }) => (
                <div className="form-field w-100">
                  <div className={`field`}>
                    <div className="form-field textarea w-100">
                      <div className="field">
                        <textarea
                          type="text"
                          className="form-control textarea pt-3"
                          placeholder="Instructional Information"
                          name="description"
                          value={field?.value}
                          onChange={(e) => {
                            field.onChange(e);
                          }}
                        />
                      </div>
                    </div>
                    {field?.value && (
                      <label
                        className={`text-secondary ${styles.labelselected} ml-1 mt-1 pb-2`}
                      >
                        Instructional Information
                      </label>
                    )}
                  </div>
                </div>
              )}
            />
          </div>
          <div className="col-md-6">
            <Controller
              name="donor_information"
              control={control}
              render={({ field }) => (
                <div className="form-field w-100">
                  <div className={`field`}>
                    <div className="form-field textarea w-100">
                      <div className="field">
                        <textarea
                          type="text"
                          className="form-control textarea pt-3"
                          placeholder="Donor Information"
                          name="description"
                          onChange={(e) => {
                            field.onChange(e);
                          }}
                          value={field?.value}
                        />
                      </div>
                    </div>
                    {field?.value && (
                      <label
                        className={`text-secondary ${styles.labelselected} ml-1 mt-1 pb-2`}
                      >
                        Donor Information
                      </label>
                    )}
                  </div>
                </div>
              )}
            />
          </div>
        </div>
      </div>
      {marketing?.map((mq, i) => {
        return (
          <React.Fragment key={'marketing' + i}>
            <Controller
              name="Item"
              control={control}
              render={({ field }) => {
                return (
                  <SelectDropdown
                    // searchable={true}
                    placeholder={'Item*'}
                    showLabel={mq.item}
                    selectedValue={mq.item}
                    removeDivider
                    onChange={(e) => {
                      setCustomErrors((prev) => {
                        return {
                          ...prev,
                          marketingItem: '',
                        };
                      });
                      setMarketing((prev) => {
                        return prev.map((a, index) =>
                          index === i ? { ...a, item: e } : a
                        );
                      });
                    }}
                    handleBlur={(e) => {
                      setMarketing((prev) => {
                        return prev.map((a, index) =>
                          index === i ? { ...a, item: e } : a
                        );
                      });
                    }}
                    options={singleItemOption?.filter((item) => {
                      const exitingItems = [];
                      marketing?.map((mItem) => {
                        if (mItem?.item?.id) exitingItems.push(mItem?.item?.id);
                      });
                      return !exitingItems.includes(item.id);
                    })}
                    error={!mq.item && customErrors?.marketingItem}
                  />
                );
              }}
            />
            <div className="col-md-6">
              <div className="row">
                <div className="col-md-7">
                  <Controller
                    name="mquantity"
                    control={control}
                    render={({ field }) => (
                      <FormInput
                        name={'mquantity'}
                        classes={{ root: 'w-100' }}
                        displayName="Quantity*"
                        min={0}
                        max={9999}
                        value={mq.mquantity}
                        type="number"
                        required={false}
                        error={mq.mquantity === '' && customErrors?.mquantity}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          const parsedValue = parseInt(inputValue, 10);

                          if (parsedValue <= 9999) {
                            setCustomErrors((prev) => ({
                              ...prev,
                              mquantity: '',
                            }));

                            setMarketing((prev) =>
                              prev.map((a, index) =>
                                index === i
                                  ? { ...a, mquantity: inputValue }
                                  : a
                              )
                            );
                          } else {
                            setCustomErrors((prev) => ({
                              ...prev,
                              mquantity:
                                'Quantity should be less than or equal to 9999',
                            }));
                          }
                        }}
                      />
                    )}
                  />
                </div>
                <div className="col-md-5">
                  <p className="det-add-btn">
                    {i !== 0 ? (
                      <button
                        onClick={() => {
                          setMarketing((prev) => {
                            return prev.filter((item, ind) => ind !== i);
                          });
                        }}
                        type="button"
                      >
                        <SvgComponent name={'TagsMinusIcon'} />
                      </button>
                    ) : null}
                    <button
                      onClick={() => {
                        setMarketing((prev) => {
                          return [...prev, { item: null, mquantity: '' }];
                        });
                      }}
                      type="button"
                    >
                      <SvgComponent name={'PlusIcon'} />
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </React.Fragment>
        );
      })}
      <Controller
        name="order_due_date"
        control={control}
        render={({ field }) => (
          <div className="form-field">
            <div className={`field`}>
              <DatePicker
                dateFormat="MM-dd-yyyy"
                className="custom-datepicker effectiveDate"
                placeholderText="Date*"
                selected={field?.value}
                error={formErrors?.order_due_date?.message}
                onChange={(e) => {
                  field.onChange(e);
                }}
                handleBlur={(e) => {
                  field.onChange(e);
                }}
              />
              {field?.value && (
                <label
                  className={`text-secondary ${styles.labelselected} ml-1 mt-1 pb-2`}
                >
                  Order Due
                </label>
              )}
            </div>
            {formErrors.order_due_date && (
              <div className="error">
                <div className="error">
                  <p>{formErrors.order_due_date.message}</p>
                </div>
              </div>
            )}
          </div>
        )}
      />
      <Controller
        name="marketing_order_status"
        control={control}
        render={({ field }) => (
          <FormInput
            name={field.name}
            classes={{ root: '' }}
            showLabel={true}
            displayName="Order Status"
            value={field?.value || 'Pending approval'}
            required={false}
            disabled={true}
          />
        )}
      />
      <div className="w-100 mt-4">
        <p className={styles.bold}>Promotional Items</p>
      </div>
      {promotional?.map((pq, i) => {
        return (
          <React.Fragment key={'promotional' + i}>
            <Controller
              name="Item"
              control={control}
              render={({ field }) => {
                return (
                  <SelectDropdown
                    // searchable={true}
                    placeholder={'Item*'}
                    showLabel={pq.item}
                    selectedValue={pq.item}
                    removeDivider
                    onChange={(e) => {
                      setCustomErrors((prev) => {
                        return {
                          ...prev,
                          promotionalItem: '',
                        };
                      });
                      setPromotional((prev) => {
                        return prev.map((a, index) =>
                          index === i ? { ...a, item: e } : a
                        );
                      });
                    }}
                    handleBlur={(e) => {
                      setPromotional((prev) => {
                        return prev.map((a, index) =>
                          index === i ? { ...a, item: e } : a
                        );
                      });
                    }}
                    options={promotionalOptions?.filter((item) => {
                      const exitingItems = [];
                      promotional?.map((mItem) => {
                        if (mItem?.item?.id) exitingItems.push(mItem?.item?.id);
                      });
                      return !exitingItems.includes(item.id);
                    })}
                    error={!pq.item && customErrors.promotionalItem}
                  />
                );
              }}
            />
            <div className="col-md-6">
              <div className="row">
                <div className="col-md-7">
                  <Controller
                    name="pquantity"
                    control={control}
                    render={({ field }) => (
                      <FormInput
                        name={'pquantity'}
                        min={0}
                        max={9999}
                        classes={{ root: 'w-100' }}
                        displayName="Quantity*"
                        type="number"
                        value={pq.pquantity}
                        required={false}
                        error={
                          pq.pquantity === '' &&
                          customErrors.promotionalQuantity
                        }
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          const parsedValue = parseInt(inputValue, 10);

                          if (parsedValue <= 9999) {
                            setCustomErrors((prev) => ({
                              ...prev,
                              promotionalQuantity: '',
                            }));

                            setPromotional((prev) =>
                              prev.map((a, index) =>
                                index === i
                                  ? { ...a, pquantity: inputValue }
                                  : a
                              )
                            );
                          } else {
                            setCustomErrors((prev) => ({
                              ...prev,
                              promotionalQuantity:
                                'Quantity should be less than or equal to 9999',
                            }));
                          }
                        }}
                      />
                    )}
                  />
                </div>
                <div className="col-md-5">
                  <p className="det-add-btn">
                    {i !== 0 ? (
                      <button
                        onClick={() => {
                          setPromotional((prev) => {
                            return prev.filter((item, ind) => ind !== i);
                          });
                        }}
                        type="button"
                      >
                        <SvgComponent name={'TagsMinusIcon'} />
                      </button>
                    ) : null}
                    <button
                      onClick={() => {
                        setPromotional((prev) => {
                          return [...prev, { item: null, pquantity: '' }];
                        });
                      }}
                      type="button"
                    >
                      <SvgComponent name={'PlusIcon'} />
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </React.Fragment>
        );
      })}
      <Controller
        name="promotioanal_order_status"
        control={control}
        render={({ field }) => (
          <FormInput
            name={field.name}
            classes={{ root: '' }}
            displayName="Order Status"
            value={field?.value || 'Pending approval'}
            required={false}
            disabled={true}
          />
        )}
      />
    </div>
  );
}
