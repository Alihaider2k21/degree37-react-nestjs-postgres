import { faMinus, faPlus, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { faSquareCheck } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import './index.scss';
import { toast } from 'react-toastify';
import styles from '../../crm/accounts/accounts.module.scss';
import Select, { components } from 'react-select';
import filterImage from '../../../assets/images/filterImage.png';
import { makeAuthorizedApiRequest } from '../../../helpers/Api';

let inputTimer = null;

function VolunteerFilters({ fetchAllStages, setIsLoading }) {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const bearerToken = localStorage.getItem('token');
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [optionsChange, setOptionsChange] = useState(false);
  const [organizationalLevelData, setOrganizationalLevelData] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState();
  const [selectOptionsData, setSelectOptionsData] = useState([]);
  const [searchAccount, setSearchAccount] = useState({
    name: '',
    city: '',
    state: '',
    industry_category: '',
    industry_subcategory: '',
    stage: '',
    source: '',
    collection_operation: '',
    recruiter: '',
    territory: '',
    organizational_levels: '',
    is_active: '',
  });

  useEffect(() => {
    getOrganizationalLevelData();
    getFilters();
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
    setOrganizationalLevelData(data?.data);
  };
  const getFilters = async () => {
    try {
      const result = await makeAuthorizedApiRequest(
        'GET',
        `${BASE_URL}/accounts/filters`
      );
      const data = await result.json();
      setSelectOptionsData(
        data?.data.map((item) => {
          return { ...item, value: item.id, label: item.name };
        }) || []
      );
    } catch (error) {
      toast.error('Failed to fetch Territory Management', {
        autoClose: 3000,
      });
    }
  };

  const handleFormInput = (e, key) => {
    const { value } = e.target;

    setSearchAccount((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleChange = (selectedOptions) => {
    setSelectedOptions(selectedOptions);
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

    // prop assignment
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
          />
        </div>
      </components.Option>
    );
  };
  const handleConfirmationResult = (confirmed) => {
    if (confirmed) {
      if (searchAccount.name) {
        handleSubmit();
      } else {
        toast.error(`Filter Name is mandatory!`, { autoClose: 3000 });
      }
    } else {
      reinitializeState();
      setSelectedOptions('');
      setShowConfirmationDialog(false);
    }
  };

  const handleSubmit = async (e) => {
    const {
      name,
      city,
      state,
      industry_category,
      industry_subcategory,
      stage,
      source,
      collection_operation,
      recruiter,
      territory,
      is_active,
      organizational_levels,
    } = searchAccount;
    let body = {
      name,
      city,
      state,
      industry_category: !industry_category ? null : +industry_category,
      industry_subcategory: !industry_subcategory
        ? null
        : +industry_subcategory,
      stage: !stage ? null : +stage,
      source: !source ? null : +source,
      collection_operation: !collection_operation
        ? null
        : +collection_operation,
      recruiter: !recruiter ? null : +recruiter,
      territory: !territory ? null : +territory,
      is_active:
        is_active === 'active' ? true : is_active === 'inactive' ? false : null,
      organizational_levels: !organizational_levels
        ? null
        : +organizational_levels,
    };
    try {
      const response = await makeAuthorizedApiRequest(
        'POST',
        `${BASE_URL}/accounts/filters`,
        JSON.stringify(body)
      );
      let data = await response.json();
      if (data?.status === 'success') {
        toast.success(`Filter added.`, { autoClose: 3000 });
        reinitializeState();
        setShowConfirmationDialog(false);
        setSelectedOptions('');
        getFilters();
      } else if (data?.status_code === 400) {
        const showMessage = Array.isArray(data?.message)
          ? data?.message[0]
          : data?.message;

        toast.error(`${showMessage}`, { autoClose: 3000 });
        // Handle bad request
      } else if (data?.status_code === 404) {
        const showMessage = data?.response;

        toast.error(`${showMessage}`, { autoClose: 3000 });
        // Handle bad request
      } else {
        const showMessage = Array.isArray(data?.message)
          ? data?.message[0]
          : data?.message;
        toast.error(`${showMessage}`, { autoClose: 3000 });
      }
    } catch (error) {
      toast.error(`${error?.message}`, { autoClose: 3000 });
    }
  };
  const reinitializeState = () => {
    const dupObj = { ...searchAccount };
    dupObj.name = '';
    dupObj.city = '';
    dupObj.state = '';
    dupObj.industry_category = '';
    dupObj.industry_subcategory = '';
    dupObj.stage = '';
    dupObj.source = '';
    dupObj.collection_operation = '';
    dupObj.recruiter = '';
    dupObj.territory = '';
    dupObj.organizational_levels = '';
    dupObj.is_active = '';
    setSearchAccount(dupObj);
  };
  useEffect(() => {
    reinitializeState();
    const dupObj = { ...searchAccount };
    dupObj.name = selectedOptions?.name || '';
    dupObj.city = selectedOptions?.city || '';
    dupObj.state = selectedOptions?.state || '';
    dupObj.industry_category = selectedOptions?.industry_category || '';
    dupObj.industry_subcategory = selectedOptions?.industry_subcategory || '';
    dupObj.stage = selectedOptions?.stage || '';
    dupObj.source = selectedOptions?.source || '';
    dupObj.collection_operation = selectedOptions?.collection_operation || '';
    dupObj.recruiter = selectedOptions?.recruiter || '';
    dupObj.territory = selectedOptions?.territory || '';
    dupObj.organizational_levels = selectedOptions?.organizational_levels || '';
    const xyz =
      selectedOptions?.is_active === true
        ? 'active'
        : selectedOptions?.is_active === false
        ? 'inactive'
        : '';
    dupObj.is_active = xyz;

    setSearchAccount(dupObj);

    clearTimeout(inputTimer);
    inputTimer = setTimeout(async () => {
      setIsLoading(true);
      fetchAllStages(selectedOptions);
    }, 500);
  }, [selectedOptions]);

  return (
    <div className="mb-3 filterBar px-0 accountFilters">
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
                closeMenuOnSelect={false}
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
          <form className={styles.account} style={{ paddingBottom: 'unset' }}>
            <div className="formGroup w-100 border-0 p-0 m-0">
              <div className="row row-gap-2  w-100">
                <div className="col-xs-12 col-sm-6 col-lg-4 col-xl-3">
                  <div className="form-field w-100">
                    <div className="field d-flex">
                      <label
                        className={`${styles.label}`}
                        style={
                          searchAccount.organizational_levels !== ''
                            ? {
                                top: '25%',
                                fontSize: '12px',
                                background: 'white',
                                color: 'black',
                              }
                            : { display: '' }
                        }
                      >
                        Organizational Level
                      </label>
                      <select
                        style={
                          searchAccount.organizational_levels !== ''
                            ? {
                                paddingTop: '12px',
                              }
                            : { display: '' }
                        }
                        name="organizational_levels"
                        className="form-select bg-white "
                        value={searchAccount.organizational_levels}
                        onChange={(e) => {
                          handleFormInput(e, 'organizational_levels');
                        }}
                        required
                      >
                        <option
                          value=""
                          disabled
                          style={{ color: 'green' }}
                        ></option>
                        {!!organizationalLevelData.length &&
                          organizationalLevelData.map((item, index) => (
                            <option key={item.id} value={item.id}>
                              {item?.name}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="col-xs-12 col-sm-6 col-lg-4 col-xl-3">
                  <div className="form-field w-100 ">
                    <div className="field">
                      <input
                        type="text"
                        className="form-control"
                        placeholder=" "
                        defaultValue={searchAccount.city}
                        value={searchAccount.city}
                        name="city"
                        onChange={(e) => {
                          handleFormInput(e, 'city');
                        }}
                        required
                      />
                      <label>City</label>
                    </div>
                  </div>
                </div>

                <div className="col-xs-12 col-sm-6 col-lg-4 col-xl-3">
                  <div className="form-field w-100 ">
                    <div className="field">
                      <input
                        type="text"
                        className="form-control"
                        placeholder=" "
                        defaultValue={searchAccount.country}
                        value={searchAccount.country}
                        name="country"
                        onChange={(e) => {
                          handleFormInput(e, 'country');
                        }}
                        required
                      />
                      <label>County</label>
                    </div>
                  </div>
                </div>
                <div className="col-xs-12 col-sm-6 col-lg-4 col-xl-3">
                  <div className="form-field w-100">
                    <div className="field">
                      <input
                        type="text"
                        className="form-control"
                        placeholder=" "
                        defaultValue={searchAccount.state}
                        value={searchAccount.state}
                        autoComplete="off"
                        required
                        name="state"
                        onChange={(e) => {
                          handleFormInput(e, 'state');
                        }}
                      />
                      <label>State</label>
                    </div>
                  </div>
                </div>
                <div className="col-xs-12 col-sm-6 col-lg-4 col-xl-3">
                  <div className="form-field w-100 ">
                    <div className="field d-flex">
                      <label
                        className={`${styles.label}`}
                        style={
                          searchAccount.is_active === '' ||
                          searchAccount.is_active === null
                            ? { display: '' }
                            : {
                                top: '25%',
                                fontSize: '12px',
                                background: 'white',
                                color: 'black',
                              }
                        }
                      >
                        Status
                      </label>
                      <select
                        style={
                          searchAccount.is_active === '' ||
                          searchAccount.is_active === null
                            ? { display: '' }
                            : {
                                paddingTop: '12px',
                              }
                        }
                        name="is_active"
                        className="form-select bg-white "
                        value={searchAccount.is_active}
                        onChange={(e) => {
                          handleFormInput(e, 'is_active');
                        }}
                        required
                      >
                        <option
                          value=""
                          disabled
                          style={{ color: 'green' }}
                        ></option>

                        <option value={'active'}>Active</option>
                        <option value={'inactive'}>Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="col-xs-12 col-sm-6 col-lg-4 col-xl-3">
                  <div className="form-field w-100 ">
                    <div className="field d-flex">
                      <label
                        className={`${styles.label}`}
                        style={
                          searchAccount.territory !== ''
                            ? {
                                top: '25%',
                                fontSize: '12px',
                                background: 'white',
                                color: 'black',
                              }
                            : { display: '' }
                        }
                      >
                        Account
                      </label>
                      <select
                        style={
                          searchAccount.territory !== ''
                            ? {
                                paddingTop: '12px',
                              }
                            : { display: '' }
                        }
                        name="territory"
                        className="form-select bg-white "
                        value={searchAccount.territory}
                        onChange={(e) => {
                          handleFormInput(e, 'territory');
                        }}
                        required
                      >
                        <option
                          value=""
                          disabled
                          style={{ color: 'green' }}
                        ></option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
          <div className="w-100 d-flex align-align-items-center justify-content-between mt-2 ">
            <button
              type="button"
              className={`outlineBtn btn btn-outline-primary py-3 rounded-3  `}
              style={{ paddingLeft: '32px', paddingRight: '32px' }}
              onClick={() => {
                if (
                  searchAccount.collection_operation !== '' ||
                  searchAccount.city !== '' ||
                  searchAccount.state !== '' ||
                  searchAccount.industry_category !== '' ||
                  searchAccount.industry_subcategory !== '' ||
                  searchAccount.is_active !== '' ||
                  searchAccount.organizational_levels !== '' ||
                  searchAccount.recruiter !== '' ||
                  searchAccount.source !== '' ||
                  searchAccount.stage !== '' ||
                  searchAccount.territory !== ''
                ) {
                  setShowConfirmationDialog(true);
                } else {
                  toast.error(`Atleast one filter is manadatory!`, {
                    autoClose: 3000,
                  });
                }
              }}
            >
              Save as New Filter
            </button>
            <div className="right-btn">
              <button className="btn btn-secondry btn-md clear-btn">
                Clear
              </button>
              <button className="btn btn-primary">Filter Data</button>
            </div>
          </div>
        </div>
      ) : null}
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
              value={searchAccount.name}
              onChange={(e) => handleFormInput(e, 'name')}
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

export default VolunteerFilters;
