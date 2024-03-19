import React from 'react';
import { Link /* useNavigate */ } from 'react-router-dom';
import SvgComponent from '../../../../../common/SvgComponent';
import style from '../index.module.scss';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';

const TableView = ({
  headers,
  listData,
  setModalState,
  setArchiveId,
  setCreatedBy,
  handleSort,
  isLoading,
}) => {
  //const navigate = useNavigate();
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
            <tr className="container">
              {headers?.map((item, index) => (
                <th
                  key={index}
                  width={item.width}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  {item?.splitlabel
                    ? item?.label.split(' ').map((word, i) => (
                        <React.Fragment key={i}>
                          {i > 0 && <br />} {word}
                        </React.Fragment>
                      ))
                    : item.label}
                  {/* {item.label} */}
                  {item?.sortable ? (
                    <div className="sort-icon" onClick={() => handleSort(item)}>
                      <SvgComponent name={'SortIcon'} />
                    </div>
                  ) : null}
                </th>
              ))}
              <th width="auto" className="text-center">
                Actions
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
            ) : listData?.length > 0 ? (
              listData?.map((item, index) => (
                <tr key={index}>
                  <td>{item?.name}</td>
                  <td>{item?.short_name}</td>
                  <td>{item?.opeartion_type_id}</td>
                  <td>{item?.location_type_id}</td>
                  <td>{item?.beds}</td>
                  <td>{item?.concurrent_beds}</td>
                  <td>{item?.stagger_slots}</td>
                  <td>{item?.procedure_type_id?.name}</td>
                  <td>
                    {item?.is_active ? (
                      <span className={`${style.listBadge} ${style.active}`}>
                        Active
                      </span>
                    ) : (
                      <span className={`${style.listBadge} ${style.inactive}`}>
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="options" style={{ textAlign: 'center' }}>
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
                          Permissions.STAFF_ADMINISTRATION.STAFF_SETUPS.READ,
                        ]) && (
                          <li>
                            <Link
                              className="dropdown-item"
                              to={`/system-configuration/tenant-admin/staffing-admin/staff-setup/${item?.id}`}
                            >
                              View
                            </Link>
                          </li>
                        )}
                        {CheckPermission([
                          Permissions.STAFF_ADMINISTRATION.STAFF_SETUPS.WRITE,
                        ]) && (
                          <li>
                            <Link
                              className="dropdown-item"
                              to={`/system-configuration/tenant-admin/staffing-admin/staff-setup/${item?.id}/edit`}
                            >
                              Edit
                            </Link>
                          </li>
                        )}
                        {CheckPermission([
                          Permissions.STAFF_ADMINISTRATION.STAFF_SETUPS.ARCHIVE,
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
                <td className="no-data" colSpan="10">
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

export default TableView;
