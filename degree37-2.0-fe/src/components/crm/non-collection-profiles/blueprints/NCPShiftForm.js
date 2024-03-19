import React, { useEffect, useState } from 'react';
import NcpBlueprintTimerInput from './ncpBlueprintTimerInput';
import SelectDropdown from '../../../common/selectDropdown';
import SvgComponent from '../../../common/SvgComponent';
import FormCheckbox from '../../../common/form/FormCheckBox';
import FormInput from '../../../common/form/FormInput';
import { Controller, useFieldArray } from 'react-hook-form';
import styles from './index.module.scss';
import GlobalMultiSelect from '../../../common/GlobalMultiSelect';
import { API } from '../../../../api/api-routes';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
const NCPShiftForm = ({
  shift,
  setShift,
  setShifts,
  currentNumber,
  shifts,
  handleRemoveShift,
  control,
  removeShift,
  append,
  setValue,
  initialShift,
  getValues,
  errors,
}) => {
  const { id, nonCollectionProfileId } = useParams();
  const [showBreakTime, setShowBreakTime] = useState([]);
  useEffect(() => {
    if (shifts?.length) {
      const arrayCheck = [];
      shifts?.map((sh) => {
        arrayCheck?.push(sh?.showBreakTime);
      });
      setShowBreakTime(arrayCheck);
    }
  }, []);
  const [contactRoleOption, setContactRoleOption] = useState([]);
  const [vehiclesOption, setVehiclesOption] = useState([]);
  const [deviceOption, setDeviceOption] = useState([]);
  const [collectionOperationId, setCollectionOperationId] = useState(null);

  const { append: appendRoles, remove: removeRoles } = useFieldArray({
    control,
    name: `shifts[${currentNumber}].roles`,
  });

  useEffect(() => {
    if (collectionOperationId) {
      fetchVehicles();
      fetchDevices();
      fetchContactRole();
    }
  }, [collectionOperationId]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const getNcp = async () => {
      const { data } =
        await API.nonCollectionProfiles.getNonCollectionProfile.get(
          token,
          nonCollectionProfileId ? nonCollectionProfileId : id
        );

      if (data?.status_code === 200) {
        setCollectionOperationId(data?.data?.collection_operation_id?.id);
      }
    };
    if (id || nonCollectionProfileId) {
      getNcp();
    }
  }, [id, nonCollectionProfileId]);

  const fetchContactRole = async () => {
    const token = localStorage.getItem('token');

    try {
      const { data } = await API.nonCollectionProfiles.getNcpRole(
        token,
        collectionOperationId
      );
      if (data?.data) {
        const contactRoleOptionData = data?.data?.map((item) => ({
          label: item?.name,
          value: item?.id,
        }));

        setContactRoleOption(contactRoleOptionData);
      }
    } catch (e) {
      toast.error(`${e?.message}`, { autoClose: 3000 });
    } finally {
      // setIsLoading(false);
    }
  };

  const fetchVehicles = async () => {
    const token = localStorage.getItem('token');

    try {
      const { data } = await API.nonCollectionProfiles.getNcpVehiclesType(
        token,
        collectionOperationId
      );
      if (data?.data) {
        const vehiclesOptionData = data?.data?.map((item) => {
          return {
            name: item?.name,
            id: item?.id,
          };
        });
        setVehiclesOption(vehiclesOptionData);
      }
    } catch (e) {
      toast.error(`${e?.message}`, { autoClose: 3000 });
    } finally {
      // setIsLoading(false);
    }
  };
  const fetchDevices = async () => {
    const token = localStorage.getItem('token');

    try {
      const { data } = await API.nonCollectionProfiles.getNcpDevicesType(
        token,
        collectionOperationId
      );
      if (data?.data) {
        const deviceOptionData = data?.data?.map((item) => {
          return {
            name: item?.name,
            id: item?.id,
          };
        });
        setDeviceOption(deviceOptionData);
      }
    } catch (e) {
      toast.error(`${e?.message}`, { autoClose: 3000 });
    } finally {
      // setIsLoading(false);
    }
  };
  return (
    <div className="formGroup">
      <div className="w-100 d-flex justify-content-between align-items-center mb-1">
        <h5>Schedule Shift {currentNumber + 1}</h5>
        <div
          className={`bg-primary p-1 d-flex justify-content-center align-items-center rounded ${styles.labelTop}`}
        >
          {currentNumber + 1}
        </div>
      </div>
      <Controller
        name={`shifts[${currentNumber}].startTime`}
        control={control}
        render={({ field }) => (
          <NcpBlueprintTimerInput
            defaultValue={field?.value}
            selectedValue={field?.value}
            value={field?.value}
            onBlur={field.onBlur}
            placeholder="Start Time*"
            onChange={(e) => field.onChange(e)}
            error={errors?.shifts?.[currentNumber]?.startTime?.message}
          />
        )}
      />
      <Controller
        name={`shifts[${currentNumber}].endTime`}
        control={control}
        render={({ field }) => (
          <NcpBlueprintTimerInput
            value={field?.value}
            placeholder="End Time*"
            onBlur={field.onBlur}
            onChange={(e) => field.onChange(e)}
            error={errors?.shifts?.[currentNumber]?.endTime?.message}
          />
        )}
      />
      {shift?.roles?.map((dataRole, index) => (
        <>
          <Controller
            name={`shifts[${currentNumber}].roles[${index}].role`}
            control={control}
            defaultValue={dataRole?.role || ''}
            render={({ field }) => (
              <SelectDropdown
                placeholder={'Role*'}
                defaultValue={field.value}
                selectedValue={field.value}
                onBlur={field.onBlur}
                removeDivider
                options={contactRoleOption}
                showLabel
                onChange={(e) => field.onChange(e)}
                error={
                  errors?.shifts?.[currentNumber]?.roles?.[index]?.role?.message
                }
              />
            )}
          />
          <Controller
            name={`shifts[${currentNumber}].roles[${index}].qty`}
            control={control}
            defaultValue={null}
            render={({ field }) => (
              <FormInput
                name="qty"
                displayName="Qty"
                value={field.value}
                handleBlur={field.onBlur}
                onChange={(e) => field.onChange(e)}
                required
                error={
                  errors?.shifts?.[currentNumber]?.roles?.[index]?.qty?.message
                }
              />
            )}
          />
        </>
      ))}
      <div className="d-flex w-100 justify-content-end align-items-end">
        <button
          type="button"
          className={`bg-transparent ${styles.plusNon}`}
          onClick={() => {
            if (shift?.roles?.length > 1) {
              let newRoles = [...shift.roles];
              newRoles.pop();
              setShift({
                ...shift,
                roles: newRoles,
              });
              removeRoles(shift?.roles?.length - 1);
            }
          }}
        >
          {shift?.roles?.length > 1 ? (
            <SvgComponent name={'TagsMinusIcon'} />
          ) : (
            <SvgComponent name={'TagsMinusIconGray'} />
          )}
        </button>
        <button
          type="button"
          className={`bg-transparent ${styles.plusNon}`}
          onClick={() => {
            setShift({
              ...shift,
              roles: [...shift.roles, { role: null, qty: '' }],
            });
            appendRoles({ role: null, qty: '' });
          }}
        >
          <SvgComponent name={'TagsPlusIcon'} />
        </button>
      </div>
      <div className="form-field">
        <div className="field">
          <Controller
            name={`shifts[${currentNumber}].vehicles_ids`}
            control={control}
            render={({ field }) => (
              <GlobalMultiSelect
                label="Vehicle Setup*"
                data={vehiclesOption}
                selectedOptions={field.value}
                onChange={(selectedItems) => {
                  const currentValue = field.value || [];
                  if (
                    currentValue.some((text) => text.id === selectedItems.id)
                  ) {
                    const updatedValue = field.value.filter(
                      (item) => item.id !== selectedItems.id
                    );
                    field.onChange(updatedValue);
                  } else {
                    field.onChange([...currentValue, selectedItems]);
                  }
                }}
                onSelectAll={(e) => field.onChange(e)}
                onBlur={field.onBlur}
                error={errors?.shifts?.[currentNumber]?.vehicles_ids?.message}
              />
            )}
          />
        </div>
      </div>
      <div className="form-field">
        <div className="field">
          <Controller
            name={`shifts[${currentNumber}].device_ids`}
            control={control}
            render={({ field }) => (
              <GlobalMultiSelect
                label="Device Setup*"
                data={deviceOption}
                selectedOptions={field.value}
                onChange={(selectedItems) => {
                  const currentValue = field.value || [];
                  if (
                    currentValue.some((text) => text.id === selectedItems.id)
                  ) {
                    const updatedValue = field.value.filter(
                      (item) => item.id !== selectedItems.id
                    );
                    field.onChange(updatedValue);
                  } else {
                    field.onChange([...currentValue, selectedItems]);
                  }
                }}
                onSelectAll={(e) => field.onChange(e)}
                onBlur={field.onBlur}
                error={errors?.shifts?.[currentNumber]?.device_ids?.message}
              />
            )}
          />
        </div>
      </div>
      <div className="w-100">
        <Controller
          name={`shifts[${currentNumber}].showBreakTime`}
          control={control}
          render={({ field }) => (
            <FormCheckbox
              displayName="Staff Break"
              checked={field.value}
              classes={{ root: 'w-25' }}
              onChange={(e) => {
                field.onChange(e.target.checked);
                const checkbox = [...showBreakTime];
                checkbox[currentNumber] = e.target.checked;
                setShowBreakTime(checkbox);
              }}
            />
          )}
        />
      </div>
      {getValues()?.shifts[currentNumber]?.showBreakTime && (
        <>
          <Controller
            name={`shifts[${currentNumber}].breakStartTime`}
            control={control}
            defaultValue={shifts[currentNumber]?.shiftBreakStartTime || ''}
            render={({ field }) => (
              <NcpBlueprintTimerInput
                value={field.value ? field.value : ''}
                placeholder="Start Time*"
                onBlur={field.onBlur}
                onChange={(e) => {
                  field.onChange(e);
                }}
                error={errors?.shifts?.[currentNumber]?.breakStartTime?.message}
              />
            )}
          />
          <Controller
            name={`shifts[${currentNumber}].breakEndTime`}
            control={control}
            defaultValue={shift?.shiftBreakEndTime || ''}
            render={({ field }) => (
              <NcpBlueprintTimerInput
                value={field.value ? field.value : ''}
                placeholder="End Time*"
                onBlur={field.onBlur}
                onChange={(e) => field.onChange(e)}
                error={errors?.shifts?.[currentNumber]?.breakEndTime?.message}
              />
            )}
          />
        </>
      )}

      <div className="w-100 mt-3 d-flex justify-content-end">
        {shifts?.length > 1 && (
          <button
            type="button"
            className={`btn btn-primary ${styles.addShift} ${
              shifts?.length === currentNumber + 1 ? 'me-3' : ''
            }`}
            onClick={() => {
              handleRemoveShift(currentNumber);
              removeShift(currentNumber);
            }}
          >
            Remove Shift
          </button>
        )}
        {shifts?.length === currentNumber + 1 && (
          <button
            type="button"
            className={`btn btn-primary ${styles.addShift}`}
            onClick={() => {
              setShifts((prevShifts) => [
                ...prevShifts,
                {
                  ...initialShift,
                  generatedId: Math.random().toString(36).substring(2),
                },
              ]);
              append(initialShift);
            }}
          >
            Add Shift
          </button>
        )}
      </div>
    </div>
  );
};
export default NCPShiftForm;
