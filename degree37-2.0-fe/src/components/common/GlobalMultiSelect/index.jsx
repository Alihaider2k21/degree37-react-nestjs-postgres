/* eslint-disable react/react-in-jsx-scope */
import React, { useEffect, useRef, useState } from 'react';
import styles from './index.module.scss';
import SvgComponent from '../SvgComponent';
export default function GlobalMultiSelect(props) {
  const {
    data,
    selectedOptions,
    error,
    showModel = false,
    onChange,
    onSelectAll,
    linkDrive = false,
    label,
    isquantity,
    quantity,
    disabled = false,
    onBlur,
    searchable = false,
    additionlOptions = [],
    allowAdditionalOptions = false,
    allowPopup = false,
    additionlOptionsToggleOnText = 'Show All',
    additionlOptionsToggleOffText = 'Hide',
    popupTriggerText = 'Help',
    onPopupClick,
    classes = {},
  } = props;
  const [selectAll, setSelectAll] = useState(false);
  const [dataOptions, setDataOptions] = useState([]);
  const [additionalOpt, setAdditionalOpt] = useState([]);
  const searchInputRef = useRef(null);
  const { errors = '' } = classes;
  useEffect(() => {
    if (data?.length) {
      if (data?.length !== selectedOptions?.length) {
        setSelectAll(false);
      } else {
        setSelectAll(true);
      }
    }
  }, [selectedOptions, data]);

  useEffect(() => {
    setDataOptions(data);
    if (allowAdditionalOptions && additionlOptions && additionlOptions.length) {
      setAdditionalOpt(additionlOptions);
    }
  }, [data]);

  const filterOptionsBySearch = () => {
    const value = searchInputRef.current.value.toLowerCase();
    if (value.length) {
      const newOptions = data.filter((item) =>
        item.name.toLowerCase().includes(value)
      );
      setDataOptions(newOptions);
    } else {
      setDataOptions(data);
    }
  };

  const toggleAdditionalOptions = () => {
    if (additionalOpt.length + data.length === dataOptions.length) {
      setDataOptions(data);
    } else {
      setDataOptions((prev) => {
        return [...prev, ...additionlOptions];
      });
    }
  };

  const selectAllOptions = (state) => {
    onSelectAll(state ? [] : data);
    setSelectAll(!state);
  };

  document.addEventListener('shown.bs.dropdown', () => {
    if (searchable) {
      searchInputRef.current.readOnly = false;
    }
  });

  document.addEventListener('hidden.bs.dropdown', () => {
    if (searchable) {
      searchInputRef.current.readOnly = true;
    }
  });

  return (
    <div className="form-field w-100">
      <div className="field filterBar p-0">
        <div className="filterInner p-0 w-100 " style={{ minHeight: '0' }}>
          <div
            className={`filter d-flex w-100 ${styles.filterbutton}`}
            style={{ width: '-webkit-fill-available' }}
          >
            <div
              className={` dropdown m-0 w-100`}
              style={{ width: '-webkit-fill-available' }}
            >
              <button
                className={`btn btn-success form-floating dropdown-toggle overflow-hidden form-floating ${
                  styles.devicetypeinputfields
                } ${
                  dataOptions ? `${styles.select}` : `${styles.disabledcolor} `
                }`}
                style={{
                  flexFlow: 'unset',
                  backgroundColor: disabled ? '#f5f5f5' : 'unset',
                }}
                type="button"
                onBlur={onBlur}
                id="floatingSelect"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                name="dropdown_action"
                disabled={disabled}
                onClick={() => {
                  if (searchable) {
                    searchInputRef.current.focus();
                  }
                }}
              >
                {selectedOptions?.length === 0 ? (
                  label && label?.length ? (
                    <>
                      <span
                        className={`${styles.selected}`}
                        style={{ marginTop: '-10px' }}
                      >
                        {label}
                      </span>
                    </>
                  ) : null
                ) : (
                  <>
                    <div
                      className="text-black"
                      style={{ overflow: 'hidden', width: '83%' }}
                    >
                      {selectedOptions?.slice(0, 2)?.map((names, key) => (
                        <span key={key} className={`${styles.selected}`}>
                          {key === 0 ? '' : ', '}
                          {names.name}{' '}
                        </span>
                      ))}
                    </div>

                    <span
                      className={`${styles.selecteditemcount} bg-primary rounded-circle`}
                    >
                      {isquantity ? quantity : selectedOptions?.length}
                    </span>
                  </>
                )}
              </button>
              <ul
                className="dropdown-menu w-100 p-3 overflow-y-scroll mt-2"
                aria-labelledby="multiSelectDropdown"
                style={{ maxHeight: '150px' }}
              >
                {dataOptions && dataOptions?.length ? (
                  <>
                    {searchable ? (
                      <input
                        className="multi-input"
                        ref={searchInputRef}
                        onChange={filterOptionsBySearch}
                      />
                    ) : null}
                    {(allowPopup && onPopupClick) ||
                    (allowAdditionalOptions && additionalOpt.length) ? (
                      <div
                        className={
                          'multiselect-option-links d-flex align-items-center justify-content-between mb-2'
                        }
                      >
                        {allowPopup && onPopupClick ? (
                          <span
                            className="text-primary popup-action cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              onPopupClick({
                                options: dataOptions,
                                additionlOptions: additionalOpt,
                                selectedOptions: selectedOptions,
                              });
                            }}
                          >
                            {popupTriggerText}
                          </span>
                        ) : null}
                        {allowAdditionalOptions && additionalOpt.length ? (
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleAdditionalOptions();
                            }}
                            className="text-primary additional-toggle cursor-pointer"
                          >
                            {additionalOpt.length + data.length ===
                            dataOptions.length
                              ? additionlOptionsToggleOffText
                              : additionlOptionsToggleOnText}
                          </span>
                        ) : null}
                      </div>
                    ) : null}
                    {!allowAdditionalOptions ? (
                      <>
                        {' '}
                        {linkDrive ? (
                          <div className="form-field checkbox  w-100">
                            <li
                              // key={item.id}
                              className={`text-end w-100 mb-2`}
                              style={{ cursor: 'pointer', color: 'blue' }}
                              onClick={(e) => {
                                showModel(true);
                                // e.stopPropagation();
                                // onChange(item);
                              }}
                            >
                              {/* <input
                            type="checkbox"
                            // value={item?.id}
                            className={`${styles.checkbox} form-check-input mt-0 p-2`}
                            checked={selectedOptions?.some(
                              (items) => items.id === item.id
                            )}
                            onClick={() => onChange(item)}
                            onChange={() => onChange(item)}
                          /> */}
                              <span>
                                <SvgComponent name={'DriveLink'} />
                              </span>
                              <span className="ms-2">Link This Drive</span>
                            </li>
                          </div>
                        ) : null}
                        <div
                          className={`${
                            dataOptions && dataOptions?.length === data?.length
                              ? ''
                              : 'd-none'
                          } form-field checkbox  w-100`}
                        >
                          <li
                            className={`d-flex align-items-center mb-2`}
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              selectAllOptions(selectAll);
                            }}
                          >
                            <input
                              type="checkbox"
                              value={'selectAll'}
                              className={`${styles.checkbox} form-check-input mt-0 p-2`}
                              checked={selectAll}
                              onClick={() => selectAllOptions(selectAll)}
                              onChange={() => selectAllOptions(selectAll)}
                            />
                            <span className="ms-3">Select All</span>
                          </li>
                        </div>
                      </>
                    ) : null}

                    {dataOptions?.map((item, index) => {
                      return (
                        <div
                          key={item.id}
                          className="form-field checkbox  w-100"
                        >
                          <li
                            key={item.id}
                            className={`d-flex align-items-center ${
                              dataOptions.length - 1 === index ? '' : 'mb-2'
                            }`}
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              onChange(item);
                            }}
                          >
                            <input
                              type="checkbox"
                              value={item?.id}
                              className={`${styles.checkbox} form-check-input mt-0 p-2`}
                              checked={selectedOptions?.some(
                                (items) => items.id === item.id
                              )}
                              onClick={() => onChange(item)}
                              onChange={() => onChange(item)}
                            />
                            <span className="ms-3">{item.name}</span>
                          </li>
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <>
                    {linkDrive ? (
                      <div className="form-field checkbox  w-100">
                        <li
                          // key={item.id}
                          className={`text-end w-100 mb-2`}
                          style={{ cursor: 'pointer', color: 'blue' }}
                          onClick={(e) => {
                            showModel(true);
                            // e.stopPropagation();
                            // onChange(item);
                          }}
                        >
                          {/* <input
                            type="checkbox"
                            // value={item?.id}
                            className={`${styles.checkbox} form-check-input mt-0 p-2`}
                            checked={selectedOptions?.some(
                              (items) => items.id === item.id
                            )}
                            onClick={() => onChange(item)}
                            onChange={() => onChange(item)}
                          /> */}
                          <span className="ms-3">Link this Drive</span>
                        </li>
                      </div>
                    ) : null}
                    <li>No option found</li>
                  </>
                )}
              </ul>
              {selectedOptions?.length !== 0 ? (
                <label
                  htmlFor="floatingSelect"
                  style={{ fontSize: '12px', top: '25%' }}
                >
                  {label}
                </label>
              ) : (
                ''
              )}
            </div>
          </div>
        </div>
      </div>
      {error && (
        <div
          style={{ marginLeft: '7px' }}
          className={`error ${styles.errorcolor} ${errors}`}
        >
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
