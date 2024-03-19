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
import { makeAuthorizedApiRequest } from '../../../../helpers/Api';
import { toast } from 'react-toastify';
import Select, { components } from 'react-select';
import filterImage from '../../../../assets/images/filterImage.png';
import DynamicComponent from './dynamicForm';
import { IsJson } from '../../../../helpers/IsJson';
import SuccessPopUpModal from '../../../common/successModal';
import ConfirmArchiveIcon from '../../../../assets/images/ConfirmArchiveIcon.png';

function LocationCentersFilters({
  setIsLoading,
  fetchAllStages,
  selectedOptions,
  setSelectedOptions,
}) {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const bearerToken = localStorage.getItem('token');
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [optionsChange, setOptionsChange] = useState(false);
  const [organizationalLevelData, setOrganizationalLevelData] = useState([]);
  const [businessUnitsData, setBusinessUnitsData] = useState([]);
  const [collectionOperation, setCollectionOperation] = useState([]);
  const [selectOptionsData, setSelectOptionsData] = useState([]);
  const [filterCodeData, setFilterCodeData] = useState();
  const [filterFormData, setFilterFormData] = useState();
  const [filterName, setFilterName] = useState('');
  const [appliedFilters, setAppliedFilters] = useState([
    { name: 'Status', identifier: 'status' },
  ]);
  const [showAppliedFilters, setShowAppliedFilters] = useState(true);
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteFilterName, setDeleteFilterName] = useState(null);
  const [archiveSuccess, setArchiveSuccess] = useState(false);
  const [modalPopUp, setModalPopUp] = useState(false);
  const [recruitersData, setRecruiterData] = useState([]);
  const [accountsData, setAccountsData] = useState([]);
  let inputTimer = null;
  useEffect(() => {
    getOrganizationalLevelData();
    getBusinessUnitsData();
    getCollectionOperations();
    getFiltersCode();
    getFilters();
    fetchRecruiters();
    fetchAccounts();
  }, []);
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
      ...(data?.data.map((item) => {
        return { value: item.id, label: item.name };
      }) || []),
    ]);
  };

  const getBusinessUnitsData = async () => {
    const result = await fetch(`${BASE_URL}/business_units`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        method: 'GET',
        authorization: `Bearer ${bearerToken}`,
      },
    });
    const data = await result.json();
    setBusinessUnitsData([
      ...(data?.data.map((item) => {
        return { value: item.id, label: item.name };
      }) || []),
    ]);
  };

  const getCollectionOperations = async () => {
    const result = await makeAuthorizedApiRequest(
      'GET',
      `${BASE_URL}/business_units/collection_operations/list?isFilter=true`
    );
    let { data } = await result.json();
    if (result.ok || result.status === 200) {
      setCollectionOperation([
        ...(data?.map((item) => {
          return { id: parseInt(item.id), name: item.name };
        }) || []),
      ]);
    } else {
      toast.error('Error Fetching Collection Operations', { autoClose: 3000 });
    }
  };

  const getFiltersCode = async () => {
    try {
      const result = await makeAuthorizedApiRequest(
        'GET',
        `${BASE_URL}/filters/crm_locations`
      );
      let { data } = await result.json();
      if (result.ok || result.status === 200) {
        const dataValues = Object.values(data);
        setFilterCodeData(dataValues);
        const initialFormData = {};
        dataValues?.forEach((item) => {
          initialFormData[item.name] = '';
        });
        initialFormData['status'] = 'active';
        setFilterFormData(initialFormData);
      } else {
        toast.error('Error Fetching State', { autoClose: 3000 });
      }
    } catch (error) {
      toast.error('Error Fetching State', { autoClose: 3000 });
    }
  };
  const fetchRecruiters = async () => {
    try {
      const response = await makeAuthorizedApiRequest(
        'GET',
        `${BASE_URL}/tenant-users/recruiters`
      );
      const data = await response.json();
      setRecruiterData([
        ...(data?.data.map((item) => {
          return {
            value: item.id,
            label: item?.first_name + ' ' + item?.last_name,
          };
        }) || []),
      ]);
    } catch (error) {
      console.error('Error While fetching Recruiters:', error);
    }
  };
  const fetchAccounts = async () => {
    try {
      const response = await makeAuthorizedApiRequest(
        'GET',
        `${BASE_URL}/accounts/?fetch_all=true&is_active=true`
      );
      const data = await response.json();
      setAccountsData([
        ...(data?.data.map((item) => {
          return {
            value: item.id,
            label: item?.name,
          };
        }) || []),
      ]);
    } catch (error) {
      console.error('Error While fetching Accounts:', error);
    }
  };

  const getFilters = async () => {
    try {
      const result = await makeAuthorizedApiRequest(
        'GET',
        `${BASE_URL}/filters/single/crm_locations`
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
        application_code: 'crm_locations',
        filter_name: filterName,
      };
      const result = await makeAuthorizedApiRequest(
        'POST',
        `${BASE_URL}/filters`,
        JSON.stringify(apiPayload)
      );
      const apiResult = await result.json();
      if (apiResult.status === 'success' || apiResult.status_code === 201) {
        setShowConfirmationDialog(false);
        getFilters();
        reinitializeState();
        setSelectedOptions('');
        setOptionsChange(false);
        setTimeout(() => {
          setModalPopUp(true);
        }, 600);
      } else if (apiResult.status_code === 400) {
        toast.error(
          `Filter ${filterName} is already used. Please enter a different name.`,
          { autoClose: 3000 }
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleArchiveFilter = async (name) => {
    const result = await makeAuthorizedApiRequest(
      'POST',
      `${BASE_URL}/filters/delete/${deleteId}/crm_locations`
    );
    await result.json();
    if (result.ok || result.status === 200) {
      setDeleteConfirmationModal(false);
      setTimeout(() => {
        setArchiveSuccess(true);
      }, 600);
    } else {
      toast.error('Error Archiving Crm Locations Filters', { autoClose: 3000 });
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
              setDeleteFilterName(rest.data.name);
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
            const filterValue = value.filter_saved_value;
            const parsedValue =
              filterName !== 'organizational_levels' && IsJson(filterValue)
                ? filterValue
                    .replace(/[{}"]/g, '')
                    .split(',')
                    .map((item) => item.trim())
                : filterValue;
            filterFormData[filterName] = parsedValue;
            updatedFilterFormData[filterName] = parsedValue;
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
      dynamicProperties[key] = value;
    }
    if (Object.keys(dynamicProperties).length > 0) {
      const appliedFiltersArray = Object.keys(dynamicProperties).map((key) => ({
        name: snakeCaseToTitleCase(key),
        identifier: key,
      }));

      setAppliedFilters(appliedFiltersArray);
      // setOptionsChange(false);
      setShowAppliedFilters(true);
      clearTimeout(inputTimer);
      inputTimer = setTimeout(async () => {
        setIsLoading(true);
        fetchAllStages(dynamicProperties);
      }, 500);
    } else {
      fetchAllStages(filterFormData);
      setAppliedFilters([]);
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
            collectionOperation={collectionOperation}
            organizationalLevelData={organizationalLevelData}
            businessUnitsData={businessUnitsData}
            stagingFacility={[
              { label: 'Staging Facility', value: null },
              { label: 'Yes', value: true },
              { label: 'No', value: false },
            ]}
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
            siteTypes={[
              {
                value: 'inside',
                label: 'Inside',
              },
              {
                value: 'outside',
                label: 'Outside',
              },
              {
                value: 'inside/outside',
                label: 'Inside/Outside',
              },
            ]}
            qualificationStatus={[
              {
                value: 'qualified',
                label: 'Qualified',
              },
              {
                value: 'expired',
                label: 'Expired',
              },
              {
                value: 'Not Qualified',
                label: 'Not Qualified',
              },
            ]}
            filterCodeData={filterCodeData}
            filterFormData={filterFormData}
            setFilterFormData={setFilterFormData}
            selectedOptions={selectedOptions}
            recruitersData={recruitersData}
            accountsData={accountsData}
            applyFilter={handleFilterApply}
          />
          <div className="w-100 d-flex align-align-items-center justify-content-between mt-2">
            <button
              className={`outlineBtn btn btn-outline-primary py-3 rounded-3  `}
              onClick={() => {
                const hasAnyValue = Object.values(filterFormData).some(
                  (value) => value !== ''
                );
                if (hasAnyValue) {
                  setShowConfirmationDialog(true);
                } else {
                  toast.error(`Atleast one filter is manadatory!`, {
                    autoClose: 3000,
                  });
                }
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
                  <span className="appliedFilterSpan">{item.name}</span>
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
        message={`Filter ${deleteFilterName} is archived.`}
        modalPopUp={archiveSuccess}
        isNavigate={true}
        setModalPopUp={setArchiveSuccess}
        showActionBtns={true}
        onConfirm={() => {}}
        redirectPath="/crm/locations"
      />
      <SuccessPopUpModal
        title="Success!"
        message="Filter saved."
        modalPopUp={modalPopUp}
        // onConfirm={() => {}}
        isNavigate={true}
        setModalPopUp={setModalPopUp}
        showActionBtns={true}
        redirectPath="/crm/locations"
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

export default LocationCentersFilters;
