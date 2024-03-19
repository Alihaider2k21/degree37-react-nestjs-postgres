import React, { useEffect, useRef, useState } from 'react';
import styles from './index.module.scss';
import Notification from '../../../assets/Vector.svg';
import TaskPopUp from '../../../assets/Task-popup.svg';
import Logo from '../../../assets/logo.svg';
import { useNavigate } from 'react-router';
import { useAuth } from '../../../components/common/context/AuthContext';
import SvgComponent from '../SvgComponent';
import { Link } from 'react-router-dom';
import jwt from 'jwt-decode';
import Permissions from '../../../enums/PermissionsEnum.js';
import CheckPermission from '../../../helpers/CheckPermissions.js';
import CrmPermissions from '../../../enums/CrmPermissionsEnum.js';
import ApplicationPermissions from '../../../enums/ApplicationPermissionsEnum.js';
const Header = () => {
  const navigate = useNavigate();
  const { authenticated } = useAuth();
  const [userData, setUserData] = useState({});
  const jwtToken = localStorage.getItem('token');
  const decodeToken = jwt(jwtToken);
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [isLogoutVisible, setLogoutVisible] = useState(false);
  const containerRef = useRef(null);

  const toggleLogout = () => {
    setLogoutVisible(!isLogoutVisible);
  };

  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setLogoutVisible(false);
      }
    }

    window.addEventListener('mousedown', handleOutsideClick);

    return () => {
      window.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);
  useEffect(() => {
    const getData = async (id) => {
      if (id) {
        const result = await fetch(`${BASE_URL}/user/${id}`, {
          headers: { authorization: `Bearer ${jwtToken}` },
        });

        if (result?.status === 200) {
          let { data } = await result.json();
          setUserData({ ...data, role: data?.role?.name });
        }
      }
    };

    if (decodeToken?.id) {
      getData(decodeToken?.id);
    }
  }, []);

  const getInitials = () => {
    const firstNameInitial = userData?.first_name ? userData.first_name[0] : '';
    const lastName = userData?.last_name || '';
    const lastNameInitial = lastName.split(' ').pop()[0];
    return `${firstNameInitial}${lastNameInitial}`;
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('menuItems');
      authenticated.logout();
      navigate('/login');
    } catch (e) {
      console.log(e);
      navigate('/login');
    }
  };
  const navigatePath = () => {
    navigate('/system-configuration/tasks');
  };
  return (
    <div className={styles.header}>
      <div className={styles.left}>
        <div className={styles.logo}>
          <Link to="/tenant-dashboard">
            <img src={Logo} alt="logo" />
          </Link>
        </div>
      </div>
      <div className={styles.right}>
        {!decodeToken?.super_admin && (
          <div className={styles.topMenu}>
            <div>
              {CheckPermission(null, null, [
                CrmPermissions.CRM.APPLICATION_CODE,
              ]) && (
                <Link to="/crm/accounts">
                  <SvgComponent name={'TopMenuCRMIcon'} />
                  CRM
                </Link>
              )}
            </div>
            <div>
              {CheckPermission(null, null, [ApplicationPermissions.Flow]) && (
                <Link to="#">
                  <SvgComponent name={'TopMenuFlowIcon'} />
                  Flow
                </Link>
              )}
            </div>
            <div>
              {CheckPermission(null, null, [
                ApplicationPermissions.CALL_CENTER_MANAGER,
              ]) && (
                <Link to="#">
                  <SvgComponent name={'TopMenuCallCenterIcon'} />
                  Call Center
                </Link>
              )}
            </div>
            <div>
              {CheckPermission(null, null, [
                ApplicationPermissions.STAFFING_MANAGEMENT,
              ]) && (
                <Link to="/staffing-management/staff-list">
                  <SvgComponent name={'TopMenuStaffingManagementIcon'} />
                  Staffing Management
                </Link>
              )}
            </div>
            <div>
              {CheckPermission(null, null, [
                ApplicationPermissions.OPERATION_CENTER,
              ]) && (
                <Link to="/operations-center">
                  <SvgComponent name={'TopMenuOperationCenterIcon'} />
                  Operations Center
                </Link>
              )}
            </div>
            <div>
              {CheckPermission(null, null, [
                ApplicationPermissions.REPORTS,
              ]) && (
                <Link to="#">
                  <SvgComponent name={'TopMenuReportsIcon'} />
                  Reports
                </Link>
              )}
            </div>
            <div>
              {CheckPermission(null, null, [
                ApplicationPermissions.DONOR_PORTAL,
              ]) && (
                <Link to="#">
                  <SvgComponent name={'TopMenuOperationCenterIcon'} />
                  Donor Portal
                </Link>
              )}
            </div>
            <div>
              {CheckPermission(null, null, [
                ApplicationPermissions.CHAIRPERSON_PORTAL,
              ]) && (
                <Link to="#">
                  <SvgComponent name={'TopMenuChairpersonPortalIcon'} />
                  Chairperson Portal
                </Link>
              )}
            </div>
            {CheckPermission(null, null, [
              Permissions.SYSTEM_CONFIGURATION.APPLICATION_CODE,
            ]) && (
              <div>
                <Link to="/system-configuration">
                  <SvgComponent name={'TopMenuSystemConfigurationIcon'} />
                  System Configurations
                </Link>
              </div>
            )}
          </div>
        )}
        <div
          className="d-flex align-items-center"
          style={{ marginLeft: 'auto' }}
        >
          {!decodeToken?.super_admin && (
            <div
              onClick={navigatePath}
              className={`me-2 ${styles.notification} ${styles.pointer}`}
            >
              <img src={TaskPopUp} className="" alt="notebook" />
            </div>
          )}
          <div className={styles.notification}>
            <img src={Notification} className="" alt="notification" />
          </div>
          <div
            className={styles.optionsDropdown}
            ref={containerRef}
            onClick={toggleLogout}
          >
            {/* <img src={Avatar} alt="profile" />
             */}
            {userData?.first_name && userData?.last_name && (
              <div className={styles.avatar}>{getInitials()}</div>
            )}
            <span>{`${userData?.first_name ? userData.first_name : ''}  ${
              userData?.last_name ? userData.last_name : ''
            }`}</span>
            {isLogoutVisible && (
              <div className={styles.widget} onClick={handleLogout}>
                <SvgComponent name={'Logout'} />
                <p className="mb-0 ms-2">Logout</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
