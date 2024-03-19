import React, { useState } from 'react';
import SvgComponent from '../SvgComponent';
import { Link, useNavigate } from 'react-router-dom';
import moment from 'moment';
import CalendarCheck from '../../../assets/calendar-check.svg';
import CalendarCheckAlt from '../../../assets/calendar-check-alt.svg';
import Error from '../../../assets/error.svg';
import ToolTip from '../tooltip';
import { formatUser } from '../../../helpers/formatUser';
import styles from './index.module.scss';
import SelectDropdown from '../selectDropdown';
import DatePicker from 'react-datepicker';
import { OperationStatus } from '../../crm/donors_centers/sessionHistory/SessionHistoryUtils';

const DESCRIPTION_TRUNCATE_LENGTH = 60;

const TableList = ({
  isLoading,
  data,
  headers,
  handleSort,
  optionsConfig,
  checkboxValues = [],
  handleCheckboxValue,
  handleCheckbox,
  current,
  selectOptions,
  selectValues,
  setSelectValues,
  showVerticalLabel = false,
  showActionsLabel = true,
  favorite,
  dateValues,
  setDateValues,
  showAllCheckBoxListing = true,
  selectSingle = false,
  showAllRadioButtonListing = false,
}) => {
  const navigate = useNavigate();
  const renderOptions = (rowData) => {
    return (
      <div className="dropdown-center">
        <div
          className="optionsIcon"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <SvgComponent name={'ThreeDots'} />
        </div>
        <ul className="dropdown-menu">
          {optionsConfig?.map((option) => (
            <li key={option?.label}>
              <a
                className="dropdown-item"
                onClick={(e) => {
                  if (option?.openNewTab?.(rowData)) {
                    return;
                  }
                  if (!(e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    if (option.path) {
                      const path = option.path(rowData);
                      navigate(path);
                    } else if (option.action) {
                      option.action(rowData);
                    }
                  }
                }}
                href={option.path ? option.path(rowData) : '#'}
                target="_blank"
                rel="noopener noreferrer"
              >
                {option.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const truncateDescription = (description, maxLength) => {
    if (description?.length > maxLength) {
      return description?.substring(0, maxLength) + '...';
    }
    return description;
  };

  const handleDateChange = (val, rowId) => {
    const updatedDateValues = dateValues.map((item) => {
      if (item.id === rowId) {
        return { ...item, date: val };
      }
      return item;
    });
    setDateValues(updatedDateValues);
  };

  const handleChecked = (e) => {
    e.preventDefault();
    const { name, value } = e.target;

    switch (name) {
      case 'all':
        handleCheckbox(
          checkboxValues?.length
            ? []
            : data.map((rowData) => handleCheckboxValue(rowData))
        );
        break;

      default:
        if (checkboxValues?.indexOf(value) === -1) {
          handleCheckbox([...checkboxValues, value]);
        } else {
          handleCheckbox(checkboxValues.filter((row) => row !== value));
        }
        break;
    }
  };

  // const handleCheckedRadioButton = (e) => {
  //   e.preventDefault();
  //   const { name, value } = e.target;
  //   console.log({ name }, { value });
  //   // switch (name) {
  //   //   case 'all':
  //   //     handleCheckbox(
  //   //       checkboxValues?.length
  //   //         ? []
  //   //         : data.map((rowData) => handleCheckboxValue(rowData))
  //   //     );
  //   //     break;

  //   //   default:
  //   //     if (checkboxValues?.indexOf(value) === -1) {
  //   //       handleCheckbox([...checkboxValues, value]);
  //   //     } else {
  //   //       handleCheckbox(checkboxValues.filter((row) => row !== value));
  //   //     }
  //   //     break;
  //   // }
  // };

  const CheckboxInput = ({ value, ...otherProps }) => (
    <input
      type="checkbox"
      value={value}
      style={{
        height: '15px',
        width: '15px',
      }}
      {...otherProps}
    />
  );

  const renderCommunicationSubjectColumn = (rowData) => {
    const message = rowData;
    return (
      <span onClick={() => openPopup(message)} className="linkable">
        {message?.communications_subject}
      </span>
    );
  };

  const renderNoteNameColumn = (rowData) => {
    const note = {
      note_name: rowData?.note_name,
      details: rowData?.details,
    };
    return (
      <span onClick={() => openNotePopup(note)} className="linkable">
        {rowData?.note_name}
      </span>
    );
  };

  const [communicationPopup, setCommunicationPopup] = useState(false);
  const [communicationMessage, setCommunicationMessage] = useState('');
  const [notePopup, setNotePopup] = useState(false);
  const [noteMessage, setNoteMessage] = useState({});

  // Function to open the popup and set the message details
  const openPopup = (message) => {
    setCommunicationMessage(message);
    setCommunicationPopup(true);
  };

  const openNotePopup = (message) => {
    setNoteMessage(message);
    setNotePopup(true);
  };

  const convertHTMLToPlainText = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return truncateDescription(doc?.body?.textContent, 30);
  };

  return (
    <>
      <div className="table-listing-main">
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                {showAllCheckBoxListing && handleCheckboxValue && (
                  <th width={'1%'} align="center">
                    <CheckboxInput
                      name="all"
                      checked={
                        data?.length && checkboxValues?.length === data?.length
                      }
                      onChange={handleChecked}
                    />
                  </th>
                )}
                {/* {showAllRadioButtonListing && showAllRadioButtonListing && (
                  <th width={'1%'} align="center">
                    <FormRadioButtons
                      name="all"
                      checked={
                        data?.length && checkboxValues?.length === data?.length
                      }
                      onChange={handleChecked}
                    />
                  </th>
                )} */}
                {!showAllCheckBoxListing && (
                  <th width={'1%'} align="center">
                    <p></p>
                  </th>
                )}
                {headers?.map((header, index) => (
                  <th
                    key={`${header?.name}-${header?.label}-${index}`}
                    width={
                      header.label === 'Status'
                        ? '5%'
                        : header.label === 'status'
                        ? '5%'
                        : header.name === 'Status'
                        ? '5%'
                        : header.name === 'status'
                        ? '5%'
                        : header.name === 'type'
                        ? '15%'
                        : index === headers?.length - 1
                        ? '5%'
                        : header.width
                    }
                    align="center"
                  >
                    <div className="inliner">
                      <div className="title">
                        {header?.splitlabel ? (
                          header?.label.split(' ').map((word, i) => (
                            <React.Fragment key={i}>
                              {i > 0 && <br />} {word}
                            </React.Fragment>
                          ))
                        ) : (
                          <span className="title">{header.label}</span>
                        )}
                      </div>
                      {header?.sortable && header?.label !== 'Attachments' && (
                        <div
                          className="sort-icon"
                          onClick={() => {
                            handleSort(header.name);
                          }}
                        >
                          <SvgComponent name={'SortIcon'} />
                        </div>
                      )}
                      {header?.tooltip && header.tooltipText && (
                        <div className="ms-2">
                          <ToolTip bottom={true} text={header.tooltipText} />
                        </div>
                      )}
                    </div>
                  </th>
                ))}
                {optionsConfig && (
                  <th width="5%" align="center">
                    {showActionsLabel ? (
                      <div className="inliner justify-content-center">
                        <span className="title">Actions</span>
                      </div>
                    ) : null}
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td className="no-data" colSpan={headers?.length + 1}>
                    Data Loading
                  </td>
                </tr>
              ) : data?.length ? (
                data.map((rowData, index) => {
                  const checkboxValue =
                    handleCheckboxValue && handleCheckboxValue(rowData);
                  return (
                    <tr
                      className={`${
                        current && current === rowData.id && styles.current
                      } ${rowData.default ? 'default' : ''}`}
                      key={rowData.id}
                    >
                      {handleCheckboxValue &&
                        showAllRadioButtonListing == false && (
                          <td width={'1%'}>
                            <CheckboxInput
                              name={rowData.id}
                              value={checkboxValue}
                              checked={checkboxValues?.includes(
                                checkboxValue?.toString()
                              )}
                              onChange={handleChecked}
                              disabled={
                                selectSingle &&
                                checkboxValues.length &&
                                !checkboxValues?.includes(checkboxValue)
                              }
                            />
                          </td>
                        )}
                      {handleCheckboxValue && showAllRadioButtonListing && (
                        <td>
                          <input
                            type="radio"
                            name={rowData.id}
                            value={checkboxValue}
                            checked={checkboxValues?.includes(
                              checkboxValue?.toString()
                            )}
                            onChange={handleChecked}
                          />
                        </td>
                      )}

                      {headers.map((header, index) => (
                        <td
                          style={
                            (header.type
                              ? header.type === 'noWrap'
                                ? {
                                    whiteSpace: 'nowrap',
                                    position: 'relative',
                                    minWidth:
                                      header.type === 'select'
                                        ? '230px'
                                        : 'auto',
                                  }
                                : {
                                    position: 'relative',
                                    wordBreak: 'keep-all',
                                    minWidth:
                                      header.type === 'select'
                                        ? '230px'
                                        : 'auto',
                                  }
                              : { backgroundClip: 'padding-box' },
                            header.name === 'event_status'
                              ? {
                                  textAlign: 'left',
                                }
                              : {})
                          }
                          className={
                            favorite
                              ? 'position-relative'
                              : header.className
                              ? header.className
                              : ''
                          }
                          key={`${rowData.id}-${header.name}-${header.label}-${index}`}
                        >
                          {index === 0 &&
                            showVerticalLabel &&
                            rowData?.verticalLabel && (
                              <div
                                className={`position-absolute top-0 d-flex justify-content-center align-items-center ${styles.verticalLabelContainer}`}
                              >
                                <span
                                  className={`p-0 m-0 ${styles.verticalLabelText}`}
                                >
                                  {rowData?.verticalLabel}
                                </span>
                              </div>
                            )}
                          {[
                            'is_generate_online_appointments',
                            'expires',
                          ]?.includes(header.name) ? (
                            rowData[header.name] ? (
                              'Yes'
                            ) : (
                              'No'
                            )
                          ) : ['is_active', 'status']?.includes(header.name) ? (
                            rowData?.className ? (
                              <span className={rowData?.className}>
                                {rowData?.status}
                              </span>
                            ) : rowData[header.name] ? (
                              <span className="badge active">Active</span>
                            ) : (
                              <span className="badge inactive">Inactive</span>
                            )
                          ) : header.name === 'communications_subject' ? (
                            renderCommunicationSubjectColumn(rowData)
                          ) : header.name === 'communications_status' ? (
                            rowData?.className ? (
                              <span className={rowData?.className}>
                                {rowData?.status}
                              </span>
                            ) : rowData[header.name] === 'sent' ? (
                              <span className="badge active">Sent</span>
                            ) : (
                              <span className="badge inactive">
                                Already Sent
                              </span>
                            )
                          ) : header.name === 'event_status' ? (
                            <span
                              className={`badge ${
                                OperationStatus[
                                  rowData?.event_status?.toLowerCase()
                                ]
                              }`}
                            >
                              {rowData?.event_status}
                            </span>
                          ) : header.name ===
                            'communications_listing_message' ? (
                            <span>
                              {convertHTMLToPlainText(
                                rowData?.communications_listing_message
                              )}
                            </span>
                          ) : header.name === 'assigned_by' ? (
                            <span>{formatUser(rowData?.assigned_by, 1)}</span>
                          ) : header.name === 'date' &&
                            header?.link &&
                            header.link === true ? (
                            <a
                              rel="noreferrer"
                              target="_blank"
                              href={`/operations-center/operations/non-collection-events/${rowData?.eventid}/view/about`}
                            >
                              {moment(rowData.date).format('MM-DD-YYYY')}
                            </a>
                          ) : header.name === 'date' ? (
                            <span>
                              {moment(rowData.date).format('MM-DD-YYYY')}
                            </span>
                          ) : header.name === 'external_id' ? (
                            <span>
                              {rowData[header.name]
                                ? rowData[header.name]
                                : 'N/A'}
                            </span>
                          ) : header.name === 'assigned_to' ? (
                            <span>{formatUser(rowData?.assigned_to, 1)}</span>
                          ) : header.name === 'attachment_files' ? (
                            header.icon ? (
                              <span className="d-flex align-items-center">
                                {!rowData[header.name] && 'N/A'}
                                {rowData[header.name]?.includes('.pdf') ? (
                                  <>
                                    <span className="flex-shrink-0">
                                      <SvgComponent name="PdfIcon" />
                                    </span>
                                    <p className="mb-0 ms-1">
                                      {rowData[header.name]}
                                    </p>
                                  </>
                                ) : rowData[header.name]?.includes('.jpg') ||
                                  rowData[header.name]?.includes('.jpeg') ||
                                  rowData[header.name]?.includes('.png') ? (
                                  <>
                                    <span className="flex-shrink-0">
                                      <SvgComponent name="image" />
                                    </span>
                                    <p className="mb-0 ms-1">
                                      {rowData[header.name]}
                                    </p>
                                  </>
                                ) : (
                                  rowData[header.name]?.includes('.docx') && (
                                    <>
                                      <span className="flex-shrink-0">
                                        <SvgComponent name="WordIcon" />
                                      </span>
                                      <p className="mb-0 ms-1">
                                        {rowData[header.name]}
                                      </p>
                                    </>
                                  )
                                )}
                              </span>
                            ) : (
                              ''
                            )
                          ) : header.name === 'due_date' ? (
                            header.icon ? (
                              <div
                                className="d-flex"
                                style={{ whiteSpace: 'nowrap' }}
                              >
                                <img
                                  className="me-2"
                                  src={
                                    moment(rowData.due_date).isBefore(
                                      new Date().toISOString().split('T')[0]
                                    )
                                      ? CalendarCheckAlt
                                      : CalendarCheck
                                  }
                                  alt=""
                                />
                                {moment(rowData.due_date).format('MM-DD-YYYY')}
                              </div>
                            ) : (
                              <div
                                className="d-flex"
                                style={{ whiteSpace: 'nowrap' }}
                              >
                                {moment(rowData.due_date).format('MM-DD-YYYY')}
                                <img
                                  className="ms-2"
                                  src={
                                    moment(rowData.due_date).isBefore(
                                      new Date().toISOString().split('T')[0]
                                    )
                                      ? Error
                                      : ''
                                  }
                                  alt=""
                                />
                              </div>
                            )
                          ) : [
                              'description',
                              'short_description',
                              'direction',
                              'note',
                            ].includes(header.name) ? (
                            <div>
                              {truncateDescription(
                                rowData[header.name],
                                DESCRIPTION_TRUNCATE_LENGTH
                              )}
                            </div>
                          ) : header.name === 'is_goal_type' ? (
                            rowData[header.name] ? (
                              'Yes'
                            ) : (
                              'No'
                            )
                          ) : header.name === 'donation_status' ? (
                            rowData[header.name] == 1 ? (
                              'Donation'
                            ) : (
                              'Deferral'
                            )
                          ) : header.name === 'schedulable' ? (
                            rowData[header.name] ? (
                              'Yes'
                            ) : (
                              'No'
                            )
                          ) : header.name === 'hold_resources' ? (
                            rowData[header.name] ? (
                              'Yes'
                            ) : (
                              'No'
                            )
                          ) : header.name === 'contribute_to_scheduled' ? (
                            rowData[header.name] ? (
                              'Yes'
                            ) : (
                              'No'
                            )
                          ) : header.name === 'parent_id' ? (
                            <span>{rowData?.parent_id?.name}</span>
                          ) : header.name === 'requires_approval' ? (
                            rowData[header.name] ? (
                              'Yes'
                            ) : (
                              'No'
                            )
                          ) : header.name === 'applies_to' ? (
                            rowData?.applies_to?.length ? (
                              rowData?.applies_to.map((appliesToData, key) => (
                                <span key={key}>
                                  {key === 0
                                    ? appliesToData
                                    : ',' + appliesToData}
                                </span>
                              ))
                            ) : (
                              ''
                            )
                          ) : header.name === 'procedure_types_products' ? (
                            rowData?.procedure_types_products?.length ? (
                              rowData?.procedure_types_products?.map(
                                (procedureTypesProduct, key) => (
                                  <span className="badge" key={key}>
                                    {procedureTypesProduct?.products?.name}
                                  </span>
                                )
                              )
                            ) : (
                              ''
                            )
                          ) : header.name === 'procedure_type_id' ? (
                            rowData?.procedure_type_id?.name
                          ) : header.name === 'procedure_products' ? (
                            rowData?.procedure_products?.length ? (
                              rowData?.procedure_products?.map(
                                (procedureTypesProduct, key) => (
                                  <span className="badge" key={key}>
                                    {procedureTypesProduct?.products?.name}
                                  </span>
                                )
                              )
                            ) : (
                              ''
                            )
                          ) : header.name === 'collection_operation' ? (
                            rowData?.collectionOperations?.length ? (
                              rowData?.collectionOperations?.map(
                                (procedureTypesProduct, key) => (
                                  <span key={key}>
                                    {
                                      procedureTypesProduct?.collection_operation_name
                                    }
                                    {key !==
                                      rowData?.collectionOperations?.length -
                                        1 && ', '}
                                  </span>
                                )
                              )
                            ) : (
                              ''
                            )
                          ) : header.name === 'collection_operation_name' ? (
                            rowData?.collection_operation?.name || ''
                          ) : header.name === 'parentCategory' ? (
                            <span>
                              {rowData.parentCategoryName
                                ? rowData.parentCategoryName
                                : rowData.name}
                            </span>
                          ) : header.name === 'task_applies_to' ? (
                            <span>{rowData.applies_to}</span>
                          ) : header.name === 'city' ? (
                            <span>
                              {rowData?.address?.city ?? rowData?.city}
                            </span>
                          ) : header.name === 'state' ? (
                            <span>
                              {rowData?.address?.state ?? rowData?.state}
                            </span>
                          ) : header.name === 'task_collection_operation' ? (
                            <span>{rowData.collection_operation}</span>
                          ) : header.type === 'date-picker' ? (
                            <div className="form-field">
                              <div className="field ">
                                {
                                  <label
                                    style={{
                                      fontSize: '12px',
                                      top: '24%',
                                      color: '#555555',
                                      zIndex: 1,
                                    }}
                                  >
                                    Start Date
                                  </label>
                                }
                                <DatePicker
                                  dateFormat="MM/dd/yyyy"
                                  className=" custom-datepicker "
                                  placeholderText="Start Date*"
                                  selected={
                                    dateValues.find(
                                      (item) => item.id == rowData.id
                                    )?.date
                                  }
                                  maxDate={new Date()}
                                  onChange={(val) => {
                                    handleDateChange(val, rowData.id);
                                  }}
                                />
                              </div>
                            </div>
                          ) : header.name === 'retire_on' ? (
                            rowData.retire_on ? (
                              <div
                                className="d-flex"
                                style={{ whiteSpace: 'nowrap' }}
                              >
                                <img
                                  className="me-2"
                                  src={
                                    moment(
                                      rowData.retire_on,
                                      'MM-DD-YYYY'
                                    ).isBefore(moment().startOf('day'))
                                      ? CalendarCheckAlt
                                      : CalendarCheck
                                  }
                                  alt=""
                                />
                                {moment(rowData.retire_on, 'MM-DD-YYYY').format(
                                  'MM-DD-YYYY'
                                )}
                              </div>
                            ) : (
                              '-'
                            )
                          ) : header.type === 'select' ? (
                            <SelectDropdown
                              selectedValue={selectValues[rowData?.id] || null}
                              removeDivider
                              removeTheClearCross
                              placeholder={header.label}
                              name={header.label}
                              options={selectOptions}
                              onChange={(e) => {
                                const dupArr = { ...selectValues };
                                dupArr[rowData?.id] = e;
                                setSelectValues(dupArr);
                              }}
                            />
                          ) : header.type === 'custom-component' ? (
                            header.component(rowData)
                          ) : header.name === 'attachment_name' ? (
                            rowData.attachment_files?.length > 0 ? (
                              <Link
                                to={
                                  rowData.attachment_files?.[0].attachment_path
                                }
                                target="_blank"
                              >
                                {rowData.name} (
                                {rowData.attachment_files?.length})
                              </Link>
                            ) : (
                              `${rowData.name}`
                            )
                          ) : header.name === 'note_name' ? (
                            renderNoteNameColumn(rowData)
                          ) : (
                            <span
                              className={
                                header.innerClassName
                                  ? header.innerClassName
                                  : ''
                              }
                            >
                              {rowData[header.name]}
                            </span>
                          )}
                        </td>
                      ))}

                      {optionsConfig && (
                        <td className="options">{renderOptions(rowData)}</td>
                      )}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td className="no-data" colSpan={headers?.length + 1}>
                    No Data Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <section
        className={`popup ${styles.communicationMessagePopup} full-section ${
          communicationPopup ? 'active' : ''
        }`}
      >
        <div className="popup-inner">
          <div className="content">
            <h3>Message</h3>
            <div className="subject">
              <span>
                Subject: {communicationMessage?.communications_subject}
              </span>
            </div>
            <div
              className="content"
              dangerouslySetInnerHTML={{
                __html: communicationMessage?.communications_message,
              }}
            />
            <div className="close" onClick={() => setCommunicationPopup(false)}>
              Close
            </div>
          </div>
        </div>
      </section>

      <section
        className={`popup ${styles.communicationMessagePopup} full-section ${
          notePopup ? 'active' : ''
        }`}
      >
        <div className="popup-inner">
          <div className="content">
            <h3>Note</h3>
            <div
              className="content"
              dangerouslySetInnerHTML={{
                __html: noteMessage?.details,
              }}
            />
            <div className="close" onClick={() => setNotePopup(false)}>
              Close
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default TableList;
