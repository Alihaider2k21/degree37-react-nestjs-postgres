import React, { useState, useEffect } from 'react';
import { Controller } from 'react-hook-form';
import DatePicker from '../../../../common/DatePicker';
// import styles from '../../drives/index.module.scss';
import SelectDropdown from '../../../../common/selectDropdown';
import FormInput from '../../../../common/form/FormInput';
import GlobalMultiSelect from '../../../../common/GlobalMultiSelect';
import { API } from '../../../../../api/api-routes';
import WarningModalPopUp from '../../../../common/warningModal';

export default function SessionForm({
  control,
  formErrors,
  donorCenterOptions,
  statusOptions,
  promotions,
  selectedPromotions,
  collectionOperation,
  sessionDate,
  setValue,
}) {
  const [closedDatePopup, setClosedDatePopup] = useState(false);

  useEffect(() => {
    const fetchClosedDates = async () => {
      if (!sessionDate || !collectionOperation) return;
      const { data } =
        await API.systemConfiguration.operationAdministrations.calendar.closedDate.getIsClosedDate(
          {
            collectionOperationId: collectionOperation.id,
            date: sessionDate,
          }
        );
      if (data?.closed) {
        setClosedDatePopup(true);
        setValue('session_date', '');
      }
    };

    fetchClosedDates();
  }, [sessionDate, collectionOperation, setValue]);

  const handlePromotionChange = (promotionOption) => {
    let tempPo = [...selectedPromotions];
    tempPo = tempPo.some((item) => item.id === promotionOption.id)
      ? tempPo.filter((item) => item.id !== promotionOption.id)
      : [...tempPo, promotionOption];
    setValue('promotions', tempPo);
  };

  const handlePromotionChangeAll = (data) => setValue('promotions', data);

  return (
    <div className="formGroup">
      <h5>Create Session</h5>
      <Controller
        name="session_date"
        control={control}
        render={({ field }) => (
          <div className="form-field">
            <div className={`field position-relative`}>
              <DatePicker
                startDate={new Date()}
                placeholderText="Session Date*"
                className={'pt-3'}
                selected={field?.value}
                onChange={(e) => {
                  field.onChange(e);
                  setValue('promotions', []);
                }}
                handleBlur={field.onChange}
                showLabel={field?.value}
                isClearable={!!field?.value}
              />
            </div>
            {formErrors.session_date && (
              <div className="error">
                <div className="error">
                  <p>{formErrors.session_date.message}</p>
                </div>
              </div>
            )}
          </div>
        )}
      />
      <Controller
        name="donor_center"
        control={control}
        render={({ field }) => {
          return (
            <SelectDropdown
              styles={{
                root: 'mb-0',
                valueContainer: (_) => ({
                  height: 'unset',
                  overflow: 'unset',
                }),
              }}
              searchable={true}
              placeholder={'Donor Center*'}
              showLabel
              defaultValue={field?.value}
              selectedValue={field?.value}
              removeDivider
              onChange={field.onChange}
              handleBlur={field.onChange}
              options={donorCenterOptions}
              error={formErrors?.donor_center?.message}
            />
          );
        }}
      />
      <div className="w-100">
        <p>Attributes</p>
      </div>
      <div className="form-field">
        <GlobalMultiSelect
          label="Promotion"
          data={promotions}
          selectedOptions={selectedPromotions}
          error={formErrors?.promotions?.message}
          onChange={handlePromotionChange}
          onSelectAll={handlePromotionChangeAll}
          onBlur={() => {}}
        />
      </div>

      <FormInput
        name={'collection_operation'}
        displayName="Collection Operation"
        value={collectionOperation?.name}
        required={false}
        disabled={true}
      />

      <Controller
        name="status"
        control={control}
        render={({ field }) => {
          return (
            <SelectDropdown
              styles={{
                root: 'mb-0',
                valueContainer: (_) => ({
                  paddingTop: 0,
                  height: 'unset',
                  overflow: 'unset',
                }),
              }}
              searchable={true}
              placeholder={'Status*'}
              showLabel
              defaultValue={field?.value}
              selectedValue={field?.value}
              removeDivider
              onChange={field.onChange}
              handleBlur={field.onChange}
              options={statusOptions}
              error={formErrors?.status?.message}
              required
            />
          );
        }}
      />

      <WarningModalPopUp
        title="Warning"
        message={`The selected date is closed. Please try with another date.`}
        modalPopUp={closedDatePopup}
        setModalPopUp={setClosedDatePopup}
        showActionBtns={true}
        confirmAction={() => setClosedDatePopup(false)}
      />
    </div>
  );
}
