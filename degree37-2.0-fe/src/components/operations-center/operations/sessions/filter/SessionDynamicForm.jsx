import React from 'react';
import FormInput from '../../../../system-configuration/users-administration/users/FormInput';
import { Col } from 'react-bootstrap';
import SelectDropdown from '../../../../common/selectDropdown';
import styles from './index.scss';
import OrganizationalPopup from '../../../../common/Organization/Popup';
import OrganizationalDropdown from '../../../../common/Organization/DropDown';
import DatePicker from '../../../../common/DatePicker';

const DynamicForm = ({
  filterCodeData,
  setFilterFormData,
  filterFormData,
  selectedOptions,
  status,
  promotions,
}) => {
  const [isPopupVisible, setPopupVisible] = React.useState();
  const options = {
    status_id: status,
    promotion_id: promotions,
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

  const handleOrganizationalLevel = (payload) => {
    setPopupVisible(false);
    setFilterFormData({
      ...filterFormData,
      organizational_levels:
        typeof payload === 'string' ? payload : JSON.stringify(payload),
    });
  };

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setFilterFormData((prevData) => ({
      ...prevData,
      start_date: start,
      end_date: end,
    }));
  };

  const renderFormFields = () => {
    return filterCodeData
      .sort((a, b) => a.display_order - b.display_order)
      .map((field) => {
        if (field.name === 'organizational_levels') {
          return (
            <Col key={field.id} lg={3} sm={12} xs={12}>
              <OrganizationalDropdown
                value={filterFormData[field.name]}
                handleClick={() => setPopupVisible(true)}
                handleClear={() => handleOrganizationalLevel('')}
              />
            </Col>
          );
        } else if (field.name === 'start_date') {
          return (
            <Col key={field.id} lg={3} sm={12} xs={12}>
              <DatePicker
                name={field.name}
                placeholderText={'Date Range'}
                selected={filterFormData['start_date']}
                startDate={filterFormData['start_date']}
                endDate={filterFormData['end_date']}
                onChange={handleDateChange}
                selectsRange
                disabled={selectedOptions}
                isClearable={!selectedOptions}
              />
            </Col>
          );
        } else if (field.criteria_type === 'Multi_Value') {
          const objs = options[field.name].map((opt) => ({
            label: opt.name,
            value: opt.id,
          }));
          return (
            <Col key={field.id} lg={3} sm={12} xs={12}>
              <SelectDropdown
                styles={{ root: 'w-100' }}
                placeholder={field.display_name}
                name={field.name}
                selectedValue={objs.filter(
                  (opt) =>
                    opt.value === filterFormData[field.name]?.value ||
                    opt.value === filterFormData[field.name]
                )}
                options={objs}
                disabled={selectedOptions}
                removeDivider
                showLabel={filterFormData[field.name]}
                onChange={(data) => handleSelectChange(data, field.name)}
              />
            </Col>
          );
        } else if (field.criteria_type === 'Free_Text') {
          return (
            <Col key={field.id} lg={3} sm={12} xs={12}>
              <FormInput
                type="number"
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
        showConfirmation={isPopupVisible}
        onCancel={() => setPopupVisible(false)}
        onConfirm={handleOrganizationalLevel}
        heading={'Organization Level'}
        showDonorCenters
      />
    </form>
  );
};

export default DynamicForm;
