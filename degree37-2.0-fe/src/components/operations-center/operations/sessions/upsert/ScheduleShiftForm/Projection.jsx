import React from 'react';
import { Controller } from 'react-hook-form';
import SelectDropdown from '../../../../../common/selectDropdown';
import styles from '../../Session.module.scss';
import InformationIcon from '../../../../../../assets/images/InformationIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import GlobalMultiSelect from '../../../../../common/GlobalMultiSelect';
import {
  faArrowRotateRight,
  faPlus,
  faMinus,
} from '@fortawesome/free-solid-svg-icons';
import { API } from '../../../../../../api/api-routes';

const Projection = ({
  shiftFieldName,
  id,
  index,
  watch,
  viewAs,
  procedureTypes,
  control,
  setValue,
  procedureTypesOptions,
  OEF,
  projectionIndexesLength,
  totalHoursOfShift,
  setProjectionIndexes,
  triggerOEF,
  formErrors,
  shiftIndex,
}) => {
  const [counter, setCounter] = React.useState(1);
  const [staffSetupOptions, setStaffSetupOptions] = React.useState([]);

  const fieldName = `${shiftFieldName}.projections[${index}]`;
  const selectedStaffSetup = watch(`${fieldName}.staff_setup`);
  const errorField = formErrors?.shifts?.[shiftIndex]?.projections?.[index];
  const procedureTypeOption = watch(`${fieldName}.procedure`);
  const procedureType =
    procedureTypeOption &&
    procedureTypes.find((type) => type.id === procedureTypeOption.value);
  const productYield = watch(`${fieldName}.product_yield`);
  const procedureTypeQty = watch(`${fieldName}.procedure_type_qty`) || 0;
  const p = parseInt(viewAs === 'Product' ? productYield : procedureTypeQty);

  const minimumStaff = Math.round(
    p /
      (totalHoursOfShift === 0 || isNaN(totalHoursOfShift)
        ? 1
        : totalHoursOfShift) /
      (OEF.maxOEF === 0 || isNaN(OEF.maxOEF) ? 1 : OEF.maxOEF)
  );
  const maximumStaff = Math.round(
    p /
      (totalHoursOfShift === 0 || isNaN(totalHoursOfShift)
        ? 1
        : totalHoursOfShift) /
      (OEF.minOEF === 0 || isNaN(OEF.minOEF) ? 1 : OEF.minOEF)
  );

  React.useEffect(() => {
    const fetchStaffSetupOptions = async () => {
      const { data } =
        await API.systemConfiguration.staffAdmininstration.staffSetup.getStaffSetupForBlueprint(
          {
            operation_type: 'SESSION',
            procedure_type_id: procedureType?.id,
            minStaff: minimumStaff,
            maxStaff: maximumStaff,
          }
        );
      setStaffSetupOptions(data?.data);
      // FIXME: This is a hack to reset the staff setup value when the procedure type is changed
      // setValue(`${fieldName}.staff_setup`, []);
    };
    if (procedureType) fetchStaffSetupOptions();
  }, [procedureType, minimumStaff, maximumStaff, fieldName, setValue]);

  React.useEffect(() => {
    setValue(
      `${fieldName}.product_yield`,
      procedureType?.procedure_types_products?.[0].quantity
    );
  }, [fieldName, procedureType, setValue]);

  const handleProjection = (parentName, fieldName, value, initialYield) => {
    const procedureTypeProductRatio = 1 / initialYield;
    if (fieldName === 'procedure_type_qty') {
      const newProductYield = value / procedureTypeProductRatio;
      setValue(`${parentName}.product_yield`, newProductYield);
    } else {
      const newProcedureQty = value * procedureTypeProductRatio;
      setValue(`${parentName}.procedure_type_qty`, newProcedureQty);
    }
  };

  const addProjection = () => {
    setProjectionIndexes((prevIndexes) => [...prevIndexes, counter]);
    setCounter((prevCounter) => prevCounter + 1);
  };

  const removeProjection = (index, fieldName) => () => {
    setProjectionIndexes((prevIndexes) => [
      ...prevIndexes.filter((item) => {
        return item !== index;
      }),
    ]);
    setValue(`${fieldName}.procedure`, 0);
    setValue(`${fieldName}.procedure_type_qty`, 0);
    setValue(`${fieldName}.product_yield`, 0);
    setValue(`${fieldName}.staff_setup`, []);
  };

  const resetProjection = (fieldName) => {
    setValue(`${fieldName}.procedure`, '');
    setValue(`${fieldName}.procedure_type_qty`, '');
    setValue(`${fieldName}.product_yield`, '');
    setValue(`${fieldName}.staff_setup`, '');
  };

  const handleDevicesChange = (staffSetups) => {
    let staffsetupsCopy = [...selectedStaffSetup];
    staffsetupsCopy = staffsetupsCopy.some((item) => item.id === staffSetups.id)
      ? staffsetupsCopy.filter((item) => item.id !== staffSetups.id)
      : [...staffsetupsCopy, staffSetups];
    setValue(`${fieldName}.staff_setup`, staffsetupsCopy);
    triggerOEF();
  };

  const handleDevicesChangeAll = (data) => {
    setValue(`${fieldName}.staff_setup`, data);
    triggerOEF();
  };

  return (
    <fieldset name={fieldName} key={fieldName} className="w-100">
      <div className="w-100">
        <p>Projection*</p>
      </div>
      <div className="d-flex justify-content-between">
        <Controller
          name={`${fieldName}.procedure`}
          control={control}
          render={({ field }) => {
            return (
              <div className="form-field">
                <SelectDropdown
                  styles={{ root: 'w-100 mb-0' }}
                  searchable={true}
                  placeholder={'Projection*'}
                  showLabel={field?.value?.value}
                  defaultValue={null}
                  selectedValue={field?.value}
                  removeDivider
                  onChange={field.onChange}
                  handleBlur={field.onChange}
                  options={procedureTypesOptions}
                />
                {errorField && (
                  <div className="error">
                    <p>{errorField?.procedure?.message}</p>
                  </div>
                )}
              </div>
            );
          }}
        />
        {!procedureTypeOption ? null : (
          <div className="form-field">
            <div className="d-flex align-items-center gap-2">
              <div className="d-flex align-items-center w-50">
                <p className={`${styles.badge}`}>{procedureTypeOption.label}</p>
                <Controller
                  name={`${fieldName}.procedure_type_qty`}
                  control={control}
                  render={({ field }) => (
                    <input
                      type="number"
                      min={0}
                      step={1}
                      className={styles.input}
                      defaultValue={1}
                      value={field?.value || 1}
                      onChange={(e) => {
                        handleProjection(
                          fieldName,
                          'procedure_type_qty',
                          e.target.value,
                          procedureType?.procedure_types_products[0].quantity
                        );
                        field?.onChange(e);
                      }}
                    />
                  )}
                />
              </div>
              <div className="d-flex align-items-center text-end w-50 justify-content-end">
                <p className={`${styles.badge}`}>
                  {procedureType?.procedure_types_products[0].products.name}
                </p>
                <Controller
                  name={`${fieldName}.product_yield`}
                  control={control}
                  render={({ field }) => (
                    <input
                      type="number"
                      className={styles.input}
                      min={0}
                      step={1}
                      defaultValue={productYield}
                      value={productYield}
                      onChange={(e) => {
                        handleProjection(
                          fieldName,
                          'product_yield',
                          e.target.value,
                          procedureType?.procedure_types_products[0].quantity
                        );
                        field?.onChange(e);
                      }}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="d-flex justify-content-between">
        <Controller
          name={`${fieldName}.staff_setup`}
          control={control}
          render={({ field }) => {
            return (
              <div className="form-field">
                <GlobalMultiSelect
                  classes={{ errors: 'ms-0' }}
                  label="Staff Setup*"
                  data={staffSetupOptions}
                  selectedOptions={selectedStaffSetup || []}
                  error={errorField?.staff_setup?.message || ''}
                  onChange={handleDevicesChange}
                  onSelectAll={handleDevicesChangeAll}
                  onBlur={() => {}}
                  isquantity={false}
                  quantity={0}
                  disabled={false}
                />
              </div>
            );
          }}
        />
        <div className="form-field d-flex align-self-center justify-content-between">
          <p className="d-flex align-items-center gap-1 align-items-center mb-0">
            <InformationIcon />
            <span className="text-sm">
              OEF requires {`${minimumStaff}-${maximumStaff}`} staff
            </span>
          </p>
          <div>
            <FontAwesomeIcon
              width={15}
              height={15}
              icon={faArrowRotateRight}
              className="mr-3"
              role="button"
              onClick={() => resetProjection(fieldName)}
            />
            {projectionIndexesLength === index + 1 ? (
              <FontAwesomeIcon
                width={15}
                height={15}
                icon={faPlus}
                color="#005375"
                role="button"
                onClick={addProjection}
              />
            ) : (
              <FontAwesomeIcon
                width={15}
                height={15}
                icon={faMinus}
                color="#005375"
                role="button"
                onClick={removeProjection(id, fieldName)}
              />
            )}
          </div>
        </div>
      </div>
    </fieldset>
  );
};

export default Projection;
