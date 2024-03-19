import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import * as _ from 'lodash';
import './index.scss';
import SvgComponent from '../../../../common/SvgComponent';

const TableList = ({
  isLoading,
  data,
  headers,
  handleSort,
  optionsConfig,
  setTableHeaders,
}) => {
  // const navigate = useNavigate();
  const [deletedTableHeader, setDeletedTableHeader] = useState(headers);

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
          {optionsConfig.map((option) => (
            <li key={option.label}>
              <Link
                to={option.path ? option.path(rowData) : '#'} // Provide the correct path or '#' as fallback
                className="dropdown-item"
                onClick={() => {
                  if (option.action) {
                    option.action(rowData);
                  }
                }}
                state={option?.state ? option?.state(rowData) : null}
              >
                {option.label}
              </Link>
              {/* <Link
                className="dropdown-item"
                onClick={() => {
                  if (option.path) {
                    const path = option.path(rowData);
                    navigate(path);
                  } else if (option.action) {
                    option.action(rowData);
                  }
                }}
                // href="javascript:void(0);"
              >
                {option.label}
              </Link> */}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const checkboxTableItems = [
    'Date',
    'Event Name',
    'Hours',
    'Location',
    'Total Staff',
    'Collection Operations',
    'Status',
    'Owner',
  ];
  const handleCheckbox = (e, label, i) => {
    const dupArr = [...headers];
    const index = dupArr.findIndex((data) => data.label === label);
    dupArr[index].checked = !dupArr[index].checked;
    setTableHeaders(dupArr);
    setDeletedTableHeader([...deletedTableHeader]);
  };
  return (
    <div className="table-listing-main">
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              {_.compact(headers)
                .filter((item) => item.checked)
                .map((header) => (
                  <th
                    key={header.name}
                    width={header.width}
                    style={{ minWidth: `${header.minWidth}` }}
                    align="center"
                  >
                    <div className="inliner">
                      <span className="title">{header.label}</span>
                      {header.sortable && (
                        <div
                          className="sort-icon"
                          onClick={() => {
                            handleSort(header.name);
                          }}
                        >
                          <SvgComponent name={'SortIcon'} />
                        </div>
                      )}
                    </div>
                  </th>
                ))}

              <th className="d-flex flex-row justify-content-center">
                <div className="flex align-items-center justify-content-center">
                  <div className="account-list-header dropdown-center ">
                    <div
                      className="optionsIcon  cursor-pointer"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <SvgComponent name={'TableHeaderIcon'} />
                    </div>
                    <ul className="dropdown-menu">
                      {checkboxTableItems.map((option, index) => (
                        <li key={option}>
                          <div className="flex align-items-center gap-2 checkboxInput">
                            <input
                              type="checkbox"
                              value={headers.some(
                                (item) => item?.label === option && item.checked
                              )}
                              checked={headers.some(
                                (item) => item?.label === option && item.checked
                              )}
                              style={{
                                height: '20px',
                                width: '20px',
                                borderRadius: '4px',
                              }}
                              onChange={(e) => handleCheckbox(e, option, index)}
                            />
                            <span style={{ fontSize: '14px' }}>{option}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td className="no-data" colSpan={headers.length + 1}>
                  Data Loading
                </td>
              </tr>
            ) : data?.length ? (
              data.map((rowData, index) => {
                return (
                  <tr key={`${rowData.id}-${index}`}>
                    {_.compact(headers)
                      .filter((item) => item.checked)
                      .map((header, index) => (
                        <td key={`${rowData.id}-${index}`}>
                          {header.name === 'is_active' ? (
                            rowData[header.name] ? (
                              <span className="badge active">Confirmed</span>
                            ) : (
                              <span className="badge inactive">
                                Not Confirmed
                              </span>
                            )
                          ) : header.name === 'location_id' ? (
                            <div>{rowData.location_id}</div>
                          ) : header.name === 'owner' ? (
                            <div>{`${rowData.owner_id}`}</div>
                          ) : rowData[header.name] === 'event_hours' ? (
                            <div>{`${rowData.min_start_time} ${rowData.max_end_time}`}</div>
                          ) : header.name === 'collection_operation' ? (
                            <div>{rowData.collection_operation_id}</div>
                          ) : header.name === 'status' ? (
                            <div>{rowData.status_id?.name}</div>
                          ) : header.name === 'event_category' ? (
                            <div>{rowData.event_category_id?.name}</div>
                          ) : header.name === 'event_subcategory' ? (
                            <div>{rowData.event_subcategory_id?.name}</div>
                          ) : header.name === 'status_id' ? (
                            <div className={`badge ${rowData?.className}`}>
                              {rowData.status_id}
                            </div>
                          ) : header.name === 'profile' ? (
                            <div>
                              {rowData.non_collection_profile_id?.profile_name}
                            </div>
                          ) : (
                            rowData[header.name]
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
                <td className="no-data" colSpan={headers.length + 1}>
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
export default TableList;
