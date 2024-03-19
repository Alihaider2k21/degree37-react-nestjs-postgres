import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import styles from './index.module.scss';
import SvgComponent from '../SvgComponent';
import {
  STAFFING_MANAGEMENT_BUILD_SCHEDULE,
  STAFFING_MANAGEMENT_DASHBOARD,
  STAFFING_MANAGEMENT_STAFF_LIST,
  STAFFING_MANAGEMENT_VIEW_SCHEDULE,
} from '../../../routes/path';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import CheckPermission from '../../../helpers/CheckPermissions';
import StaffingPermissions from '../../../enums/StaffingPermissionsEnum';

export default function StaffingManagementLeftNav() {
  const location = useLocation();
  const menuData = localStorage.getItem('menuItems');

  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [openItems, setOpenItems] = useState([1]);
  const [activeItem, setActiveItem] = useState(null);
  useEffect(() => {
    if (menuData) {
      if (!openItems.includes(menuData)) {
        setOpenItems(JSON.parse(menuData));
      } else {
        const filteredOpenItems = openItems.filter((item) => item === menuData);
        setOpenItems(filteredOpenItems);
      }
    }
  }, [menuData]);

  useEffect(() => {
    const activeRoute = menuItems.find((item) =>
      location.pathname.includes(item.link)
    );

    if (activeRoute) {
      setActiveItem(activeRoute.id);
    }
  }, [location.pathname]);

  const handleMenuClick = (itemId) => {
    setActiveItem(itemId);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const menuItems = [
    {
      id: 1,
      hasChild: false,
      name: 'Dashboard',
      iconName: 'DashboardIcon',
      link: STAFFING_MANAGEMENT_DASHBOARD,
      permission: [
        StaffingPermissions.STAFFING_MANAGEMENT.DASHBOARD.MODULE_CODE,
      ],
      child: {},
      abbrevation: 'DA',
    },
    {
      id: 2,
      hasChild: false,
      name: 'Staff List',
      iconName: 'TenetOnboardingIconSec',
      link: STAFFING_MANAGEMENT_STAFF_LIST,
      permission: [
        StaffingPermissions.STAFFING_MANAGEMENT.STAFF_LIST.MODULE_CODE,
      ],
      child: {},
      abbrevation: 'SL',
    },
    {
      id: 3,
      hasChild: false,
      name: 'View Schedule',
      iconName: 'CalendarIcon',
      link: STAFFING_MANAGEMENT_VIEW_SCHEDULE,
      permission: [
        StaffingPermissions.STAFFING_MANAGEMENT.VIEW_SCHEDULE.MODULE_CODE,
      ],
      child: {},
      abbrevation: 'VS',
    },
    {
      name: 'Build Schedule',
      iconName: 'TenetOnboardingIconSec',
      link: STAFFING_MANAGEMENT_BUILD_SCHEDULE.LIST,
      permission: [
        StaffingPermissions.STAFFING_MANAGEMENT.BUILD_SCHEDULES.MODULE_CODE,
      ],
      child: {},
      abbrevation: 'BS',
    },
  ];

  return (
    <>
      <div
        className={`${styles.sidebarMain} ${isMenuOpen ? '' : styles.closed}`}
      >
        <div className={styles.sidebarTop}>
          {isMenuOpen ? (
            <div className={`${styles.sidebarHeader}`}>
              <div className={`${styles.icon}`} onClick={toggleMenu}>
                <SvgComponent name={'Hamburger'} />
              </div>
              <h3>Staffing Management</h3>
            </div>
          ) : (
            <OverlayTrigger
              placement="right"
              overlay={(props) => (
                <Tooltip {...props}>Staffing Management</Tooltip>
              )}
            >
              <div
                className={`${styles.sidebarHeader} ${styles.sidebarIconPadding}`}
              >
                <div className={`${styles.icon} me-0`} onClick={toggleMenu}>
                  <SvgComponent name={'Hamburger'} />
                </div>
              </div>
            </OverlayTrigger>
          )}
          <div className={styles.sidebarBody}>
            <ul>
              {isMenuOpen
                ? menuItems.map((item) => {
                    const hasPermission = CheckPermission(
                      null,
                      item?.permission
                    );
                    if (hasPermission) {
                      return (
                        <li
                          className={`${styles?.menuItem}  ${
                            styles.openSideBar
                          } ${item?.hasChild ? styles.hasChildMain : ''} ${
                            activeItem === item?.id ? styles.active : ''
                          }
                      ${
                        item?.relevantLinks?.some((link) =>
                          window?.location?.pathname?.includes(link)
                        )
                          ? styles.active
                          : ''
                      }`}
                          id={`menuItem-${item?.id}`}
                          key={item?.id}
                          onClick={() => handleMenuClick(item?.id)}
                        >
                          <NavLink
                            to={item.link}
                            activeclassname={styles.active} // Apply the active class for the active link
                          >
                            <SvgComponent name={item.iconName} />
                            {item.name}
                          </NavLink>
                        </li>
                      );
                    }
                  })
                : menuItems.map((item, key) => (
                    <OverlayTrigger
                      key={key}
                      placement="right"
                      overlay={(props) => (
                        <Tooltip {...props}>{item.name}</Tooltip>
                      )}
                    >
                      <li className={styles.menuItem} key={item.id}>
                        <Link to="#">
                          <SvgComponent name={item.iconName} />
                        </Link>
                      </li>
                    </OverlayTrigger>
                  ))}
            </ul>
          </div>
        </div>

        <div className={styles.sidebarFooter}>
          <span>
            {isMenuOpen ? (
              <>Content copyright &copy; 2023 Degree37 Platform</>
            ) : (
              <>Degree37</>
            )}
          </span>
        </div>
      </div>
    </>
  );
}
