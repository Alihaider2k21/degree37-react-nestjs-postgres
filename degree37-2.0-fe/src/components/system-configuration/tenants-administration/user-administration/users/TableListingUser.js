import React, { useState } from 'react';
// import SvgComponent from '../common/SvgComponent';
import { useNavigate } from 'react-router-dom';
import * as _ from 'lodash';
import SvgComponent from '../../../../common/SvgComponent';
// import './index.scss';

const TableList = ({
  isLoading,
  data,
  headers,
  handleSort,
  optionsConfig,
  setTableHeaders,
}) => {
  const navigate = useNavigate();
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
          {optionsConfig.map((option) => {
            if (option?.disabled && option.disabled(rowData)) return null;
            return (
              <li key={option.label}>
                <a
                  className="dropdown-item"
                  onClick={() => {
                    if (option.path) {
                      const path = option.path(rowData);
                      navigate(path);
                    } else if (option.action) {
                      option.action(rowData);
                    }
                  }}
                  href="#"
                >
                  {option.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  const checkboxTableItems = [
    'First Name',
    'Last Name',
    'Role',
    'Manager',
    'Assigned Manager',
    'Organizational Level',
    'Business Unit',
    'Account State',
    'Work Phone',
    'Mobile Phone',
    'Status',
  ];
  const handleCheckbox = (e, label, i) => {
    const dupArr = [...headers];
    if (!e.target.checked) {
      const index = dupArr.findIndex((data) => data.label === label);
      dupArr[index].checked = false;
      dupArr[index] = 0;
    } else {
      const index = deletedTableHeader.findIndex(
        (data) => data.label === label
      );
      dupArr[i] = deletedTableHeader[index];
      dupArr[index].checked = true;
    }
    setTableHeaders(dupArr);
    setDeletedTableHeader([...deletedTableHeader]);
  };
  return (
    <div className="table-listing-main">
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              {_.compact(headers).map((header) =>
                header.checked ? (
                  <th
                    key={header.name}
                    width={header.width}
                    style={{ minWidth: '20px', maxWidth: header.maxWidth }}
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
                ) : (
                  <></>
                )
              )}

              <th align="center">
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
                                (item) => item.label === option
                              )}
                              checked={headers.some(
                                (item) => item.label === option && item.checked
                              )}
                              style={{
                                height: '20px',
                                width: '20px',
                                borderRadius: '4px',
                              }}
                              onChange={(e) => handleCheckbox(e, option, index)}
                            />
                            <p style={{ fontWeight: '400', marginTop: '6px' }}>
                              {option}
                            </p>
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
                    {_.compact(headers).map((header, index) =>
                      header.checked ? (
                        <td key={`${rowData.id}-${index}`}>
                          {header.name === 'is_active' ? (
                            rowData[header.name] ? (
                              <span className="badge active">Active</span>
                            ) : (
                              <span className="badge inactive">Inactive</span>
                            )
                          ) : header.name === 'account_state' ? (
                            <div
                              className={
                                rowData[header.name] === 'Locked'
                                  ? 'text-danger'
                                  : ''
                              }
                            >
                              {rowData[header.name]}
                            </div>
                          ) : header.name === 'collection_operation' ? (
                            <div>{rowData[header.name]?.name}</div>
                          ) : header.name === 'city' ? (
                            <div>{rowData[header.name]}</div>
                          ) : header.name === 'state' ? (
                            <div>{rowData[header.name]}</div>
                          ) : header.name === 'industry_category' ? (
                            <div>{rowData[header.name]?.name}</div>
                          ) : header.name === 'industry_subcategory' ? (
                            <div>{rowData[header.name]?.name}</div>
                          ) : header.name === 'recruiter' ? (
                            <div>
                              {rowData[header.name]?.first_name}
                              {rowData[header.name]?.last_name}
                            </div>
                          ) : (
                            rowData[header.name]
                          )}
                        </td>
                      ) : (
                        <></>
                      )
                    )}
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
