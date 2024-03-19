import React from 'react';
import { Col } from 'react-bootstrap';
import styles from './index.scss';
import FormInput from '../../../../system-configuration/users-administration/users/FormInput';
import SelectDropdown from '../../../../common/selectDropdown';
import DatePicker from 'react-datepicker';
import { API } from '../../../../../api/api-routes';
import { toast } from 'react-toastify';
import OrganizationalPopup from '../../../../common/Organization/Popup';
import OrganizationalDropdown from '../../../../common/Organization/DropDown';

const DynamicComponent = ({
  organizationalLevelData,
  eventCategory,
  operationStatus,
  locationOption,
  filterCodeData,
  setFilterFormData,
  filterFormData,
  selectedOptions,
  eventSubCategory,
  setEventSubCategory,
}) => {
  const [isPopupVisible, setPopupVisible] = React.useState();

  const bearerToken = localStorage.getItem('token');
  const dropDownOptions = {
    organizational_levels: organizationalLevelData,
    event_category_id: eventCategory,
    status_id: operationStatus,
    location_id: locationOption,
    event_subcategory_id: eventSubCategory,
  };

  const handleOrganizationalLevel = (payload) => {
    setPopupVisible(false);
    setFilterFormData({
      ...filterFormData,
      organizational_levels:
        typeof payload === 'string' ? payload : JSON.stringify(payload),
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilterFormData({
      ...filterFormData,
      [name]: value,
    });
  };
  const handleSelectChange = (data, name) => {
    const dataValue = data ? data?.value : '';
    setFilterFormData({
      ...filterFormData,
      [name]: dataValue,
    });
  };

  const handleDateChange = (date, fieldName) => {
    const formattedDate =
      date instanceof Date ? date : new Date(date).toLocaleDateString();
    setFilterFormData((prevData) => ({
      ...prevData,
      [fieldName]: formattedDate,
    }));
  };

  const getEventSubCategory = async (eventCategory) => {
    try {
      const { data } = await API.nonCollectionProfiles.eventSubCategory.getAll(
        bearerToken,
        eventCategory,
        true
      );
      const eventSubCategoryData = data?.data?.map((item) => {
        return {
          label: item?.name,
          value: item?.id,
        };
      });
      setEventSubCategory(eventSubCategoryData);
    } catch (error) {
      toast.error(`Failed to fetch`, { autoClose: 3000 });
    }
  };
  const renderFormFields = () => {
    return filterCodeData
      .sort((a, b) => a.display_order - b.display_order)
      .map((field) => {
        if (
          field.criteria_type === 'Single_Value' &&
          field.name !== 'organizational_levels'
        ) {
          let options = dropDownOptions[field.name];
          let filterValue = filterFormData[field.name];
          if (filterValue && typeof filterValue !== 'object') {
            filterValue = {
              label:
                options?.find((option) => option.value == filterValue)?.label ??
                '',
              value: filterValue,
            };
          }
          if (filterValue && Array.isArray(filterValue)) {
            filterValue = {
              label: options.find((option) => option.value == filterValue[0])
                ?.label,
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
                onChange={(data) => {
                  if (field.name == 'event_category_id') {
                    getEventSubCategory(data?.value);
                    handleSelectChange(data, field.name);
                  } else {
                    handleSelectChange(data, field.name);
                  }
                }}
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
                required
                isWidth={true}
                value={filterFormData[field.name]}
                onChange={handleInputChange}
                disabled={selectedOptions}
              />
            </Col>
          );
        } else if (field.criteria_type === 'date') {
          return (
            <Col key={field.id} lg={3} sm={12} xs={12}>
              <DatePicker
                className="custom-datepicker effectiveDate"
                label={field.display_name}
                minDate={new Date()}
                name={field.name}
                placeholderText="Date Range"
                selected={filterFormData[field.name]}
                onChange={(date) => handleDateChange(date, field.name)}
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
      <OrganizationalPopup
        value={filterFormData?.organizational_levels}
        showConfirmation={isPopupVisible}
        onCancel={() => setPopupVisible(false)}
        onConfirm={handleOrganizationalLevel}
        heading={'Organization Level'}
      />
    </form>
  );
};

export default DynamicComponent;
