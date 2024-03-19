import React, { useEffect, useMemo } from 'react';
import styles from '../../system-configuration/tenants-administration/operations-administration/booking-drives/booking-rule/booking-rule.module.scss';
import DatePicker from 'react-datepicker';
import ToolTip from '../tooltip';
import { Controller, useForm } from 'react-hook-form';
import FormInput from '../form/FormInput';
import GlobalMultiSelect from '../GlobalMultiSelect';
import FormRadioButtons from '../form/FormRadioButtons';

const BookingRulesForm = ({
  bookingRuleFormData,
  setBookingRuleFormData,
  errors,
  selectedAuditField,
  setSelectedAuditField,
  control,
  error,
  getValues,
  setValue,
  watch,
  justShow = false,
}) => {
  const {
    control: ctrl,
    reset,
    setValue: sValue,
    getValues: gValues,
    watch: localWatch,
  } = useForm({
    defaultValues: useMemo(() => bookingRuleFormData, [bookingRuleFormData]),
  });
  if (!control) {
    control = ctrl;
    getValues = gValues;
    setValue = sValue;
    watch = localWatch;
  }

  useEffect(() => {
    reset({ ...bookingRuleFormData, selectedAuditField });
  }, [bookingRuleFormData]);

  if (!justShow) {
    selectedAuditField = watch('selectedAuditField');
  }

  const watchLeadTime = watch('ScheduleLockLeadTimeDto.lead_time');
  const watchLocationExpires = watch('LocationQualificationDto.expires');

  return (
    <form className={styles.bookingRule}>
      <div className="formGroup">
        <h5>
          {bookingRuleFormData.readOnly
            ? 'Booking Rules'
            : 'Edit Booking Rules'}
        </h5>
        <div className={`${styles.group} w-100`}>
          <div className={`${styles.headings}`}>
            <p>Third Rail Fields </p>
            <ToolTip
              text={
                'These fields will be locked for changes during the lock lead time and on locked dates; changes will require override permission.'
              }
            />
          </div>
          <div className="form-field checkbox br">
            <Controller
              name="thirdRailFields.date"
              control={control}
              render={({ field }) => (
                <FormInput
                  type="checkbox"
                  className="form-check-input"
                  name={field.name}
                  checked={field.value}
                  disabled={bookingRuleFormData.readOnly}
                  onChange={(event) => {
                    field.onChange({ target: { value: event.target.checked } });
                  }}
                  //error={error?.procedure_name?.message}
                  required={false}
                  displayName={'Date'}
                />
              )}
            />
          </div>
          <div className="form-field checkbox br">
            <Controller
              name="thirdRailFields.hours"
              control={control}
              render={({ field }) => (
                <FormInput
                  type="checkbox"
                  className="form-check-input"
                  name={field.name}
                  checked={field.value}
                  disabled={bookingRuleFormData.readOnly}
                  onChange={(event) => {
                    field.onChange({ target: { value: event.target.checked } });
                  }}
                  displayName={'Hours'}
                  required={false}
                />
              )}
            />
          </div>
          <div className="form-field checkbox br">
            <Controller
              name="thirdRailFields.projection"
              control={control}
              render={({ field }) => (
                <FormInput
                  type="checkbox"
                  className="form-check-input"
                  name={field.name}
                  checked={field.value}
                  disabled={bookingRuleFormData.readOnly}
                  onChange={(event) => {
                    field.onChange({ target: { value: event.target.checked } });
                  }}
                  displayName={'Projection'}
                  required={false}
                />
              )}
            />
          </div>
          <div className="form-field checkbox br">
            <Controller
              name="thirdRailFields.staffing_setup"
              control={control}
              render={({ field }) => (
                <FormInput
                  classes={{ root: 'w-100' }}
                  type="checkbox"
                  className="form-check-input"
                  name={field.name}
                  checked={field.value}
                  disabled={bookingRuleFormData.readOnly}
                  onChange={(event) => {
                    field.onChange({ target: { value: event.target.checked } });
                  }}
                  displayName={'Staffing Setup'}
                  required={false}
                />
              )}
            />
          </div>
          <div className="form-field checkbox br">
            <Controller
              name="thirdRailFields.location"
              control={control}
              render={({ field }) => (
                <FormInput
                  type="checkbox"
                  className="form-check-input"
                  name={field.name}
                  checked={field.value}
                  disabled={bookingRuleFormData.readOnly}
                  onChange={(event) => {
                    field.onChange({ target: { value: event.target.checked } });
                  }}
                  displayName={'Location'}
                  required={false}
                />
              )}
            />
          </div>
          <div className="form-field checkbox br">
            <Controller
              name="thirdRailFields.status"
              control={control}
              render={({ field }) => (
                <FormInput
                  type="checkbox"
                  className="form-check-input"
                  name={field.name}
                  checked={field.value}
                  disabled={bookingRuleFormData.readOnly}
                  onChange={(event) => {
                    field.onChange({ target: { value: event.target.checked } });
                  }}
                  displayName={'Status'}
                  required={false}
                />
              )}
            />
          </div>
        </div>
        <GlobalMultiSelect
          label="Add Field"
          disabled={bookingRuleFormData.readOnly}
          data={bookingRuleFormData?.allAuditFields ?? []}
          selectedOptions={getValues('selectedAuditField') ?? []}
          onChange={(e) => {
            setValue(
              'selectedAuditField',
              getValues('selectedAuditField').some((item) => item.id === e.id)
                ? getValues('selectedAuditField').filter(
                    (item) => item.id !== e.id
                  )
                : [...getValues('selectedAuditField'), e]
            );
          }}
          onSelectAll={(data) => {
            setValue('selectedAuditField', data);
          }}
        />
        <div className="form field w-100"></div>

        <div className={`form-field  ${styles.onlineFields}`}>
          <p>Current Lock Lead Time</p>
          <Controller
            name="CurrentLockLeadTimeDto.lead_time"
            control={control}
            render={({ field }) => (
              <FormInput
                classes={{ root: 'w-100' }}
                type="text"
                className="form-control"
                name={field.name}
                value={field.value}
                disabled={bookingRuleFormData.readOnly}
                onChange={(event) => {
                  const inputValue = event.target.value;
                  const numericValue = inputValue.replace(/\D/g, '');
                  const clampedValue = Math.min(999, Math.max(0, numericValue));
                  setValue('CurrentLockLeadTimeDto.effective_date', new Date());
                  field.onChange({ target: { value: clampedValue } });
                }}
                displayName={'Lock Lead Time'}
                required={true}
                error={error?.CurrentLockLeadTimeDto?.lead_time?.message}
              />
            )}
          />

          <div className="field">
            {getValues('CurrentLockLeadTimeDto.effective_date') ? (
              <label
                style={{
                  fontSize: '12px',
                  top: '24%',
                  color: '#555555',
                  zIndex: 1,
                }}
              >
                Effective Date*
              </label>
            ) : (
              ''
            )}
            <Controller
              name="CurrentLockLeadTimeDto.effective_date"
              control={control}
              render={({ field }) => (
                <DatePicker
                  dateFormat="MM/dd/yyyy"
                  className="custom-datepicker"
                  placeholderText="Effective Date*"
                  selected={field.value}
                  disabled={bookingRuleFormData.readOnly}
                  onChange={(date) => {
                    field.onChange({ target: { value: date } });
                  }}
                />
              )}
            />
            {error?.CurrentLockLeadTimeDto?.effective_date && (
              <div className={`error ${styles.errorcolor} ml-1 mt-1`}>
                <p>{error?.CurrentLockLeadTimeDto.effective_date?.message}</p>
              </div>
            )}
          </div>
        </div>

        <div className={`form-field ${styles.onlineFields}`}>
          <p>Schedule Lock Lead Time</p>
          <div className="field">
            <Controller
              name="ScheduleLockLeadTimeDto.lead_time"
              control={control}
              render={({ field }) => (
                <FormInput
                  classes={{ root: 'w-100' }}
                  type="text"
                  className="form-control"
                  name={field.name}
                  value={field.value}
                  disabled={bookingRuleFormData.readOnly}
                  onChange={(event) => {
                    const inputValue = event.target.value;
                    const numericValue = inputValue.replace(/\D/g, '');
                    const clampedValue = Math.min(
                      999,
                      Math.max(0, numericValue)
                    );
                    setValue(
                      'ScheduleLockLeadTimeDto.effective_date',
                      new Date()
                    );
                    field.onChange({ target: { value: clampedValue } });
                  }}
                  displayName={'Lock Lead Time Set'}
                  required={false}
                  error={error?.ScheduleLockLeadTimeDto?.lead_time?.message}
                />
              )}
            />
          </div>

          <div className="field">
            {getValues('ScheduleLockLeadTimeDto.effective_date') ? (
              <label
                style={{
                  fontSize: '12px',
                  top: '24%',
                  color: '#555555',
                  zIndex: 1,
                }}
              >
                Set Effective Date {watchLeadTime && '*'}
              </label>
            ) : (
              ''
            )}

            <Controller
              name="ScheduleLockLeadTimeDto.effective_date"
              control={control}
              render={({ field }) => (
                <DatePicker
                  dateFormat="MM/dd/yyyy"
                  className="custom-datepicker"
                  placeholderText="Effective Date*"
                  selected={field.value}
                  disabled={bookingRuleFormData.readOnly || !watchLeadTime}
                  minDate={new Date()}
                  onChange={(date) => {
                    field.onChange({ target: { value: date } });
                  }}
                />
              )}
            />
          </div>
          {watchLeadTime && error?.ScheduleLockLeadTimeDto?.effective_date && (
            <div className={`error ${styles.errorcolor} ml-1 mt-1`}>
              <p>{error?.ScheduleLockLeadTimeDto?.effective_date?.message}</p>
            </div>
          )}
        </div>

        <div className="form-field">
          <p>Maximum Draw Hours</p>
          <Controller
            name="MaximumDrawHoursDto.hours"
            control={control}
            render={({ field }) => (
              <FormInput
                classes={{ root: 'w-100' }}
                type="number"
                step="1.0"
                min="1.0"
                max="24.0"
                className="form-control"
                name={field.name}
                value={field.value === null ? '' : field.value}
                disabled={bookingRuleFormData.readOnly}
                onChange={(event) => {
                  const inputValue = event.target.value;
                  const numericValue = parseFloat(inputValue);
                  if (!isNaN(numericValue) && numericValue > 24.0) {
                    field.onChange({ target: { value: '24.00' } });
                  } else {
                    field.onChange({ target: { value: inputValue } });
                  }
                }}
                onBlur={(event) => {
                  const inputValue = event.target.value;
                  const numericValue = parseFloat(inputValue);
                  if (
                    isNaN(numericValue) ||
                    numericValue < 1.0 ||
                    numericValue > 24.0
                  ) {
                    field.onChange({ target: { value: '' } });
                  } else {
                    const formattedValue = numericValue.toFixed(2);
                    field.onChange({ target: { value: formattedValue } });
                  }
                }}
                onWheel={(e) => e.target.blur()}
                displayName={'Maximum Draw Hours'}
                required={true}
                error={error?.MaximumDrawHoursDto?.hours?.message}
              />
            )}
          />
        </div>

        <div className={`form-field checkbox ${styles.appointment}`}>
          <Controller
            name="MaximumDrawHoursDto.allow_appointment"
            control={control}
            render={({ field }) => (
              <FormInput
                type="checkbox"
                className="form-check-input"
                classes={{ root: 'w-100' }}
                name={field.name}
                checked={field.value}
                disabled={bookingRuleFormData.readOnly}
                onChange={(event) => {
                  field.onChange({ target: { value: event.target.checked } });
                }}
                displayName={'Allow appointments up to drive end time'}
                required={false}
              />
            )}
          />
        </div>

        <div className={`form-field checkbox w-100 ${styles.inlineCheckboxes}`}>
          <div className={`${styles.headings}`}>
            <p>OEF Block On</p>
            <ToolTip
              text={
                'Efficiency exceptions will require override permission on products or procedures. Select one below.'
              }
            />
          </div>{' '}
          <div className={`${styles.radioBtnGap}`}>
            <Controller
              name="OefBlockOnDto"
              control={control}
              render={({ field }) => (
                <FormRadioButtons
                  label={'Product'}
                  value={'product'}
                  className=""
                  selected={field.value}
                  disabled={bookingRuleFormData.readOnly}
                  handleChange={(event) => {
                    field.onChange({
                      target: { value: event.target.value },
                    });
                  }}
                />
              )}
            />
          </div>
          <div className={`${styles.radioBtnGap}`}>
            <Controller
              name="OefBlockOnDto"
              control={control}
              render={({ field }) => (
                <FormRadioButtons
                  label={'Procedure'}
                  value={'procedures'}
                  className=""
                  selected={field.value}
                  disabled={bookingRuleFormData.readOnly}
                  handleChange={(event) => {
                    field.onChange({
                      target: { value: event.target.value },
                    });
                  }}
                />
              )}
            />
          </div>
        </div>

        <div className={`form-field checkbox w-100 ${styles.inlineCheckboxes}`}>
          <p>Location Qualification</p>
          <div>
            <Controller
              name="LocationQualificationDto.drive_scheduling"
              control={control}
              render={({ field }) => (
                <FormInput
                  type="checkbox"
                  className="form-check-input"
                  classes={{ root: 'w-100' }}
                  name={field.name}
                  checked={field.value}
                  disabled={bookingRuleFormData.readOnly}
                  onChange={(event) => {
                    field.onChange({ target: { value: event.target.checked } });
                  }}
                  displayName={'Require For Drive Scheduling'}
                  required={false}
                />
              )}
            />
          </div>
          <div>
            <Controller
              name="LocationQualificationDto.expires"
              control={control}
              render={({ field }) => (
                <FormInput
                  type="checkbox"
                  className="form-check-input"
                  classes={{ root: 'w-100' }}
                  name={field.name}
                  checked={field.value}
                  disabled={bookingRuleFormData.readOnly}
                  onChange={(event) => {
                    field.onChange({ target: { value: event.target.checked } });
                  }}
                  displayName={'Expires'}
                  required={false}
                />
              )}
            />
          </div>
        </div>

        {watchLocationExpires ? (
          <div className="form-field">
            <div className="field">
              <Controller
                name="LocationQualificationDto.expiration_period"
                control={control}
                render={({ field }) => (
                  <FormInput
                    classes={{ root: 'w-100' }}
                    type="text"
                    className="form-control"
                    name={field.name}
                    value={field.value}
                    disabled={bookingRuleFormData.readOnly}
                    onChange={(event) => {
                      const inputValue = event.target.value;
                      const numericValue = inputValue.replace(/\D/g, null);
                      const clampedValue = Math.min(
                        999,
                        Math.max(0, numericValue)
                      );

                      field.onChange({ target: { value: clampedValue } });
                    }}
                    displayName={'Expiration Period (In Months)'}
                    required={true}
                    error={
                      error?.LocationQualificationDto?.expiration_period
                        ?.message
                    }
                  />
                )}
              />
            </div>
          </div>
        ) : (
          <></>
        )}

        <div className="form-field w-100"></div>

        <div className="form-field">
          <div className={`${styles.headings}`}>
            <p>Sharing</p>
            <ToolTip
              text={
                'This specifies the maximum distance between collection operations that will be offered as sharing options'
              }
            />
          </div>
          <div className="field">
            <Controller
              name="sharingMaxMiles"
              control={control}
              render={({ field }) => (
                <FormInput
                  classes={{ root: 'w-100' }}
                  type="text"
                  className="form-control"
                  name={field.name}
                  value={field.value}
                  disabled={bookingRuleFormData.readOnly}
                  onChange={(event) => {
                    const inputValue = event.target.value;
                    const numericValue = inputValue.replace(/\D/g, null);
                    const clampedValue = Math.min(
                      999,
                      Math.max(0, numericValue)
                    );
                    field.onChange({ target: { value: clampedValue } });
                  }}
                  displayName={'Maximum Miles'}
                  required={true}
                  error={error?.sharingMaxMiles?.message}
                />
              )}
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default BookingRulesForm;
