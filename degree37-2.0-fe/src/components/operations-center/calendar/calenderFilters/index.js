import {
  faMinus,
  faPlus,
  faTrashCan,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { faSquareCheck } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import './index.scss';
import { toast } from 'react-toastify';
import Select, { components } from 'react-select';
import filterImage from '../../../../assets/images/filterImage.png';
import ConfirmArchiveIcon from '../../../../assets/images/ConfirmArchiveIcon.png';
import DynamicComponent from './dynamicForm';
// import { IsJson } from '../../../../helpers/IsJson';
import moment from 'moment';
import SuccessPopUpModal from '../../../common/successModal';
// import { makeAuthorizedApiRequest } from '../../../../helpers/Api';
import { API } from '../../../../api/api-routes';
import OrganizationalDropDown from '../../../common/Organization/DropDown';
import OrganizationalPopup from './Popup';
import styles from '../index.module.scss';
import { makeAuthorizedApiRequest } from '../../../../helpers/Api';

function CalenderFilters({
  setIsLoading,
  setSelectedOptions,
  selectedOptions,
  fetchAllStages,
}) {
  // const BASE_URL = process.env.REACT_APP_BASE_URL;
  const bearerToken = localStorage.getItem('token');
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [optionsChange, setOptionsChange] = useState(false);
  const [organizationalLevelData, setOrganizationalLevelData] = useState([]);
  const [procedures, setProcedures] = useState([]);
  const [operationStatus, setOperationStatus] = useState([]);
  const [selectOptionsData, setSelectOptionsData] = useState([]);
  // const [filterCodeData, setFilterCodeData] = useState();
  const [filterFormData, setFilterFormData] = useState();
  const [filterName, setFilterName] = useState('');
  const [appliedFilters, setAppliedFilters] = useState([]);
  const [showAppliedFilters, setShowAppliedFilters] = useState(false);
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const [organizationalPopUp, setOrganizationalPopUp] = useState(false);
  // const [deleteId, setDeleteId] = useState(null);
  const [archiveSuccess, setArchiveSuccess] = useState(false);
  const [modalPopUp, setModalPopUp] = useState(false);
  const [locationOption] = useState([]);
  const [productsId, setProductsId] = useState([]);
  const [checkedIds, setCheckedIds] = useState([]);
  const [showOrganizationLevels, setShowOrganizationLevels] = useState(true);
  const [isPopupVisible, setPopupVisible] = React.useState();
  // let moduleUrl = 'oc_non_collection_events';
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  let inputTimer = null;
  useEffect(() => {
    getProcedures();
    fetchOperationStatus();
    getFiltersCode();
    getFilters();
    getorganizationLevel();
    fetchAllProducts();
    // getSingleFilters();
  }, []);

  const reinitializeState = (makeApiCall = false) => {
    const dynamicProperties = {};
    for (const key in filterFormData) {
      dynamicProperties[key] = '';
    }
    setFilterName('');
    setFilterFormData(dynamicProperties);
    if (makeApiCall) {
      fetchAllStages(dynamicProperties);
    }
  };

  const handleOrganizationalLevel = (payload) => {
    setPopupVisible(false);
    setFilterFormData({
      ...filterFormData,
      organization_level_id: JSON.stringify(payload),
    });
  };
  const handleOrganizationalPopUpChange = (value) => {
    setOrganizationalPopUp(value);
  };

  const fetchOperationStatus = async () => {
    try {
      const { data } =
        await API.operationCenter.calender.filters.getOperationStatus(
          bearerToken
        );
      if (data?.data) {
        const statusOptionData = data?.data?.map((item) => {
          return {
            label: item?.name,
            value: item?.id,
          };
        });
        setOperationStatus(statusOptionData);
      }
    } catch (e) {
      toast.error(`${e?.message}`, { autoClose: 3000 });
    } finally {
      // setIsLoading(false);
    }
  };

  // const getSingleFilters = async () => {
  //   try {
  //     const result = await makeAuthorizedApiRequest(
  //       'GET',
  //       `${BASE_URL}/filters/single/${moduleUrl}`
  //     );
  //     const data = await result.json();
  //     setSelectOptionsData(
  //       Object.values(data?.data).map((item) => {
  //         return { ...item, value: item.id, label: item.name };
  //       }) || []
  //     );
  //   } catch (error) {
  //     console.log(error);
  //     toast.error('Failed to fetch Territory Management', {
  //       autoClose: 3000,
  //     });
  //   }
  // };

  const getProcedures = async () => {
    try {
      const { data } =
        await API.operationCenter.calender.filters.getProcedure(bearerToken);
      const eventCategory = data?.data?.map((item) => {
        return {
          label: item?.name,
          value: item?.id,
        };
      });
      setProcedures(eventCategory);
    } catch (error) {
      toast.error(`Failed to fetch`, { autoClose: 3000 });
    }
  };

  const getorganizationLevel = async () => {
    try {
      const { data } =
        await API.operationCenter.calender.filters.getOrganization(bearerToken);
      setOrganizationalLevelData(data?.data);
      // const eventCategory = data?.data?.map((item) => {
      //   return {
      //     label: item?.name,
      //     value: item?.id,
      //   };
      // });
      // setProcedures(eventCategory);
    } catch (error) {
      toast.error(`Failed to fetch`, { autoClose: 3000 });
    }
  };

  const fetchAllProducts = async () => {
    try {
      const { data } =
        await API.operationCenter.calender.filters.getAllProducts(bearerToken);
      if (data?.data) {
        const products = data?.data?.map((item) => {
          return {
            label: item?.name,
            value: item?.id,
          };
        });
        setProductsId(products);
      }
    } catch (e) {
      toast.error(`${e?.message}`, { autoClose: 3000 });
    } finally {
      // setIsLoading(false);
    }
  };

  const getFiltersCode = async () => {
    // try {
    //   const result = await makeAuthorizedApiRequest(
    //     'GET',
    //     `${BASE_URL}/filters/${moduleUrl}`
    //   );
    //   let { data } = await result.json();
    //   if (result.ok || result.status === 200) {
    //     const dataValues = Object.values(data);
    //     setFilterCodeData(dataValues);
    //     const initialFormData = {};
    //     dataValues?.forEach((item) => {
    //       initialFormData[item.name] = '';
    //     });
    //     setFilterFormData(initialFormData);
    //   } else {
    //     // toast.error('Error Fetching Filter', { autoClose: 3000 });
    //   }
    // } catch (error) {
    //   console.log(error);
    //   // toast.error('Error Fetching Filter Code', { autoClose: 3000 });
    // }
  };

  const getFilters = async () => {
    try {
      const result = await makeAuthorizedApiRequest(
        'GET',
        `${BASE_URL}/operations-center/manage-favorites?page=1&limit=10&is_active=true`
      );
      const data = await result.json();
      setSelectOptionsData(
        Object.values(data?.data).map((item) => {
          return { ...item, value: item.id, label: item.name };
        }) || []
      );
    } catch (error) {
      console.log(error);
      toast.error('Failed to fetch Territory Management', {
        autoClose: 3000,
      });
    }
  };
  const postSelectedFilter = async () => {
    try {
      const newFilterArray = [];
      for (const fieldName in filterFormData) {
        const arrayData =
          Array.isArray(filterFormData[fieldName]) &&
          filterFormData[fieldName]?.length > 0
            ? filterFormData[fieldName]?.map((item) => item.id)
            : filterFormData[fieldName];
        const selectedValue = filterFormData[fieldName]?.value
          ? filterFormData[fieldName]?.value
          : arrayData;
        if (selectedValue) {
          newFilterArray.push({
            name: fieldName,
            filter_saved_value: [selectedValue],
          });
        }
      }
      const apiPayload = {
        filter_Array: newFilterArray,
        filter_name: filterName,
      };
      const transformedObject = {};
      apiPayload?.filter_Array?.forEach((item) => {
        const key = item.name;
        let value = item.filter_saved_value[0];

        // For 'organization_level_id', parse the value from the array
        if (key === 'organization_level_id') {
          value = JSON.parse(value)[0];
        }

        transformedObject[key] = value;
      });
      let payload = {
        ...transformedObject,
        operations_status_id: transformedObject?.operation_status_id,
        location_type: 'Inside',
        operation_type: 'Drives',
        is_active: false,
        is_default: false,
        is_open_in_new_tab: false,
        procedure_id: transformedObject?.procedure_type_id,
        name: filterName,
        alternate_name: 'test',
      };
      delete payload?.procedure_type_id;
      delete payload?.operation_status_id;
      const { data } =
        await API.operationCenter.calender.filters.createFavorite(
          bearerToken,
          payload
        );
      //   const data = await makeAuthorizedApiRequest(
      //     'POST',
      //     `${BASE_URL}/filters`,
      //     JSON.stringify(apiPayload)
      //   );
      //   const result = await data.json();
      if (data?.status_code === 201) {
        setShowConfirmationDialog(false);
        getFilters();
        reinitializeState();
        setSelectedOptions('');
        setOptionsChange(false);
        setTimeout(() => {
          setModalPopUp(true);
        }, 600);
      } else {
        toast.error(data?.response, { autoClose: 3000 });
      }
    } catch (error) {
      console.log(error);
    }
  };
  // const handleArchiveFilter = async (name) => {
  //   const result = await makeAuthorizedApiRequest(
  //     'POST',
  //     `${BASE_URL}/filters/delete/${deleteId}/${moduleUrl}`
  //   );
  //   await result.json();
  //   if (result.ok || result.status === 200) {
  //     setDeleteConfirmationModal(false);
  //     setTimeout(() => {
  //       setArchiveSuccess(true);
  //     }, 600);
  //   } else {
  //     // toast.error('Error Archiving Crm Donor Center Filters', {
  //     //   autoClose: 3000,
  //     // });
  //   }
  //   setDeleteConfirmationModal(false);
  //   getFilters();
  //   getSingleFilters();
  //   if (selectedOptions?.value === deleteId) {
  //     reinitializeState(true);
  //     setSelectedOptions('');
  //     setAppliedFilters([]);
  //     setShowAppliedFilters(false);
  //   }
  // };
  const handleChange = (dropdownOptions) => {
    if (Array.isArray(dropdownOptions)) {
      let obj = {
        value: dropdownOptions,
        name: 'organization_level_id',
      };
      if (obj?.name !== selectedOptions?.name) {
        setShowAppliedFilters(true);
        setAppliedFilters([]);
        setSelectedOptions(obj);
      } else if (obj?.name === selectedOptions?.name) {
        reinitializeState(true);
        setShowAppliedFilters(false);
        setAppliedFilters([]);
        setSelectedOptions('');
      }
    } else {
      if (dropdownOptions?.name !== selectedOptions?.name) {
        setShowAppliedFilters(true);
        setAppliedFilters([]);
        setSelectedOptions(dropdownOptions);
      } else if (dropdownOptions?.name === selectedOptions?.name) {
        reinitializeState(true);
        setShowAppliedFilters(false);
        setAppliedFilters([]);
        setSelectedOptions('');
      }
    }
    setOrganizationalPopUp(false);
  };

  const Option = ({
    getStyles,
    Icon,
    isDisabled,
    isFocused,
    isSelected,
    children,
    innerProps,
    ...rest
  }) => {
    const style = {
      alignItems: 'center',
      backgroundColor: 'transparent',
      color: '#2D2D2E',
      fontSize: '16px',
      display: 'flex',
      justifyContent: 'space-between',
    };

    // prop assignments
    const props = {
      ...innerProps,
      style,
    };

    return (
      <components.Option
        {...rest}
        isDisabled={isDisabled}
        isFocused={isFocused}
        isSelected={isSelected}
        getStyles={getStyles}
        innerProps={props}
      >
        {children}
        <div className="d-flex align-items-center gap-2">
          <FontAwesomeIcon
            width={15}
            height={15}
            icon={faSquareCheck}
            style={
              rest.data?.value === selectedOptions?.value
                ? { color: '#5ca044', cursor: 'pointer' }
                : { color: '#D9D9D9', cursor: 'pointer' }
            }
          />
          <FontAwesomeIcon
            width={15}
            height={15}
            icon={faTrashCan}
            style={{ color: '#ff1e1e', cursor: 'pointer' }}
            // onClick={(e) => {
            //   e.stopPropagation();
            //   setDeleteId(rest.data.id);
            //   setDeleteConfirmationModal(true);
            // }}
          />
        </div>
      </components.Option>
    );
  };
  const handleConfirmationResult = (confirmed) => {
    if (confirmed) {
      if (filterName) {
        postSelectedFilter();
      } else {
        toast.error(`Filter Name is mandatory!`, { autoClose: 3000 });
      }
    } else {
      setShowConfirmationDialog(false);
    }
  };

  const snakeCaseToTitleCase = (str) => {
    return str
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  useEffect(() => {
    reinitializeState();
    const fetchSubFilters = async () => {
      setAppliedFilters(selectedOptions);
      try {
        const result = await makeAuthorizedApiRequest(
          'GET',
          `${BASE_URL}/operations-center/manage-favorites/${selectedOptions?.value}`
        );
        let { data } = await result.json();
        if (data) {
          const keysToExtract = [
            'organization_level_id',
            'product_id',
            'procedure_id',
            'operations_status_id',
          ];
          const resultArray = keysToExtract
            .map((key) => {
              if (data[key] && data[key].id) {
                return {
                  name: key
                    .replace(/_/g, ' ')
                    .replace(/\b\w/g, (firstChar) => firstChar.toUpperCase()),
                  identifier: key,
                };
              }
              return null; // To handle cases where the condition isn't met
            })
            .filter(Boolean); // To filter out null values from the array
          let dataD = {
            product_id: data?.product_id ? data?.product_id?.id : '',
            operation_status_id: data?.operations_status_id
              ? data?.operations_status_id?.id
              : '',
            organization_level_id: data?.organization_level_id
              ? JSON.stringify([data?.organization_level_id?.id])
              : '',
            procedure_id: data?.procedure_id ? data?.procedure_id?.id : '',
          };
          setFilterFormData(dataD);
          setAppliedFilters(resultArray);
          fetchAllStages(dataD);
        } else {
          toast.error('Error Fetching State', { autoClose: 3000 });
        }
      } catch (error) {
        toast.error('Error Fetching State', { autoClose: 3000 });
      }
    };
    if (!selectedOptions?.value) return;
    // setIsLoading(true);
    fetchSubFilters();
  }, [selectedOptions]);

  const handleFilterApply = () => {
    const dynamicProperties = {};
    for (const key in filterFormData) {
      const value = filterFormData[key];
      if (Array.isArray(value) && value.length === 0) {
        continue;
      } else if (value === '') {
        continue;
      }
      if (key == 'date') {
        const formattedDate = moment(value).format('YYYY-MM-DD').trim();
        dynamicProperties[key] = formattedDate;
      } else {
        dynamicProperties[key] = value;
      }
    }
    if (Object.keys(dynamicProperties).length > 0) {
      const appliedFiltersArray = Object.keys(dynamicProperties).map((key) => ({
        name: snakeCaseToTitleCase(key),
        identifier: key,
      }));
      setAppliedFilters(appliedFiltersArray);
      setOptionsChange(false);
      setShowAppliedFilters(true);
      clearTimeout(inputTimer);
      inputTimer = setTimeout(async () => {
        // setIsLoading(true);
        fetchAllStages(dynamicProperties);
      }, 500);
    } else {
      toast.error(`Atleast one filter is manadatory!`, {
        autoClose: 3000,
      });
    }
  };
  const handleSingleFilterDelete = (ind) => {
    const updatedFilters = appliedFilters.filter(
      (filter) => filter.identifier !== ind
    );
    setAppliedFilters(updatedFilters);
    const updatedFormData = { ...filterFormData };
    updatedFormData[ind] = '';
    setFilterFormData(updatedFormData);
    // setIsLoading(true);
    fetchAllStages(updatedFormData);
    if (updatedFilters.length <= 0) {
      setSelectedOptions('');
    }
  };

  const handleCheckboxChange = (id) => {
    const isChecked = checkedIds.includes(id);
    let updatedIds;

    if (isChecked) {
      updatedIds = checkedIds.filter((checkedId) => checkedId !== id);
    } else {
      updatedIds = [...checkedIds, id];
    }

    setCheckedIds(updatedIds);
  };

  return (
    <div className="mb-3 filterBar px-0 donors_centersFilters">
      <div className="filterInner">
        <h2>Filters</h2>
        <div className="filter">
          <form className="d-flex align-items-center gap-4 ">
            <div style={{ width: '276px', border: '8px' }}>
              <Select
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    borderRadius: '8px',
                  }),
                }}
                className="react-select-container"
                classNamePrefix="react-select"
                value={selectedOptions}
                options={selectOptionsData}
                components={{
                  Option,
                }}
                onChange={handleChange}
                placeholder="Favorite"
                closeMenuOnSelect={true}
                hideSelectedOptions={false}
                isClearable={false}
                backspaceRemovesValue={false}
              />
            </div>
            {showOrganizationLevels && (
              <>
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
                  value={filterFormData?.organization_level_id}
                  showConfirmation={isPopupVisible}
                  onCancel={() => {
                    setPopupVisible(false);
                  }}
                  onConfirm={handleOrganizationalLevel}
                  heading={'Organization Level'}
                  showRecruiters
                />
              </>
            )}
            {optionsChange ? (
              <div
                onClick={() => {
                  setShowOrganizationLevels(true);
                  setOptionsChange(false);
                }}
                className="cursor-pointer icon-container d-flex align-items-center gap-2"
              >
                <span className="more-options">Hide Options</span>
                <FontAwesomeIcon
                  width={15}
                  height={15}
                  icon={faMinus}
                  color="#005375"
                />
              </div>
            ) : (
              <div
                onClick={() => {
                  setShowOrganizationLevels(false);
                  setOptionsChange(true);
                }}
                className="cursor-pointer icon-container flex align-items-center gap-2"
              >
                <span className="more-options">More Options</span>
                <FontAwesomeIcon
                  width={15}
                  height={15}
                  icon={faPlus}
                  color="#005375"
                />
              </div>
            )}
          </form>
        </div>
      </div>
      {optionsChange ? (
        <div className="selectFilters">
          <DynamicComponent
            procedures={procedures}
            onOrganizationalPopUpChange={handleOrganizationalPopUpChange}
            organizationalLevelData={organizationalLevelData}
            setOrganizationalPopUp={setOrganizationalPopUp}
            operationStatus={operationStatus}
            handleChange={fetchAllProducts}
            locationOption={locationOption}
            productsId={productsId}
            setProductsId={setProductsId}
            status={[
              {
                value: 'active',
                label: 'Active',
              },
              {
                value: 'inactive',
                label: 'Inactive',
              },
            ]}
            // filterCodeData={filterCodeData}
            filterFormData={filterFormData}
            setFilterFormData={setFilterFormData}
            selectedOptions={selectedOptions}
          />
          <div className="w-100 d-flex align-align-items-center justify-content-between mt-2">
            <button
              className={`outlineBtn btn btn-outline-primary py-3 rounded-3  `}
              onClick={() => {
                // const hasAnyValue = Object?.values(filterFormData)?.some(
                //   (value) => value !== ''
                // );
                // if (hasAnyValue) {
                setShowConfirmationDialog(true);
                // }
              }}
              disabled={selectedOptions}
            >
              Save as New Filter
            </button>
            <div className="d-flex align-items-center gap-3">
              <div
                className="clearFilterBtn"
                onClick={() => {
                  if (selectedOptions) return;
                  const isFilterApplied = appliedFilters.length > 0;
                  reinitializeState(isFilterApplied);
                  setAppliedFilters([]);
                }}
              >
                Clear
              </div>
              <button
                type="button"
                className={`btn btn-primary py-3 rounded-3  `}
                style={{ paddingLeft: '32px', paddingRight: '32px' }}
                onClick={handleFilterApply}
                disabled={selectedOptions}
              >
                Filter Data
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {showAppliedFilters &&
        (appliedFilters.length > 0 || appliedFilters?.value?.length) &&
        !optionsChange && (
          <div className="selectFilters">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex flex-wrap align-items-center gap-3">
                {Array.isArray(appliedFilters) ? (
                  appliedFilters.map((item, index) => (
                    <div
                      key={index}
                      className="appliedFilterContainer d-flex align-items-center gap-2"
                    >
                      <span className="appliedFilterSpan">
                        {item.name === 'Procedure Type Id'
                          ? 'Procedure Type'
                          : item.name === 'Product Id'
                          ? 'Product'
                          : item.name === 'Operations Status Id'
                          ? 'Operation Status'
                          : item.name === 'Organization Level Id'
                          ? 'Organization Level'
                          : item.name}
                      </span>
                      <FontAwesomeIcon
                        width={15}
                        height={15}
                        icon={faXmark}
                        style={{ color: '#A3A3A3', cursor: 'pointer' }}
                        onClick={() =>
                          handleSingleFilterDelete(item?.identifier, index)
                        }
                      />
                    </div>
                  ))
                ) : (
                  <div className="appliedFilterContainer d-flex align-items-center gap-2">
                    <span className="appliedFilterSpan">
                      Organization Level
                    </span>
                    <FontAwesomeIcon
                      width={15}
                      height={15}
                      icon={faXmark}
                      style={{ color: '#A3A3A3', cursor: 'pointer' }}
                      //   onClick={() =>
                      //     handleSingleFilterDelete(item.identifier, index)
                      //   }
                    />
                  </div>
                )}
              </div>
              <div
                className="clearAllFiltersTxt"
                onClick={() => {
                  reinitializeState(true);
                  setSelectedOptions('');
                  setAppliedFilters([]);
                  setShowAppliedFilters(false);
                }}
              >
                Clear All Filters
              </div>
            </div>
          </div>
        )}
      <section
        className={`popup full-section ${
          deleteConfirmationModal ? 'active' : ''
        }`}
      >
        <div className="popup-inner">
          <div className="icon">
            <img src={ConfirmArchiveIcon} alt="CancelIcon" />
          </div>
          <div className="content">
            <h3>Confirmation</h3>
            <p>Are you sure you want to archive?</p>
            <div className="buttons">
              <button
                className="btn btn-secondary"
                onClick={() => setDeleteConfirmationModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                // onClick={() => handleArchiveFilter()}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </section>
      {organizationalPopUp ? (
        <section
          className={`calendarPoup full-section ${
            organizationalPopUp ? 'show-info' : 'hide-info'
          } popup ${organizationalPopUp ? 'active' : ''}`}
        >
          <div
            className="popup-inner"
            style={{ maxWidth: '850px', padding: '30px', position: 'relative' }}
          >
            <div className="content">
              <div className={styles.popupHeader}>
                <span className={styles.orgTitle}>Organization Level</span>
              </div>
              <div>
                {organizationalLevelData?.map((item) => (
                  <>
                    <div
                      key={item?.id}
                      className={`form-field mb-3 pb-2 w-100 ${styles.checkbox} ${styles.formFeild}`}
                    >
                      <span
                        data-bs-toggle="collapse"
                        href="#collapseExample"
                        aria-expanded="false"
                        aria-controls="collapseExample"
                        style={{ marginRight: '10px' }}
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            id="Union"
                            d="M10.6641 5.20004H6.66406V0.836404C6.66406 0.643519 6.59382 0.458534 6.4688 0.322144C6.34378 0.185754 6.17421 0.109131 5.9974 0.109131C5.82058 0.109131 5.65102 0.185754 5.52599 0.322144C5.40097 0.458534 5.33073 0.643519 5.33073 0.836404V5.20004H1.33073C1.15392 5.20004 0.984349 5.27666 0.859325 5.41305C0.734301 5.54944 0.664063 5.73443 0.664062 5.92731C0.664063 6.1202 0.734301 6.30518 0.859325 6.44157C0.984349 6.57796 1.15392 6.65459 1.33073 6.65459H5.33073V11.0182C5.33073 11.2111 5.40097 11.3961 5.52599 11.5325C5.65102 11.6689 5.82058 11.7455 5.9974 11.7455C6.17421 11.7455 6.34378 11.6689 6.4688 11.5325C6.59382 11.3961 6.66406 11.2111 6.66406 11.0182V6.65459H10.6641C10.8409 6.65459 11.0104 6.57796 11.1355 6.44157C11.2605 6.30518 11.3307 6.1202 11.3307 5.92731C11.3307 5.73443 11.2605 5.54944 11.1355 5.41305C11.0104 5.27666 10.8409 5.20004 10.6641 5.20004Z"
                            fill="#005375"
                          />
                        </svg>
                      </span>
                      <input
                        className="form-check-input mt-0 "
                        type="checkbox"
                        onChange={() => handleCheckboxChange(item?.id)}
                        checked={checkedIds.includes(item?.id)}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="flexCheckDefault"
                      >
                        {item?.name}
                      </label>
                    </div>
                    {item?.parent_level ? (
                      <div
                        style={{ marginLeft: '50px' }}
                        key={item?.parent_level?.id}
                        id="collapseExample"
                        className={`form-field mb-3 pb-2 w-100 collapse ${styles.checkbox} ${styles.formFeild}`}
                      >
                        <span style={{ marginRight: '10px' }}>
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              id="Union"
                              d="M10.6641 5.20004H6.66406V0.836404C6.66406 0.643519 6.59382 0.458534 6.4688 0.322144C6.34378 0.185754 6.17421 0.109131 5.9974 0.109131C5.82058 0.109131 5.65102 0.185754 5.52599 0.322144C5.40097 0.458534 5.33073 0.643519 5.33073 0.836404V5.20004H1.33073C1.15392 5.20004 0.984349 5.27666 0.859325 5.41305C0.734301 5.54944 0.664063 5.73443 0.664062 5.92731C0.664063 6.1202 0.734301 6.30518 0.859325 6.44157C0.984349 6.57796 1.15392 6.65459 1.33073 6.65459H5.33073V11.0182C5.33073 11.2111 5.40097 11.3961 5.52599 11.5325C5.65102 11.6689 5.82058 11.7455 5.9974 11.7455C6.17421 11.7455 6.34378 11.6689 6.4688 11.5325C6.59382 11.3961 6.66406 11.2111 6.66406 11.0182V6.65459H10.6641C10.8409 6.65459 11.0104 6.57796 11.1355 6.44157C11.2605 6.30518 11.3307 6.1202 11.3307 5.92731C11.3307 5.73443 11.2605 5.54944 11.1355 5.41305C11.0104 5.27666 10.8409 5.20004 10.6641 5.20004Z"
                              fill="#005375"
                            />
                          </svg>
                        </span>
                        <input
                          className="form-check-input mt-0 "
                          type="checkbox"
                          onChange={() => handleCheckboxChange(item?.id)}
                          checked={checkedIds.includes(item?.id)}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="flexCheckDefault"
                        >
                          {item?.parent_level?.name}
                        </label>
                      </div>
                    ) : (
                      ''
                    )}
                  </>
                ))}
              </div>
            </div>
            <div
              className="d-flex justify-content-end"
              style={{ position: 'absolute', bottom: '30px', right: '30px' }}
            >
              <div
                className={styles.cancelBtn}
                onClick={() => setOrganizationalPopUp(false)}
              >
                Cancel
              </div>
              <div
                // onClick={() => handleChange(checkedIds)}
                className={styles.applyBtn}
              >
                Apply
              </div>
            </div>
          </div>
        </section>
      ) : null}
      <SuccessPopUpModal
        title="Success!"
        message="Calender Filters is archived."
        modalPopUp={archiveSuccess}
        isNavigate={true}
        setModalPopUp={setArchiveSuccess}
        showActionBtns={true}
        redirectPath=""
      />
      <SuccessPopUpModal
        title="Success!"
        message="Calender Filter saved."
        modalPopUp={modalPopUp}
        redirectPath=""
        // onConfirm={() => {}}
        isNavigate={true}
        setModalPopUp={setModalPopUp}
        showActionBtns={true}
        // onConfirm={() => {}}
      />
      <section
        className={`popup full-section ${
          showConfirmationDialog ? 'active' : ''
        }`}
      >
        <div
          className="popup-inner"
          style={{ maxWidth: '475px', width: '475px' }}
        >
          <div className="icon">
            <img src={filterImage} className="bg-white" alt="CancelIcon" />
          </div>
          <div className="content">
            <h3>Save as New Filter</h3>
            <p>Enter a name for this filter.</p>
            <input
              type="text"
              className="nameInputField w-100 bg-white mt-5 rounded-3 "
              placeholder="Type Name"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
            />
            <div className="buttons">
              <button
                className="btn btn-secondary"
                style={{ width: '45%', color: '#387de5' }}
                onClick={() => handleConfirmationResult(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                style={{ width: '45%' }}
                onClick={() => handleConfirmationResult(true)}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CalenderFilters;
