import React, { useState } from 'react';
import { Col } from 'react-bootstrap';
import styles from './index.scss';
import { toast } from 'react-toastify';
import { API } from '../../../../api/api-routes';
import SelectDropdown from '../../../common/selectDropdown';
import OrganizationalPopup from './Popup';
import OrganizationalDropDown from '../../../common/Organization/DropDown';

// import { Controller } from 'react-hook-form';
const DynamicComponent = ({
  organizationalLevelData,
  eventCategory,
  operationStatus,
  locationOption,
  filterCodeData,
  setFilterFormData,
  filterFormData,
  selectedOptions,
  productsId,
  setProductsId,
  procedures,
  handleChange,
  onOrganizationalPopUpChange,
}) => {
  const bearerToken = localStorage.getItem('token');
  const [isPopupVisible, setPopupVisible] = useState();
  // const [organizationalPopUp, setOrganizationalPopUp] = useState(false);
  const dropDownOptions = {
    organizational_levels: organizationalLevelData,
    event_category_id: eventCategory,
    status_id: operationStatus,
    location_id: locationOption,
    products: productsId,
  };

  // useEffect(() => {
  //   // Notify parent component when organizationalPopUp changes
  //   onOrganizationalPopUpChange(organizationalPopUp);
  // }, [organizationalPopUp, onOrganizationalPopUpChange]);

  //   const handleInputChange = (e) => {
  //     const { name, value } = e.target;
  //     setFilterFormData({
  //       ...filterFormData,
  //       [name]: value,
  //     });
  //   };
  const handleSelectChange = (data, name) => {
    const dataValue = data ? data?.value : '';
    setFilterFormData({
      ...filterFormData,
      [name]: dataValue,
    });
    if (name === 'procedure_type_id' && !dataValue) {
      handleChange();
    }
  };

  //   const handleDateChange = (date, fieldName) => {
  //     const formattedDate =
  //       date instanceof Date ? date : new Date(date).toLocaleDateString();
  //     setFilterFormData((prevData) => ({
  //       ...prevData,
  //       [fieldName]: formattedDate,
  //     }));
  //   };

  //   const getEventSubCategory = async (eventCategory) => {
  //     try {
  //       const { data } = await API.nonCollectionProfiles.eventSubCategory.getAll(
  //         bearerToken,
  //         eventCategory,
  //         true
  //       );
  //       const eventSubCategoryData = data?.data?.map((item) => {
  //         return {
  //           label: item?.name,
  //           value: item?.id,
  //         };
  //       });
  //       setEventSubCategory(eventSubCategoryData);
  //     } catch (error) {
  //       toast.error(`Failed to fetch`, { autoClose: 3000 });
  //     }
  //   };

  const fetchProductsById = async (productsId) => {
    try {
      const { data } =
        await API.operationCenter.calender.filters.getProductsById(
          bearerToken,
          productsId
        );
      if (data?.data) {
        const byId = data?.data.map((item) => {
          return {
            label: item?.product_name,
            value: item?.product_id,
          };
        });
        // const locationOptionData = data?.data?.procedure_types_products?.map(
        //   (item) => {
        //     return {
        //       label: item?.name,
        //       value: item?.id,
        //     };
        //   }
        // );
        setProductsId(byId);
      }
    } catch (e) {
      toast.error(`${e?.message}`, { autoClose: 3000 });
    } finally {
      // setIsLoading(false);
    }
  };

  const handleOrganizationalLevel = (payload) => {
    setPopupVisible(false);
    setFilterFormData({
      ...filterFormData,
      organization_level_id: JSON.stringify(payload),
    });
  };
  return (
    <form className={styles.donors_centers} style={{ paddingBottom: 'unset' }}>
      <div className="formGroup w-100 border-0 p-0 m-0">
        <div className="row row-gap-2 w-100">
          {/* {filterCodeData ? renderFormFields() : 'Loading...'} */}
          <Col lg={3} sm={12} xs={12}>
            <SelectDropdown
              styles={{ root: 'w-100' }}
              placeholder="Procedures"
              name="procedure_type_id"
              //   selectedValue={filterValue}
              disabled={selectedOptions}
              required
              removeDivider
              //   showLabel="Procedures"
              onChange={(data) => {
                fetchProductsById(data?.value);
                handleSelectChange(data, 'procedure_type_id');
              }}
              options={procedures}
            />
          </Col>
          <Col lg={3} sm={12} xs={12}>
            <SelectDropdown
              styles={{ root: 'w-100' }}
              placeholder="Products"
              name="product_id"
              //   selectedValue={filterValue}
              disabled={selectedOptions}
              required
              removeDivider
              //   showLabel="Procedures"
              onChange={(data) => {
                setProductsId(data?.value);
                handleSelectChange(data, 'product_id');
              }}
              options={dropDownOptions?.products}
            />
          </Col>
          <Col lg={3} sm={12} xs={12}>
            <SelectDropdown
              styles={{ root: 'w-100' }}
              placeholder="Operation Status"
              name="operation_status_id"
              //   selectedValue={filterValue}
              disabled={selectedOptions}
              required
              removeDivider
              //   showLabel="Procedures"
              onChange={(data) => {
                handleSelectChange(data, 'operation_status_id');
              }}
              options={operationStatus}
            />
          </Col>
          <Col lg={3} sm={12} xs={12}>
            <OrganizationalDropDown
              value={filterFormData?.organization_level_id}
              handleClick={() => setPopupVisible(true)}
              handleClear={() =>
                setFilterFormData({
                  ...filterFormData,
                  organization_level_id: '',
                })
              }
            />
            <OrganizationalPopup
              showConfirmation={isPopupVisible}
              value={filterFormData?.organization_level_id}
              onCancel={() => {
                setPopupVisible(false);
              }}
              onConfirm={handleOrganizationalLevel}
              heading={'Organization Level'}
              showRecruiters
            />
          </Col>
        </div>
      </div>
    </form>
  );
};

export default DynamicComponent;
