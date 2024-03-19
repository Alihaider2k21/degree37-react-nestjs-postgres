import React from 'react';
import FormInput from '../../../system-configuration/users-administration/users/FormInput';
import { Col } from 'react-bootstrap';
import SelectDropdown from '../../../common/selectDropdown';
import styles from './index.scss';
import GlobalMultiSelect from '../../../common/GlobalMultiSelect';
import OrganizationalDropdown from '../../../common/Organization/DropDown';
import OrganizationalPopup from '../../../common/Organization/Popup';

const DynamicComponent = ({
  collectionOperation,
  organizationalLevelData,
  businessUnitsData,
  filterCodeData,
  setFilterFormData,
  filterFormData,
  selectedOptions,
  status,
  accountsData,
  recruitersData,
  qualificationStatus,
  siteTypes,
  applyFilter,
}) => {
  const [isPopupVisible, setPopupVisible] = React.useState();

  const dropDownOptions = {
    collection_operation: collectionOperation,
    business_unit: businessUnitsData,
    organizational_levels: organizationalLevelData,
    staging_facility: organizationalLevelData,
    status: status,
    account: accountsData,
    recruiter: recruitersData,
    qualification_status: qualificationStatus,
    site_type: siteTypes,
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
  const handleCollectionOperationChange = (collectionOperation, field) => {
    setFilterFormData((prevData) => ({
      ...prevData,
      [field.name]: (prevData[field.name] || []).some(
        (item) => item.id === collectionOperation.id
      )
        ? (prevData[field.name] || []).filter(
            (item) => item.id !== collectionOperation.id
          )
        : [...prevData[field.name], collectionOperation],
    }));
  };
  const handleCollectionOperationChangeAll = (data, field) => {
    setFilterFormData((prevData) => ({
      ...prevData,
      [field.name]: data,
    }));
  };

  const handleOrganizationalLevel = (payload) => {
    setPopupVisible(false);
    setFilterFormData({
      ...filterFormData,
      organizational_levels:
        typeof payload === 'string' ? payload : JSON.stringify(payload),
    });
  };

  const renderFormFields = () => {
    return filterCodeData
      .sort((a, b) => a.display_order - b.display_order)
      .map((field) => {
        if (
          field.criteria_type === 'Single_Value' &&
          field.name !== 'organizational_levels'
        ) {
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
        } else if (
          field.criteria_type === 'Single_Value' &&
          field.name === 'organizational_levels'
        ) {
          return (
            <Col key={field.id} lg={3} sm={12} xs={12}>
              <OrganizationalDropdown
                value={filterFormData[field.name]}
                handleClick={() => setPopupVisible(true)}
                handleClear={() => handleOrganizationalLevel('')}
              />
            </Col>
          );
        } else if (field.criteria_type === 'Free_Text') {
          return (
            <Col key={field.id} lg={3} sm={12} xs={12}>
              <FormInput
                label={field.display_name}
                name={field.name}
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
              filterValue.includes(option.id.toString())
            );
            filterValue = selectedOptionss;
          }
          return (
            <Col key={field.id} lg={3} sm={12} xs={12}>
              <GlobalMultiSelect
                data={options}
                selectedOptions={filterValue || []}
                label={field.display_name}
                onChange={(data) =>
                  handleCollectionOperationChange(data, field)
                }
                onSelectAll={(data) =>
                  handleCollectionOperationChangeAll(data, field)
                }
                disabled={selectedOptions}
              />
            </Col>
          );
        }
        return null;
      });
  };
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      applyFilter();
    }
  };
  return (
    <form
      className={styles.donors_centers}
      style={{ paddingBottom: 'unset' }}
      onKeyDown={handleKeyPress}
    >
      <div className="formGroup w-100 border-0 p-0 m-0">
        <div className="row row-gap-2 w-100">
          {filterCodeData ? renderFormFields() : 'Loading...'}
        </div>
      </div>
      <OrganizationalPopup
        value={filterFormData?.organizational_levels}
        showConfirmation={isPopupVisible}
        onCancel={() => setPopupVisible(false)}
        onConfirm={handleOrganizationalLevel}
        heading={'Organization Level'}
        showRecruiters
      />
    </form>
  );
};

export default DynamicComponent;
