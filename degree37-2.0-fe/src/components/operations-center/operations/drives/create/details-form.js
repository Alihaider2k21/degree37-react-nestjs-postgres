import React from 'react';
import { Controller } from 'react-hook-form';
import SelectDropdown from '../../../../common/selectDropdown';
import FormCheckbox from '../../../../common/form/FormCheckBox';
import FormInput from '../../../../common/form/FormInput';
import SvgComponent from '../../../../common/SvgComponent';
import GlobalMultiSelect from '../../../../common/GlobalMultiSelect';

export default function DetailsForm({
  control,
  formErrors,
  customErrors,
  setcustomErrors,
  equipment,
  setEquipment,
  singleEquipmentOption,
  certificationOptions,
  getValues,
}) {
  return (
    <div className="formGroup details">
      <h5 className="col-md-12">Details</h5>
      <div className="w-100">
        <Controller
          name="open_public"
          control={control}
          defaultValue={false}
          render={({ field }) => (
            <FormCheckbox
              name={field.name}
              displayName="Open to Public"
              checked={field.value}
              classes={{ root: 'mt-2' }}
              onChange={(e) => field.onChange(e.target.checked)}
            />
          )}
        />
      </div>
      {equipment?.map((eq, i) => {
        return (
          <React.Fragment key={'equipment' + i}>
            <div className="w-100">
              <p>Equipment</p>
            </div>
            <Controller
              name="Equipment"
              control={control}
              render={({ field }) => {
                return (
                  <SelectDropdown
                    // searchable={true}
                    placeholder={'Equipment*'}
                    showLabel={eq.equipment}
                    selectedValue={eq.equipment}
                    removeDivider
                    removeTheClearCross
                    onChange={(e) => {
                      setcustomErrors((prev) => {
                        return {
                          ...prev,
                          equipment: '',
                        };
                      });
                      setEquipment((prev) => {
                        return prev.map((a, index) =>
                          index === i ? { ...a, equipment: e } : a
                        );
                      });
                    }}
                    handleBlur={(e) => {
                      setEquipment((prev) => {
                        return prev.map((a, index) =>
                          index === i ? { ...a, equipment: e } : a
                        );
                      });
                    }}
                    options={singleEquipmentOption?.filter((item) => {
                      const exitingItems = [];
                      equipment?.map((eItem) => {
                        if (eItem?.equipment?.id)
                          exitingItems.push(eItem?.equipment?.id);
                      });
                      return !exitingItems.includes(item.id);
                    })}
                    error={!eq.equipment && customErrors?.equipment}
                  />
                );
              }}
            />
            <div className="col-md-6">
              <div className="row">
                <div className="col-md-7">
                  <Controller
                    name="quantity"
                    control={control}
                    render={({ field }) => (
                      <FormInput
                        name={'quantity'}
                        classes={{ root: 'w-100' }}
                        type="number"
                        displayName="Quantity*"
                        min={0}
                        max={9999}
                        value={eq.quantity}
                        required={false}
                        error={eq.quantity == '' && customErrors?.quantity}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          const parsedValue = parseInt(inputValue, 10);

                          if (parsedValue <= 9999) {
                            setcustomErrors((prev) => ({
                              ...prev,
                              quantity: '',
                            }));

                            setEquipment((prev) =>
                              prev.map((a, index) =>
                                index === i ? { ...a, quantity: inputValue } : a
                              )
                            );
                          } else {
                            setcustomErrors((prev) => ({
                              ...prev,
                              quantity:
                                'Quantity should be less than or equal to 999',
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
                          setEquipment((prev) => {
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
                        setEquipment((prev) => {
                          return [...prev, { equipment: null, quantity: 0 }];
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
      <div className="w-100 mt-4">
        <p>Certifications</p>
      </div>
      <div className="col-md-6">
        <Controller
          name="certifications"
          control={control}
          classes={{ root: 'w-100' }}
          render={({ field }) => (
            <GlobalMultiSelect
              label="Certifications*"
              data={certificationOptions || []}
              selectedOptions={field?.value || []}
              error={formErrors?.certifications?.message}
              onChange={(e) => {
                field.onChange({
                  target: {
                    value: getValues('certifications').some(
                      (item) => item.id === e.id
                    )
                      ? getValues('certifications').filter(
                          (item) => item.id !== e.id
                        )
                      : [...getValues('certifications'), e],
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
    </div>
  );
}
