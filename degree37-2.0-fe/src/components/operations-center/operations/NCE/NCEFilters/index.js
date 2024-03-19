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
// import filterImage from '../../../../assets/images/filterImage.png';
import filterImage from '../../../../../assets/images/filterImage.png';
import ConfirmArchiveIcon from '../../../../../assets/images/ConfirmArchiveIcon.png';
import DynamicComponent from './dynamicForm';
// import { IsJson } from '../../../../helpers/IsJson';
// import { IsJson } from '../../../../../helpers/IsJson';
// import SuccessPopUpModal from '../../../common/successModal';
import SuccessPopUpModal from '../../../../common/successModal';
import { makeAuthorizedApiRequest } from '../../../../../helpers/Api';
import { API } from '../../../../../api/api-routes';
import moment from 'moment';

function NceFilters({
  setIsLoading,
  setSelectedOptions,
  selectedOptions,
  fetchAllStages,
}) {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const bearerToken = localStorage.getItem('token');
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [optionsChange, setOptionsChange] = useState(false);
  const [organizationalLevelData, setOrganizationalLevelData] = useState([]);
  const [eventCategory, setEventCategory] = useState([]);
  const [operationStatus, setOperationStatus] = useState([]);
  // const [selectedOptions, setSelectedOptions] = useState();
  // const [selectedFilterOptions, setSelectedFilterOptions] = useState();
  const [selectOptionsData, setSelectOptionsData] = useState([]);
  const [filterCodeData, setFilterCodeData] = useState();
  const [filterFormData, setFilterFormData] = useState();
  const [filterName, setFilterName] = useState('');
  const [appliedFilters, setAppliedFilters] = useState([]);
  const [showAppliedFilters, setShowAppliedFilters] = useState(false);
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [archiveSuccess, setArchiveSuccess] = useState(false);
  const [modalPopUp, setModalPopUp] = useState(false);
  const [locationOption, setLocationOption] = useState([]);
  const [eventSubCategory, setEventSubCategory] = useState([]);
  let moduleUrl = 'oc_non_collection_events';
  let inputTimer = null;
  useEffect(() => {
    getOrganizationalLevelData();
    getEventCategory();
    fetchOperationStatus();
    fetchLocation();
    getFiltersCode();
    getFilters();
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

  const getOrganizationalLevelData = async () => {
    const result = await fetch(`${BASE_URL}/organizational_levels`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        method: 'GET',
        authorization: `Bearer ${bearerToken}`,
      },
    });
    const data = await result.json();
    setOrganizationalLevelData([
      ...(data?.data?.map((item) => {
        return { value: item.id, label: item.name };
      }) || []),
    ]);
  };

  const fetchLocation = async () => {
    try {
      const { data } =
        await API.nonCollectionProfiles.getCRMLocations(bearerToken);
      if (data?.data) {
        const locationOptionData = data?.data?.map((item) => {
          return {
            label: item?.name,
            value: item?.id,
          };
        });
        setLocationOption(locationOptionData);
      }
    } catch (e) {
      toast.error(`${e?.message}`, { autoClose: 3000 });
    } finally {
      // setIsLoading(false);
    }
  };

  const fetchOperationStatus = async () => {
    try {
      const { data } =
        await API.ocNonCollectionEvents.getAlloperationstatus(bearerToken);
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

  const getEventCategory = async () => {
    try {
      const { data } = await API.nonCollectionProfiles.eventCategory.getAll(
        bearerToken,
        true
      );
      const eventCategory = data?.data?.map((item) => {
        return {
          label: item?.name,
          value: item?.id,
        };
      });
      setEventCategory(eventCategory);
    } catch (error) {
      toast.error(`Failed to fetch`, { autoClose: 3000 });
    }
  };

  const getFiltersCode = async () => {
    try {
      const result = await makeAuthorizedApiRequest(
        'GET',
        `${BASE_URL}/filters/${moduleUrl}`
      );
      let { data } = await result.json();
      if (result.ok || result.status === 200) {
        const dataValues = Object.values(data);
        setFilterCodeData(dataValues);
        const initialFormData = {};
        dataValues?.forEach((item) => {
          initialFormData[item.name] = '';
        });
        setFilterFormData(initialFormData);
      } else {
        // toast.error('Error Fetching Filter', { autoClose: 3000 });
      }
    } catch (error) {
      console.log(error);
      // toast.error('Error Fetching Filter Code', { autoClose: 3000 });
    }
  };

  const getFilters = async () => {
    try {
      const result = await makeAuthorizedApiRequest(
        'GET',
        `${BASE_URL}/filters/single/${moduleUrl}`
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
        application_code: 'oc_non_collection_events',
        filter_name: filterName,
      };
      const data = await makeAuthorizedApiRequest(
        'POST',
        `${BASE_URL}/filters`,
        JSON.stringify(apiPayload)
      );
      const result = await data.json();
      if (result.status_code === 201) {
        setShowConfirmationDialog(false);
        getFilters();
        reinitializeState();
        setSelectedOptions('');
        setOptionsChange(false);
        setTimeout(() => {
          setModalPopUp(true);
        }, 600);
      } else {
        toast.error(result.response, { autoClose: 3000 });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleArchiveFilter = async (name) => {
    const result = await makeAuthorizedApiRequest(
      'POST',
      `${BASE_URL}/filters/delete/${deleteId}/${moduleUrl}`
    );
    await result.json();
    if (result.ok || result.status === 200) {
      setDeleteConfirmationModal(false);
      setTimeout(() => {
        setArchiveSuccess(true);
      }, 600);
    } else {
      // toast.error('Error Archiving Crm Donor Center Filters', {
      //   autoClose: 3000,
      // });
    }
    setDeleteConfirmationModal(false);
    getFilters();
    if (selectedOptions?.value === deleteId) {
      reinitializeState(true);
      setSelectedOptions('');
      setAppliedFilters([]);
      setShowAppliedFilters(false);
    }
  };
  const handleChange = (dropdownOptions) => {
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
            onClick={(e) => {
              e.stopPropagation();
              setDeleteId(rest.data.id);
              setDeleteConfirmationModal(true);
            }}
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
      try {
        const result = await makeAuthorizedApiRequest(
          'GET',
          `${BASE_URL}/filters/single-filters/${selectedOptions?.value}`
        );
        let { data } = await result.json();
        if (result.ok || result.status === 200) {
          let filter = [];
          let updatedFilterFormData = { ...filterFormData };

          for (const value of Object.values(data)) {
            const filterCriteria = value.filter_criteria_id;
            const filterName = filterCriteria.name;
            const filterValue =
              filterCriteria.name === 'date'
                ? new Date(value?.filter_saved_value)
                : value?.filter_saved_value;
            // const parsedValue =
            //   filterName !== 'organizational_levels' && IsJson(filterValue)
            //     ? filterValue
            //         .replace(/[{}"]/g, '')
            //         .split(',')
            //         .map((item) => item.trim())
            //     : filterValue;
            filterFormData[filterName] = filterValue;
            updatedFilterFormData[filterName] = filterValue;
            filter.push({
              name: filterCriteria.display_name,
              identifier: filterName,
            });
          }
          setFilterFormData(updatedFilterFormData);
          setAppliedFilters(filter);
          fetchAllStages(filterFormData);
        } else {
          toast.error('Error Fetching State', { autoClose: 3000 });
        }
      } catch (error) {
        toast.error('Error Fetching State', { autoClose: 3000 });
      }
    };
    if (!selectedOptions?.value) return;
    setIsLoading(true);
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
        setIsLoading(true);
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
    setIsLoading(true);
    fetchAllStages(updatedFormData);
    if (updatedFilters.length <= 0) {
      setSelectedOptions('');
    }
  };

  return (
    <div className="mb-3 filterBar px-0 donors_centersFilters">
      <div className="filterInner">
        <h2>Filters</h2>
        <div className="filter">
          <form className="d-flex align-items-center gap-4 ">
            <div>
              <Select
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    width: '240px',
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
                placeholder="Select Existing Filters"
                closeMenuOnSelect={true}
                hideSelectedOptions={false}
                isClearable={false}
                backspaceRemovesValue={false}
              />
            </div>
            {optionsChange ? (
              <div
                onClick={() => setOptionsChange(false)}
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
                onClick={() => setOptionsChange(true)}
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
            organizationalLevelData={organizationalLevelData}
            eventCategory={eventCategory}
            operationStatus={operationStatus}
            locationOption={locationOption}
            eventSubCategory={eventSubCategory}
            setEventSubCategory={setEventSubCategory}
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
            filterCodeData={filterCodeData}
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
                  // if (selectedOptions) return;
                  const isFilterApplied = appliedFilters.length > 0;
                  reinitializeState(isFilterApplied);
                  setAppliedFilters([]);
                  setSelectedOptions('');
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
      {showAppliedFilters && appliedFilters.length > 0 && !optionsChange && (
        <div className="selectFilters">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex flex-wrap align-items-center gap-3">
              {appliedFilters.map((item, index) => (
                <div
                  key={index}
                  className="appliedFilterContainer d-flex align-items-center gap-2"
                >
                  <span className="appliedFilterSpan">
                    {item.name === 'Location Id'
                      ? 'Location'
                      : item.name === 'Event Category Id'
                      ? 'Event Category'
                      : item.name === 'Event Subcategory Id'
                      ? 'Event Subcategory'
                      : item.name === 'Status Id'
                      ? 'Status'
                      : item.name}
                  </span>
                  <FontAwesomeIcon
                    width={15}
                    height={15}
                    icon={faXmark}
                    style={{ color: '#A3A3A3', cursor: 'pointer' }}
                    onClick={() =>
                      handleSingleFilterDelete(item.identifier, index)
                    }
                  />
                </div>
              ))}
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
                onClick={() => handleArchiveFilter()}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </section>
      <SuccessPopUpModal
        title="Success!"
        message="NCE Filters is archived."
        modalPopUp={archiveSuccess}
        isNavigate={true}
        setModalPopUp={setArchiveSuccess}
        showActionBtns={true}
        redirectPath=""
      />
      <SuccessPopUpModal
        title="Success!"
        message="NCE Filter saved."
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

export default NceFilters;
