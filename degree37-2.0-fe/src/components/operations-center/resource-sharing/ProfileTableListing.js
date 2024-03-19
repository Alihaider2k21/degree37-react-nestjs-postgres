import React, { useState } from 'react';
import SvgComponent from '../../common/SvgComponent';
import { Link } from 'react-router-dom';
import * as _ from 'lodash';
import './index.module.scss';
import styles from './index.module.scss';
// import { formatUser } from '../../../helpers/formatUser';

const ProfileTableListing = ({
  isLoading,
  data,
  headers,
  handleSort,
  optionsConfig,
  setTableHeaders,
}) => {
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
          {optionsConfig.map((option) =>
            option ? (
              <li key={option.label}>
                <Link
                  to={option.path ? option.path(rowData) : '#'} // Provide the correct path or '#' as fallback
                  className="dropdown-item"
                  onClick={() => {
                    if (option.action) {
                      option.action(rowData);
                    }
                  }}
                >
                  {option.label}
                </Link>
              </li>
            ) : (
              ''
            )
          )}
        </ul>
      </div>
    );
  };

  const checkboxTableItems = [
    'Start Date',
    'End Date',
    'Share Type',
    'Quantity',
    'Description',
    'From Collection Operation',
    'To Collection Operation',
    'Created',
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
                ) : (
                  <th key={header.name}></th>
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
                            <span>{option}</span>
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
                    {_.compact(headers).map((header, index) => (
                      <td key={`${rowData.id}-${index}`}>
                        {header.name === 'is_active' ? (
                          rowData[header.name] ? (
                            <span className="badge active">Active</span>
                          ) : (
                            <span className="badge inactive">Inactive</span>
                          )
                        ) : header.name === 'description' ? (
                          <div className={`${styles.ellipsis}`}>
                            {rowData[header.name]}
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

export default ProfileTableListing;
