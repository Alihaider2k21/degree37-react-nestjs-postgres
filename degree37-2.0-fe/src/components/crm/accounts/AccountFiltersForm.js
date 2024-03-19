import React, { useEffect } from 'react';
import FormInput from '../../system-configuration/users-administration/users/FormInput';
import { Col } from 'react-bootstrap';
import SelectDropdown from '../../common/selectDropdown';
import styles from './accountView.scss';
import OrganizationalDropdown from '../../common/Organization/DropDown';
import OrganizationalPopup from '../../common/Organization/Popup';

import GlobalMultiSelect from '../../common/GlobalMultiSelect';
const AccountFiltersForm = ({
  industryCategoriesData,
  stagesData,
  sourcesData,
  recruitersData,
  territoryData,
  citiesData,
  statesData,
  collectionOperation,
  organizationalLevelData,
  subIndustryCategoriesData,
  filterCodeData,
  setFilterFormData,
  filterFormData,
  selectedOptions,
  status,
}) => {
  const [subIndustryCategories, setsubIndustryCategories] = React.useState([]);
  const [IsRefresh, setIsRefresh] = React.useState(false);

  const dropDownOptions = {
    industry_category: industryCategoriesData,
    industry_subcategory: subIndustryCategoriesData,
    stage: stagesData,
    source: sourcesData,
    territory: territoryData,
    organizational_levels: organizationalLevelData,
    staging_facility: organizationalLevelData,
    status: status,
    recruiter: recruitersData,
    city: citiesData,
    state: statesData,
  };
  const [isPopupVisible, setPopupVisible] = React.useState();

  const handleOrganizationalLevel = (payload) => {
    setPopupVisible(false);
    setFilterFormData({
      ...filterFormData,
      organizational_levels:
        typeof payload === 'string' ? payload : JSON.stringify(payload),
    });
  };

  const handleClickSubCategories = () => {
    if (
      filterFormData['industry_category'] &&
      filterFormData['industry_category']?.length > 0
    ) {
      let industry_subcategories = filterFormData['industry_category']?.map(
        (ele) => {
          let item = dropDownOptions['industry_subcategory'][ele.id];
          if (item) {
            return item?.map((item) => {
              return { id: parseInt(item.id), name: item.name };
            });
          } else {
            return null;
          }
        }
      );
      let result = industry_subcategories?.flat();
      if (industry_subcategories?.flat()?.includes(null)) {
        result = industry_subcategories?.flat()?.filter((n) => n);
      }
      if (result && filterFormData['industry_subcategory']) {
        let isCheck = result?.map((ele) => {
          return filterFormData['industry_subcategory'].find(
            (sub_cat) => sub_cat?.id === ele.id
          );
        });
        setFilterFormData((prevData) => ({
          ...prevData,
          industry_subcategory: isCheck.flat()?.filter((n) => n),
        }));
      }
      if (result && result?.length > 0) {
        setsubIndustryCategories(result);
      }
    } else {
      setsubIndustryCategories([]);
    }
    if (
      filterFormData['industry_category']?.length === 0 &&
      filterFormData['industry_subcategory']
    ) {
      setFilterFormData((prevData) => ({
        ...prevData,
        industry_subcategory: [],
      }));
    }
  };
  const handleCollectionOperationChange = (collectionOperation, field) => {
    setFilterFormData((prevData) => ({
      ...prevData,
      [field.name]: (prevData[field.name] || []).some(
        (item) => item.id === collectionOperation.id
      )
        ? (prevData[field.name] || [])?.filter(
            (item) => item.id !== collectionOperation.id
          )
        : [...prevData[field.name], collectionOperation],
    }));
    setIsRefresh((prev) => !prev);
  };
  useEffect(() => {
    handleClickSubCategories();
  }, [setIsRefresh, IsRefresh]);
  const handleCollectionOperationChangeAll = (data, field) => {
    setFilterFormData((prevData) => ({
      ...prevData,
      [field.name]: data,
    }));
    setIsRefresh((prev) => !prev);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilterFormData({
      ...filterFormData,
      [name]: value,
    });
  };
  const handleSelectChange = (data, name) => {
    setFilterFormData({
      ...filterFormData,
      [name]: data,
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
                ?.label,
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
                searchable={true}
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
                required
                isWidth={true}
                value={filterFormData[field.name]}
                onChange={handleInputChange}
                disabled={selectedOptions}
              />
            </Col>
          );
        } else if (field.criteria_type === 'Multi_Value') {
          let options = dropDownOptions[field.name];
          let filterValue = filterFormData[field.name];
          const isSimpleArray = (arr) => {
            return arr.every((item) => typeof item !== 'object');
          };
          if (
            filterValue &&
            isSimpleArray(filterValue) &&
            field.name !== 'industry_subcategory'
          ) {
            const selectedOptionss =
              field.name === 'industry_subcategory'
                ? subIndustryCategories.filter((option) =>
                    filterValue.includes(option?.id?.toString())
                  )
                : options.filter((option) =>
                    filterValue.includes(option?.id?.toString())
                  );
            filterValue = selectedOptionss;
          }
          return (
            <Col key={field.id} lg={3} sm={12} xs={12}>
              <GlobalMultiSelect
                data={
                  field.name === 'industry_subcategory'
                    ? subIndustryCategories
                    : options
                }
                selectedOptions={filterValue || []}
                label={field.display_name}
                onChange={(data) =>
                  handleCollectionOperationChange(data, field)
                }
                onSelectAll={(data) =>
                  handleCollectionOperationChangeAll(data, field)
                }
                disabled={
                  field.name === 'industry_subcategory' &&
                  !filterFormData['industry_category']
                    ? true
                    : false
                }
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
        showRecruiters
      />
    </form>
  );
};

export default AccountFiltersForm;
