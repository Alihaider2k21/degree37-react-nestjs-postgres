import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SvgComponent from '../../../../../../common/SvgComponent';
import style from '../index.module.scss';
import CheckPermission from '../../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../../enums/PermissionsEnum';

const TableListing = ({
  headers,
  listData,
  setModalState,
  setArchiveId,
  handleSort,
  isLoading,
  setCreatedBy,
}) => {
  const navigate = useNavigate();
  const handleOnClick = (id, user) => {
    setArchiveId(id);
    setCreatedBy(user);
    setModalState(true);
  };
  return (
    <div className="table-listing-main">
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              {headers?.map((item, index) => (
                <th key={index} width={item.width}>
                  {item.label}
                  {item?.sortable ? (
                    <div className="sort-icon" onClick={() => handleSort(item)}>
                      <SvgComponent name={'SortIcon'} />
                    </div>
                  ) : null}
                </th>
              ))}
              <th width="15%" className="text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td className="no-data" colSpan="10">
                  Data Loading
                </td>
              </tr>
            ) : listData?.length > 0 ? (
              listData?.map((item, index) => (
                <tr key={index}>
                  <td>{item?.name}</td>
                  <td>
                    {item?.description?.length > 200
                      ? `${item?.description?.slice(0, 200)} + "..."`
                      : item?.description}
                  </td>
                  <td>
                    {item?.is_active ? (
                      <span className={`${style.listBadge} ${style.active}`}>
                        Active
                      </span>
                    ) : (
                      <span className={`${style.listBadge} ${style.inactive}`}>
                        InActive
                      </span>
                    )}
                  </td>
                  <td className="options">
                    <div className="dropdown-center">
                      <div
                        className="optionsIcon"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <SvgComponent name={'ThreeDots'} />
                      </div>
                      <ul className="dropdown-menu p-0">
                        {CheckPermission([
                          Permissions.CRM_ADMINISTRATION.LOCATIONS.ROOM_SIZES
                            .READ,
                        ]) && (
                          <li>
                            <Link
                              className="dropdown-item"
                              to={`/system-configuration/tenant-admin/crm-admin/locations/room-size/${item?.id}`}
                            >
                              View
                            </Link>
                          </li>
                        )}
                        {CheckPermission([
                          Permissions.CRM_ADMINISTRATION.LOCATIONS.ROOM_SIZES
                            .WRITE,
                        ]) && (
                          <li>
                            <a
                              className="dropdown-item"
                              onClick={() =>
                                navigate(
                                  `/system-configuration/tenant-admin/crm-admin/locations/${item?.id}/edit`,
                                  { state: { room: item } }
                                )
                              }
                            >
                              Edit
                            </a>
                          </li>
                        )}
                        {CheckPermission([
                          Permissions.CRM_ADMINISTRATION.LOCATIONS.ROOM_SIZES
                            .ARCHIVE,
                        ]) && (
                          <li>
                            <Link
                              className="dropdown-item"
                              to="#"
                              onClick={() =>
                                handleOnClick(item?.id, item?.created_by?.id)
                              }
                            >
                              Archive
                            </Link>
                          </li>
                        )}
                      </ul>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="no-data" colSpan="9">
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

export default TableListing;
