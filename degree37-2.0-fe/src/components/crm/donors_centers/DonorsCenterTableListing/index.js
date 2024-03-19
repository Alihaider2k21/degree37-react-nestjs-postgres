import React, { useState } from 'react';
import SvgComponent from '../../../common/SvgComponent';
import { useNavigate } from 'react-router-dom';
import * as _ from 'lodash';
import './index.scss';

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
          {optionsConfig.map((option) =>
            option ? (
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
                  href="javascript:void(0);"
                >
                  {option.label}
                </a>
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
    'BECS Code',
    'Name',
    'City',
    'State',
    'Staging Facility',
    'Collection Operation',
    'Status',
    'Alternate Name',
    'Physical Address',
    'Zip Code',
    'County',
    'Phone',
    'Industry Category',
    'Industry Subcategory',
    'Donor Center',
    'Staging Site',
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
                          {header.name === 'status' ? (
                            rowData[header.name] ? (
                              <span className="badge active">Active</span>
                            ) : (
                              <span className="badge inactive">Inactive</span>
                            )
                          ) : header.name === 'staging_site' ? (
                            rowData[header.name] ? (
                              <span>Yes</span>
                            ) : (
                              <span>No</span>
                            )
                          ) : header.name === 'collection_operation' ? (
                            <div>{rowData[header.name]?.name}</div>
                          ) : header.name === 'industry_category' ? (
                            <div>{rowData[header.name]?.name}</div>
                          ) : header.name === 'industry_sub_category' ? (
                            <div>{rowData[header.name]?.name}</div>
                          ) : header.name === 'donor_center' ? (
                            <div>Yes</div>
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
