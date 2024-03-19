import React from 'react';
import SvgComponent from '../../../../common/SvgComponent';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import CalendarCheck from '../../../../../assets/calendar-check.svg';
import CalendarCheckAlt from '../../../../../assets/calendar-check-alt.svg';
import Error from '../../../../../assets/error.svg';
import ToolTip from '../../../../common/tooltip';
import { formatUser } from '../../../../../helpers/formatUser';
import styles from './index.module.scss';
import SelectDropdown from '../../../../common/selectDropdown';

const DESCRIPTION_TRUNCATE_LENGTH = 60;

const ContactsTable = ({
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

  return (
    <div className="table-listing-main mt-0 mb-0 ">
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              {handleCheckboxValue && (
                <th
                  width={'1%'}
                  align="center"
                  style={{ backgroundColor: 'white' }}
                >
                  <CheckboxInput
                    name="all"
                    checked={
                      data?.length && checkboxValues?.length === data?.length
                    }
                    onChange={handleChecked}
                  />
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
                      : index === headers?.length - 1
                      ? '5%'
                      : header.width
                  }
                  className="rounded-0"
                  style={{ backgroundColor: 'white' }}
                  align="center"
                >
                  <div className="inliner">
                    <span className="title">{header.label}</span>
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
                    className={
                      current && current === rowData.id && styles.current
                    }
                    key={rowData.id}
                  >
                    {handleCheckboxValue && (
                      <td width={'1%'}>
                        <CheckboxInput
                          name={rowData.id}
                          value={checkboxValue}
                          checked={checkboxValues?.includes(checkboxValue)}
                          onChange={handleChecked}
                        />
                      </td>
                    )}

                    {headers.map((header, index) => (
                      <td
                        style={
                          header.type
                            ? header.type === 'noWrap'
                              ? {
                                  whiteSpace: 'nowrap',
                                  position: 'relative',
                                  minWidth:
                                    header.type === 'select' ? '230px' : 'auto',
                                }
                              : {
                                  position: 'relative',
                                  wordBreak: 'keep-all',
                                  minWidth:
                                    header.type === 'select' ? '230px' : 'auto',
                                }
                            : {}
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
                        ) : header.name === 'assigned_by' ? (
                          <span>{formatUser(rowData?.assigned_by, 1)}</span>
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
                                    rowData?.collectionOperations?.length - 1 &&
                                    ', '}
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
                          <span>{rowData?.address?.city}</span>
                        ) : header.name === 'state' ? (
                          <span>{rowData?.address?.state}</span>
                        ) : header.name === 'task_collection_operation' ? (
                          <span>{rowData.collection_operation}</span>
                        ) : header.name === 'retire_on' ? (
                          rowData.retire_on ? (
                            <div
                              className="d-flex"
                              style={{ whiteSpace: 'nowrap' }}
                            >
                              <img
                                className="me-2"
                                src={
                                  moment(rowData.retire_on).isBefore(new Date())
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
                        ) : (
                          rowData[header.name]
                        )}
                      </td>
                    ))}

                    {optionsConfig && (
                      <td className="options">{renderOptions(rowData)}</td>
                    )}

                    <td>
                      <SvgComponent name={'DrivesCrossIcon'} />
                    </td>
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
  );
};

export default ContactsTable;
