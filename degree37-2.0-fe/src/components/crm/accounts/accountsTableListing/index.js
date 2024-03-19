import React, { useState } from 'react';
import SvgComponent from '../../../common/SvgComponent';
import { useNavigate } from 'react-router-dom';
import * as _ from 'lodash';
import './index.scss';
import CheckBoxFilterClosed from '../../../../assets/images/checkbox-filter-closed.png';
import CheckBoxFilterOpen from '../../../../assets/images/checkbox-filter-open.png';
import Dropdown from 'react-bootstrap/Dropdown';

const TableList = ({
  isLoading,
  data,
  headers,
  handleSort,
  optionsConfig,
  setTableHeaders,
  allAddresses,
}) => {
  const navigate = useNavigate();
  const [showColumnToggle, setShowColumnToggle] = useState(false);

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
          {optionsConfig?.map(
            (option) =>
              option && (
                <li key={option?.label}>
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
                    href="javascript:void(0);"
                  >
                    {option?.label}
                  </a>
                </li>
              )
          )}
        </ul>
      </div>
    );
  };

  const checkboxTableItems = [
    'BECS Code',
    'Name',
    'Collection Operation',
    'City',
    'State',
    'Category',
    'Subcategory',
    'Recruiter',
    'Stage',
    'Source',
    'Territory',
    'Population',
    'RSMO',
    'Status',
  ];
  const handleCheckbox = (e, label) => {
    const dupArr = [...headers];
    const index = dupArr.findIndex((item) => item?.label === label);

    if (index !== -1) {
      dupArr[index].visible = e.target.checked;
      setTableHeaders(dupArr);
    }
  };

  const setDropdown = () => {
    setShowColumnToggle(!showColumnToggle);
  };

  return (
    <div className="table-listing-main">
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              {_.compact(headers).map(
                (header) =>
                  header.visible && (
                    <th
                      key={header.name}
                      width={header.width}
                      style={{ minWidth: `${header.minWidth}` }}
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
                            <span className="title">{header?.label}</span>
                          )}
                        </div>
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
                  )
              )}
              <th align="center" width="150px">
                <div className="flex align-items-center justify-content-center">
                  <div className="account-list-header dropdown-center ">
                    <Dropdown show={showColumnToggle} onToggle={setDropdown}>
                      <Dropdown.Toggle
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: 'unset',
                          margin: 'unset',
                        }}
                        onClick={setDropdown}
                      >
                        {showColumnToggle ? (
                          <img
                            src={CheckBoxFilterOpen}
                            style={{ width: '18px', height: '16px' }}
                          />
                        ) : (
                          <img
                            src={CheckBoxFilterClosed}
                            style={{ width: '18px', height: '16px' }}
                          />
                        )}
                      </Dropdown.Toggle>
                      <Dropdown.Menu style={{ width: '14rem' }} align={'end'}>
                        {checkboxTableItems.map((option, index) => (
                          <li key={index}>
                            <div className="flex align-items-center gap-2 checkboxInput">
                              <input
                                type="checkbox"
                                value={headers.some(
                                  (item) => item?.label === option
                                )}
                                checked={headers[index].visible}
                                style={{
                                  height: '20px',
                                  width: '20px',
                                  borderRadius: '4px',
                                }}
                                onChange={(e) => handleCheckbox(e, option)}
                              />
                              <span>{option}</span>
                            </div>
                          </li>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
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
                    {_.compact(headers).map(
                      (header, index) =>
                        header.visible && (
                          <td key={`${rowData.id}-${index}`}>
                            {header.name === 'is_active' ? (
                              rowData[header.name] ? (
                                <span className="badge active">Active</span>
                              ) : (
                                <span className="badge inactive">Inactive</span>
                              )
                            ) : header.name === 'name' ? (
                              <div className="text-nowrap">
                                {rowData[header.name]}
                              </div>
                            ) : header.name === 'collection_operation' ? (
                              <div className="text-nowrap">
                                {rowData[header.name]?.name}
                              </div>
                            ) : header.name === 'city' ? (
                              <div className="text-nowrap">
                                {allAddresses[rowData?.id]?.city || ''}
                              </div>
                            ) : header.name === 'state' ? (
                              <div className="text-nowrap">
                                {allAddresses[rowData?.id]?.state || ''}
                              </div>
                            ) : header.name === 'industry_category' ? (
                              <div className="text-nowrap">
                                {rowData[header.name]?.name}
                              </div>
                            ) : header.name === 'industry_subcategory' ? (
                              <div className="text-nowrap">
                                {rowData[header.name]?.name}
                              </div>
                            ) : header.name === 'recruiter' ? (
                              <div className="text-nowrap">
                                {`${rowData[header.name]?.first_name} 
                            ${rowData[header.name]?.last_name || ''}`}
                              </div>
                            ) : header.name === 'stage' ? (
                              <div className="text-nowrap">
                                {rowData[header.name]?.name}
                              </div>
                            ) : header.name === 'source' ? (
                              <div className="text-nowrap">
                                {rowData[header.name]?.name}
                              </div>
                            ) : header.name === 'territory' ? (
                              <div className="text-nowrap">
                                {rowData[header.name]?.territory_name}
                              </div>
                            ) : header.name === 'RSMO' ? (
                              <div className="text-nowrap">
                                {rowData[header.name] ? 'Yes' : 'No'}
                              </div>
                            ) : (
                              rowData[header.name]
                            )}
                          </td>
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
