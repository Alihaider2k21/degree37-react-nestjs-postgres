import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useLocation, useNavigate, useParams } from 'react-router';
import styles from './index.module.scss';
import SvgComponent from '../../common/SvgComponent';
import { useAuth } from '../../../components/common/context/AuthContext';
import Permissions from '../../../enums/PermissionsEnum';
import CheckPermission from '../../../helpers/CheckPermissions';

export default function Sidebar() {
  const navigate = useNavigate();
  // const location = useLocation();
  const { authenticated } = useAuth();
  const menuData = localStorage.getItem('menuItems');
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [openItems, setOpenItems] = useState([]);
  const [activeItem, setActiveItem] = useState(null);
  const { id } = useParams();

  const handleLogout = async () => {
    try {
      localStorage.removeItem('menuItems');
      localStorage.removeItem('token');
      authenticated.logout();
      navigate('/login');
    } catch (e) {
      console.log(e);
      navigate('/login');
    }
  };

  useEffect(() => {
    function checkScreenWidth() {
      setIsMenuOpen(window.innerWidth >= 1200);
    }

    // Add an event listener for the window resize event
    window.addEventListener('resize', checkScreenWidth);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', checkScreenWidth);
    };
  }, [window.innerWidth >= 1200]);

  const location = useLocation();
  useEffect(() => {
    const activeRoute = menuItems.find((item) =>
      location.pathname.includes(item.link)
    );
    if (activeRoute) {
      setActiveItem(activeRoute.id);
      return setActiveItem(activeRoute.id);
    }
  }, [location.pathname]);
  useEffect(() => {
    if (menuData) {
      if (!openItems.includes(menuData)) {
        setOpenItems(JSON.parse(menuData));
      } else {
        const filteredOpenItems = openItems.filter((item) => item === menuData);
        setOpenItems(filteredOpenItems);
        return setOpenItems(filteredOpenItems);
      }
    }
  }, [menuData]);

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
      iconName: 'DashboardIcon',
      name: 'Dashboard',
      link: '/dashboard',
      permission: [Permissions.SYSTEM_CONFIGURATION.DASHBOARD.MODULE_CODE],
      child: {},
      abbrevation: 'DB',
    },
    {
      id: 2,
      hasChild: false,
      iconName: 'TenetOnboardingIconSec',
      name: 'Tenants Onboarding',
      link: '/system-configuration/platform-admin/tenant-management/create',
      permission: [Permissions.SYSTEM_CONFIGURATION.TENANT_MANAGEMENT.WRITE],
      child: {},
      abbrevation: 'TOB',
    },
    {
      id: 3,
      hasChild: false,
      iconName: 'TenetManagementIconSec',
      name: 'Tenant Management',
      link: '/system-configuration/platform-admin/tenant-management',
      permission: [
        Permissions.SYSTEM_CONFIGURATION.TENANT_MANAGEMENT.MODULE_CODE,
      ],
      child: {},
      abbrevation: 'TM',
    },
    {
      id: 4,
      hasChild: false,
      iconName: 'UserAdministrationIconSec',
      name: 'User Administration',
      link: '/system-configuration/platform-admin/user-administration/users',
      permission: [
        Permissions.SYSTEM_CONFIGURATION.USER_ADMINISTRATION.MODULE_CODE,
      ],
      child: {},
      abbrevation: 'UA',
    },
    {
      id: 5,
      hasChild: false,
      iconName: 'RolesAdministrationIconSec',
      name: 'Roles Administration',
      link: '/system-configuration/platform-admin/roles-admin',
      permission: [
        Permissions.SYSTEM_CONFIGURATION.ROLE_ADMINISTRATION.MODULE_CODE,
      ],
      relevantLinks: [
        '/system-configuration/platform-admin/roles-admin',
        '/system-configuration/platform-admin/roles/create',
        `/system-configuration/platform-admin/roles/${id}/edit`,
        '/system-configuration/platform-admin/tenant-management/:id/view',
      ],
      child: {},
      abbrevation: 'RM',
    },
    {
      id: 6,
      hasChild: false,
      iconName: 'ManagementIconSec',
      name: 'Log and Event Management',
      link: '/system-configuration/reports',
      permission: [
        Permissions.SYSTEM_CONFIGURATION.LOG_AND_EVENT_MANAGEMENT.MODULE_CODE,
      ],
      child: {},
      abbrevation: 'LEM',
    },
    // {
    //   id: 7,
    //   hasChild: true,
    //   iconName: 'CRM_Icon',
    //   name: 'CRM Administration',
    //   //link: "/system-configuration/reports",
    //   child: [
    //     {
    //       id: 8,
    //       hasChild: false,
    //       iconName: 'LocationIcon',
    //       name: 'Locations',
    //       link: '/system-configuration/tenant-admin/crm-admin/locations/room-size',
    //       child: {},
    //       abbrevation: 'LOC',
    //     },
    //   ],
    //   abbrevation: 'CMA',
    // },
  ];
  const toggleChild = (itemId) => {
    if (openItems.includes(itemId)) {
      setOpenItems(openItems.filter((id) => id !== itemId));
      localStorage.setItem(
        'menuItems',
        JSON.stringify(openItems.filter((id) => id !== itemId))
      );
    } else {
      setOpenItems([...openItems, itemId]);
      localStorage.setItem('menuItems', JSON.stringify([...openItems, itemId]));
    }
  };
  return (
    <>
      <div
        className={`${styles.sidebarMain} ${isMenuOpen ? '' : styles.closed}`}
      >
        <div className={styles.sidebarTop}>
          <div className={styles.sidebarHeader}>
            <div className={styles.icon} onClick={toggleMenu}>
              <SvgComponent name={'Hamburger'} />
            </div>
            {isMenuOpen ? <h3>System Configuration</h3> : <h3>SC</h3>}
          </div>
          <div className={styles.sidebarBody}>
            <ul>
              {isMenuOpen
                ? menuItems.map((item) => {
                    let hasPermission;
                    if (item?.id === 2) {
                      hasPermission = CheckPermission(item?.permission);
                    } else {
                      hasPermission = CheckPermission(null, item?.permission);
                    }
                    if (hasPermission) {
                      return (
                        <li
                          className={`${styles?.menuItem} ${
                            item?.hasChild ? styles.hasChildMain : ''
                          } ${activeItem === item?.id ? styles.active : ''}
                          ${
                            item?.relevantLinks?.some((link) =>
                              window?.location?.pathname?.includes(link)
                            )
                              ? styles.active
                              : ''
                          }
                          `}
                          id={`menuItem-${item?.id}`}
                          key={item?.id}
                          onClick={() => handleMenuClick(item?.id)}
                        >
                          {item?.hasChild ? (
                            <>
                              <Link
                                to={item.link}
                                onClick={() => toggleChild(item.id)}
                              >
                                <SvgComponent name={item.iconName} />
                                {item.name}
                              </Link>
                              <ul
                                className={`${styles.hasChild} ${
                                  openItems.includes(item.id)
                                    ? styles.open
                                    : styles.close
                                }`}
                              >
                                {item?.child?.map((childItem) => (
                                  <li
                                    key={childItem.id}
                                    className="menuItem"
                                    id={`menuItem-${childItem.id}`}
                                  >
                                    <Link to={childItem.link}>
                                      <SvgComponent name={childItem.iconName} />
                                      {childItem.name}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </>
                          ) : (
                            <NavLink
                              to={item.link}
                              activeClassName={styles.active} // Apply the active class for the active link
                              className={
                                window.location.pathname === item.link
                                  ? styles.activate
                                  : ''
                              }
                            >
                              <SvgComponent name={item.iconName} />
                              {item.name}
                            </NavLink>
                          )}
                        </li>
                      );
                    }
                  })
                : menuItems.map((item) => {
                    let hasPermission;
                    if (item?.id === 2) {
                      hasPermission = CheckPermission(item?.permission);
                    } else {
                      hasPermission = CheckPermission(null, item?.permission);
                    }
                    if (hasPermission) {
                      return (
                        <li className={styles.menuItem} key={item.id}>
                          <Link
                            to="#"
                            className="ps-0"
                            style={{ placeContent: 'center' }}
                          >
                            {/* {item.abbrevation} */}
                            <SvgComponent name={item.iconName} />
                          </Link>
                        </li>
                      );
                    }
                  })}
              {isMenuOpen ? (
                <li className={styles.menuItem}>
                  <Link
                    to="/login"
                    className="text-decoration-none"
                    onClick={handleLogout}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="30"
                      height="26"
                      fill="currentColor"
                      className="bi bi-box-arrow-right "
                      viewBox="0 0 16 16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"
                      />
                      <path
                        fillRule="evenodd"
                        d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"
                      />
                    </svg>

                    <span className="ps-2">Logout</span>
                  </Link>
                </li>
              ) : (
                <li className={styles.menuItem}>
                  <Link
                    to="/login"
                    className="text-decoration-none ps-0 pe-3"
                    onClick={handleLogout}
                    style={{ placeContent: 'center' }}
                  >
                    <SvgComponent name={'Logout'} />
                  </Link>
                </li>
              )}
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
