/* eslint-disable */
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import TopBar from '../../../common/topbar/index';
import SvgComponent from '../../../common/SvgComponent';
import Pagination from '../../../common/pagination/index';
import styles from './index.module.scss';
// import { toast } from "react-toastify";
import { Link, useNavigate } from 'react-router-dom';
import SuccessPopUpModal from '../../../common/successModal';
import Permissions from '../../../../enums/PermissionsEnum';
import CheckPermission from '../../../../helpers/CheckPermissions';
import axios from 'axios';

const RolesList = () => {
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [limit, setLimit] = useState(process.env.REACT_APP_PAGE_LIMIT ?? 10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [childArray, setChildArray] = useState([]);
  const [sortedRoles, setSortedRoles] = useState([]);
  const [reload, setReload] = useState(false);
  const [modalPopUp, setModalPopUp] = useState(false);
  const [roleToArchive, setRoleToArchive] = useState(null);
  const bearerToken = localStorage.getItem('token');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleOpenConfirmation = (id) => {
    setRoleToArchive(id);
    setModalPopUp(true);
  };

  const handleConfirmArchive = async () => {
    setModalPopUp(false);
    if (roleToArchive) {
      const body = {
        is_archived: true,
      };
      const response = await axios.patch(
        `${BASE_URL}/roles/archive/${roleToArchive}`,
        body,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${bearerToken}`,
          },
        }
      );
      let data = await response?.data;
      if (data?.status === 'success') {
        setShowSuccessMessage(true);
        setReload(true);
        // toast.success(data?.response || "Role is archived.", { autoClose: 3000 });
      } else {
        toast.error(data?.response || 'Something went wrong', {
          autoClose: 3000,
        });
      }
    }
  };

  const BreadcrumbsData = [
    {
      label: 'System Configuration',
      class: 'disable-label',
      link: '/dashboard',
    },
    {
      label: 'Roles Administration',
      class: 'disable-label',
      link: '/system-configuration/platform-admin/roles-admin',
    },
  ];
  const getRoles = useCallback(async () => {
    const result = await axios.get(`${BASE_URL}/roles`, {
      params: {
        limit: limit,
        page: currentPage,
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${bearerToken}`,
      },
    });
    const data = await result?.data;
    setTotalRecords(data?.count);
    setSortedRoles(data.data);
  }, [limit, currentPage, BASE_URL]);

  useEffect(() => {
    reload || getRoles();
    return setReload(false);
  }, [getRoles, reload]);

  useEffect(() => {
    recursiveFunction();
  }, [sortedRoles?.length, currentPage]);

  const handleRemovePermission = async (child, roleId) => {
    for (const permission of child?.permissions) {
      const result = await axios.delete(
        `${BASE_URL}/permissions/${parseInt(roleId)}/${parseInt(
          permission.id
        )}`,
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${bearerToken}`,
          },
        }
      );
      const data = await result?.data;
    }
    getRoles();
  };

  const recursiveFunction = (child, roleId) => {
    return (
      <>
        {child?.child_modules?.length > 0 ? (
          child?.child_modules?.map((item, index) => {
            return (
              <React.Fragment key={index} className={'mb-2'}>
                {item?.permissions &&
                  item?.permissions.length > 0 &&
                  item.permissions.map((per, index) => {
                    return <></>;
                  })}
                {item?.child_modules?.length > 0 && recursiveFunction(item)}
              </React.Fragment>
            );
          })
        ) : (
          <React.Fragment>
            {child?.permissions?.length > 0 && (
              <div className={`p-1 px-2  mb-2 mt-2 ${styles.permissionlist}`}>
                {child?.name}
                {child?.permissions?.length !== 1 ? (
                  <span
                    //onClick={() => handleRemovePermission(child, roleId)}
                    className={`${styles.removeicon}`}
                  >
                    {/* <SvgComponent name={"CrossIcon"} /> */}
                  </span>
                ) : (
                  <span
                    onClick={() => handleRemovePermission(child, roleId)}
                    className={styles.removeicon}
                  >
                    {/* <SvgComponent name={"CrossIcon"} /> */}
                  </span>
                )}
              </div>
            )}
            {child?.child_modules?.length > 0 && recursiveFunction(child)}
          </React.Fragment>
        )}
      </>
    );
  };

  const reverseData = () => {
    const tempRoles = [...sortedRoles].reverse();
    const tempChild = [...childArray].reverse();
    setSortedRoles(tempRoles);
    setChildArray(tempChild);
  };
  const handleAddClick = () => {
    navigate(`/system-configuration/platform-admin/roles/create`);
  };

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Roles Administration'}
      />
      <div className="mainContentInner">
        {CheckPermission([
          Permissions.SYSTEM_CONFIGURATION.ROLE_ADMINISTRATION.WRITE,
        ]) && (
          <div className="buttons">
            <button className="btn btn-primary" onClick={handleAddClick}>
              Create Role
            </button>
          </div>
        )}
        <div className="table-listing-main">
          {/* <Scripts setActiveIndex={setActiveIndex} setId={setId} /> */}

          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th width="15%" className={styles.headercolor}>
                    Role Name
                    <div className="sort-icon" onClick={reverseData}>
                      <SvgComponent name={'SortIcon'} />
                    </div>
                  </th>
                  <th className={styles.headercolor} width="70%">
                    Permissions
                  </th>
                  {/* <th width="10%">&nbsp;</th> */}
                  <th width="15%" align="center">
                    <div className="inliner justify-content-center">
                      <span className="title">Actions</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedRoles ? (
                  sortedRoles?.length > 0 ? (
                    sortedRoles?.map((role, index) => {
                      return (
                        <tr key={index}>
                          <td className={` ${styles.flexwrap}`}>
                            {role?.name}
                          </td>

                          <td className="p-0">
                            <div
                              className={`d-flex flex-wrap ${styles.flexwrap}`}
                            >
                              {role?.permission?.application?.map(
                                (applicationItem, applicationIndex) => {
                                  return (
                                    <Fragment key={applicationIndex}>
                                      {applicationItem?.modules?.map(
                                        (permission, indexs) =>
                                          recursiveFunction(permission, role.id)
                                      )}
                                    </Fragment>
                                  );
                                }
                              )}
                            </div>
                          </td>
                          <td className="options">
                            <div className="dropdown-center">
                              <div
                                className="optionsIcon"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                                //  style={{justifyContent:"start",position:"relative"}}
                              >
                                <SvgComponent name={'ThreeDots'} />
                              </div>
                              <ul className="dropdown-menu">
                                {CheckPermission([
                                  Permissions.SYSTEM_CONFIGURATION
                                    .ROLE_ADMINISTRATION.READ,
                                  Permissions.SYSTEM_CONFIGURATION
                                    .ROLE_ADMINISTRATION.WRITE,
                                ]) && (
                                  <li>
                                    <Link
                                      className="dropdown-item"
                                      to={`/system-configuration/platform-admin/roles-admin/${role?.id}/view`}
                                    >
                                      View
                                    </Link>
                                  </li>
                                )}
                                {CheckPermission([
                                  Permissions.SYSTEM_CONFIGURATION
                                    .ROLE_ADMINISTRATION.WRITE,
                                ]) && (
                                  <li>
                                    <Link
                                      className="dropdown-item"
                                      to={`/system-configuration/platform-admin/roles/${role.id}/edit`}
                                    >
                                      Edit
                                    </Link>
                                  </li>
                                )}
                                {CheckPermission([
                                  Permissions.SYSTEM_CONFIGURATION
                                    .ROLE_ADMINISTRATION.ARCHIVE,
                                ]) && (
                                  <li>
                                    <Link
                                      className="dropdown-item"
                                      to={`#`}
                                      onClick={() =>
                                        handleOpenConfirmation(role?.id)
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
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">
                        No data found.
                      </td>
                    </tr>
                  )
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No data found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <Pagination
          limit={limit}
          setLimit={setLimit}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalRecords={totalRecords}
          componentName={'Roles'}
        />
        <SuccessPopUpModal
          title="Confirmation"
          message={'Are you sure you want to archive?'}
          modalPopUp={modalPopUp}
          setModalPopUp={setModalPopUp}
          showActionBtns={false}
          isArchived={true}
          archived={handleConfirmArchive}
        />
        <SuccessPopUpModal
          title="Success!"
          message={'Role is archived.'}
          modalPopUp={showSuccessMessage}
          showActionBtns={true}
          isArchived={false}
          setModalPopUp={setShowSuccessMessage}
          isNavigate={true}
        />
      </div>
    </div>
  );
};

export default RolesList;
