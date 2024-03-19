import React from 'react';
import FormInput from '../../../system-configuration/users-administration/users/FormInput';
import { Col } from 'react-bootstrap';
import SelectDropdown from '../../../common/selectDropdown';
import styles from './index.scss';
import GlobalMultiSelect from '../../../common/GlobalMultiSelect';
const DynamicComponent = ({
  filterCodeData,
  setFilterFormData,
  filterFormData,
  selectedOptions,
  teams,
  roles,
  donorCenters,
  certifications,
  classifications,
  collectionOperations,
  status,
}) => {
  const dropDownOptions = {
    collection_operation_ids: collectionOperations,
    role_ids: roles,
    team_ids: teams,
    donor_center_ids: donorCenters,
    certification_ids: certifications,
    classification_ids: classifications,
    status: status,
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilterFormData({
      ...filterFormData,
      [name]: value,
    });
  };

  const handleSelectChange = (data, name) => {
    const dataValue = data ? data : '';
    setFilterFormData({
      ...filterFormData,
      [name]: dataValue,
    });
  };

  const handleDataChange = (data, field) => {
    setFilterFormData((prevData) => ({
      ...prevData,
      [field.name]: (prevData[field.name] || []).some(
        (item) => item.id === data.id
      )
        ? (prevData[field.name] || []).filter((item) => item.id !== data.id)
        : [...prevData[field.name], data],
    }));
  };

  const handleDataChangeAll = (data, field) => {
    setFilterFormData((prevData) => ({
      ...prevData,
      [field.name]: data,
    }));
  };

  const renderFormFields = () => {
    return filterCodeData
      .sort((a, b) => a.display_order - b.display_order)
      .map((field) => {
        if (field.criteria_type === 'Single_Value') {
          const options = dropDownOptions[field.name];
          let filterValue = filterFormData[field.name];
          if (filterValue && typeof filterValue !== 'object') {
            filterValue = {
              label: options.find((option) => option.value == filterValue)
                .label,
              value: filterValue,
            };
          }
          if (filterValue && Array.isArray(filterValue)) {
            filterValue = {
              label: options.find((option) => option.value == filterValue[0])
                .label,
              value: filterValue,
            };
          }
          return (
            <Col key={field.id} lg={3} sm={12} xs={12}>
              <SelectDropdown
                styles={{ root: 'w-100' }}
                placeholder={field.display_name}
                name={field.name}
                selectedValue={filterValue}
                disabled={selectedOptions}
                required
                removeDivider
                showLabel={filterFormData[field.name]}
                onChange={(data) => handleSelectChange(data, field.name)}
                options={options}
              />
            </Col>
          );
        } else if (field.criteria_type === 'Free_Text') {
          return (
            <Col key={field.id} lg={3} sm={12} xs={12}>
              <FormInput
                label={field.display_name}
                name={field.name}
                required={false}
                isWidth={true}
                value={filterFormData[field.name]}
                onChange={handleInputChange}
                disabled={selectedOptions}
              />
            </Col>
          );
        } else if (field.criteria_type === 'Multi_Value') {
          const options = dropDownOptions[field.name];
          let filterValue = filterFormData[field.name];
          const isSimpleArray = (arr) => {
            return arr.every((item) => typeof item !== 'object');
          };
          if (filterValue && isSimpleArray(filterValue)) {
            const selectedOptionss = options.filter((option) =>
              filterValue.includes(option?.id?.toString())
            );
            filterValue = selectedOptionss;
          }
          return (
            <Col key={field.id} lg={3} sm={12} xs={12}>
              <GlobalMultiSelect
                data={options}
                selectedOptions={filterValue || []}
                label={field.display_name}
                onChange={(data) => handleDataChange(data, field)}
                onSelectAll={(data) => handleDataChangeAll(data, field)}
                disabled={selectedOptions}
              />
            </Col>
          );
        }
        return null;
      });
  };

  return (
    <form className={styles.donors_centers} style={{ paddingBottom: 'unset' }}>
      <div className="formGroup w-100 border-0 p-0 m-0">
        <div className="row row-gap-2 w-100">
          {filterCodeData ? renderFormFields() : 'Loading...'}
        </div>
      </div>
    </form>
  );
};

export default DynamicComponent;
