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
import { makeAuthorizedApiRequest } from '../../../../../helpers/Api';
import { toast } from 'react-toastify';
import Select, { components } from 'react-select';
import filterImage from '../../../../../assets/images/filterImage.png';
import ConfirmationIcon from '../../../../../assets/images/confirmation-image.png';
import DynamicForm from './SessionDynamicForm';
import SuccessPopUpModal from '../../../../common/successModal';

function SessionFilter({
  setLoading,
  fetchAllFilters,
  selectedOptions,
  setSelectedOptions,
  status,
  promotions,
}) {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [optionsChange, setOptionsChange] = useState(false);
  const [selectOptionsData, setSelectOptionsData] = useState([]);
  const [filterFormData, setFilterFormData] = useState();
  const [filterCodeData, setFilterCodeData] = useState();
  const [filterName, setFilterName] = useState('');
  const [appliedFilters, setAppliedFilters] = useState([]);
  const [showAppliedFilters, setShowAppliedFilters] = useState(false);
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [archiveSuccess, setArchiveSuccess] = useState(false);
  const [modalPopUp, setModalPopUp] = useState(false);
  let inputTimer = null;

  useEffect(() => {
    getFilters();
    getFiltersCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchSubFilters = async () => {
      try {
        const result = await makeAuthorizedApiRequest(
          'GET',
          `${BASE_URL}/filters/single-filters/${selectedOptions?.value}`
        );
        let { data } = await result.json();
        if (result.ok || result.status === 200) {
          let filters = [];
          let updatedFilterFormData = { ...filterFormData };

          for (const value of Object.values(data)) {
            const filterCriteria = value.filter_criteria_id;
            const filterName = filterCriteria.name;
            const filterValue = value.filter_saved_value;
            const parsedValue = ['start_date', 'end_date'].includes(filterName)
              ? new Date(filterValue)
              : Array.isArray(filterValue)
              ? filterValue[0]
              : filterValue;
            filterFormData[filterName] = parsedValue;
            updatedFilterFormData[filterName] = parsedValue;
            let name = filterCriteria.display_name;
            if (filterName.includes('date')) name = name.split(' ')[1];
            if (filters.every((item) => item.name !== name))
              filters.push({
                name,
                identifier: filterName.includes('date') ? 'date' : filterName,
              });
          }
          setFilterFormData(updatedFilterFormData);
          setAppliedFilters(filters);
          fetchAllFilters(filterFormData);
        } else {
          toast.error('Error Fetching State', { autoClose: 3000 });
        }
      } catch (error) {
        toast.error('Error Fetching State', { autoClose: 3000 });
      }
    };

    reinitializeState();
    if (!selectedOptions?.value) return;
    setLoading(true);
    fetchSubFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOptions]);

  const getFilters = async () => {
    try {
      const result = await makeAuthorizedApiRequest(
        'GET',
        `${BASE_URL}/filters/single/sessions`
      );
      const data = await result.json();
      setSelectOptionsData(
        Object.values(data?.data).map((item) => {
          return { ...item, value: item.id, label: item.name };
        }) || []
      );
    } catch (error) {
      console.log(error);
      toast.error('Failed to fetch Filters', {
        autoClose: 3000,
      });
    }
  };

  const getFiltersCode = async () => {
    try {
      const result = await makeAuthorizedApiRequest(
        'GET',
        `${BASE_URL}/filters/sessions`
      );
      let { data } = await result.json();
      if (result.ok || result.status === 200) {
        const dataValues = Object.values(data);
        setFilterCodeData(dataValues);
        let initialFormData = {};
        dataValues?.forEach((item) => {
          if (item.name.includes('date')) {
            initialFormData[item.name] = null;
          } else initialFormData[item.name] = '';
        });
        setFilterFormData(initialFormData);
      } else {
        toast.error('Error Fetching State', { autoClose: 3000 });
      }
    } catch (error) {
      toast.error('Error Fetching State', { autoClose: 3000 });
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
        application_code: 'sessions',
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
      `${BASE_URL}/filters/delete/${deleteId}/sessions`
    );
    await result.json();
    if (result.ok || result.status === 200) {
      setDeleteConfirmationModal(false);
      setTimeout(() => {
        setArchiveSuccess(true);
      }, 600);
    } else {
      toast.error('Error Archiving Filter', { autoClose: 3000 });
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
      if (key.includes('date')) {
        dynamicProperties[key] = null;
      } else if (key.includes('id')) {
        dynamicProperties[key] = null;
      } else dynamicProperties[key] = '';
    }
    setFilterName('');
    setFilterFormData(dynamicProperties);
    if (makeApiCall) {
      fetchAllFilters(dynamicProperties);
    }
  };

  const snakeCaseToTitleCase = (str) => {
    return str
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleFilterApply = () => {
    const dynamicProperties = {};
    for (const key in filterFormData) {
      const value = filterFormData[key];
      if (Array.isArray(value) && value.length === 0 && value !== '""') {
        continue;
      } else if (value === '' || value === null || value === undefined) {
        continue;
      } else if (key.includes('id')) {
        dynamicProperties[key] = value.value;
        continue;
      }
      dynamicProperties[key] = value;
    }
    if (Object.keys(dynamicProperties).length > 0) {
      const appliedFiltersArray = [];
      Object.keys(dynamicProperties).forEach((key) => {
        let name = snakeCaseToTitleCase(key);
        if (key.includes('date') || key.includes('id'))
          name = name.split(' ')[key.includes('date') ? 1 : 0];
        if (appliedFiltersArray.every((item) => item.name !== name))
          appliedFiltersArray.push({
            name,
            identifier: key,
          });
      });

      setAppliedFilters(appliedFiltersArray);
      setOptionsChange(false);
      setShowAppliedFilters(true);
      clearTimeout(inputTimer);
      inputTimer = setTimeout(async () => {
        setLoading(true);
        fetchAllFilters(dynamicProperties);
      }, 500);
    } else {
      toast.error(`Atleast one filter is manadatory!`, {
        autoClose: 3000,
      });
    }
  };

  const handleSingleFilterDelete = (identifier) => {
    const updatedFilters = appliedFilters.filter(
      (filter) => filter.identifier !== identifier
    );
    setAppliedFilters(updatedFilters);
    let updatedFormData = null;
    if (identifier === 'date')
      updatedFormData = {
        ...filterFormData,
        start_date: null,
        end_date: null,
      };
    else updatedFormData = { ...filterFormData, [identifier]: '' };
    setFilterFormData(updatedFormData);
    setLoading(true);
    fetchAllFilters({
      ...updatedFormData,
      ...(updatedFormData['promotion_id'] && {
        promotion_id: updatedFormData['promotion_id']?.value,
      }),
      ...(updatedFormData['status_id'] && {
        status_id: updatedFormData['status_id']?.value,
      }),
    });
    if (updatedFilters.length <= 0) {
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

  return (
    <div className="mb-3 filterBar px-0 donors_centersFilters">
      <div className="filterInner">
        <h2>Filters</h2>
        <div className="filter">
          <form className="d-flex align-items-center gap-4 ">
            <div>
              <Select
                styles={{
                  control: (baseStyles, _) => ({
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
          <DynamicForm
            filterCodeData={filterCodeData}
            filterFormData={filterFormData}
            setFilterFormData={setFilterFormData}
            selectedOptions={selectedOptions}
            status={status}
            promotions={promotions}
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
              Save New Filter
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
                    onClick={() => handleSingleFilterDelete(item.identifier)}
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
            <img src={ConfirmationIcon} className="bg-white" alt="CancelIcon" />
          </div>
          <div className="content">
            <h3>Confirmation</h3>
            <p>Are you sure you want to delete this filter!</p>
            <div className="buttons">
              <button
                className="btn btn-md btn-secondary"
                style={{ color: '#387de5' }}
                onClick={() => setDeleteConfirmationModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-md btn-primary"
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
        message="Contact Volunteers Filters is archived."
        modalPopUp={archiveSuccess}
        isNavigate={true}
        setModalPopUp={setArchiveSuccess}
        showActionBtns={true}
        onConfirm={() => {}}
      />
      <SuccessPopUpModal
        title="Success!"
        message="Filter saved."
        modalPopUp={modalPopUp}
        isNavigate={true}
        setModalPopUp={setModalPopUp}
        showActionBtns={true}
        onConfirm={() => {}}
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

export default SessionFilter;
