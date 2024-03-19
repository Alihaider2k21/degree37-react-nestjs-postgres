import {
  OPERATIONS_CENTER_DRIVES_PATH,
  OPERATIONS_CENTER_SESSIONS_PATH,
  OPERATIONS_CENTER_MANAGE_FAVORITES_PATH,
  OPERATIONS_CENTER_NCE,
  OS_PROSPECTS_PATH,
  OPERATIONS_CENTER_RESOURCE_SHARING,
} from '../../../routes/path';
import React, { useState, useEffect, useMemo } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import styles from './index.module.scss';
import SvgComponent from '../SvgComponent';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

export default function OperationsCenterLeftNav() {
  // const { id } = useParams();
  const location = useLocation();
  const menuData = localStorage.getItem('menuItems');

  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [openItems, setOpenItems] = useState([1]);
  const [activeItem, setActiveItem] = useState(null);
  useMemo(() => {
    if (menuData) {
      if (!openItems?.includes(menuData)) {
        setOpenItems(JSON.parse(menuData));
      } else {
        const filteredOpenItems = openItems?.filter(
          (item) => item === menuData
        );
        setOpenItems(filteredOpenItems);
        return setOpenItems(filteredOpenItems);
      }
    }
  }, [menuData]);

  useEffect(() => {
    const activeRoute = menuItems.find((item) =>
      location?.pathname?.includes(item.link)
    );
    if (activeRoute) {
      setActiveItem(activeRoute.id);
      return setActiveItem(activeRoute.id);
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
      link: '#',
      child: {},
      abbrevation: 'DA',
    },
    {
      id: 2,
      hasChild: false,
      name: 'Manage Favorites',
      iconName: 'ManageFavouriteIcon',
      link: OPERATIONS_CENTER_MANAGE_FAVORITES_PATH.LIST,
      child: {},
      abbrevation: 'MF',
    },
    {
      id: 3,
      hasChild: false,
      name: 'Calendar',
      iconName: 'CalenderIcon',
      link: '/operations-center/calendar/ViewCalendar',
      child: {},
      abbrevation: 'CA',
    },
    {
      id: 4,
      hasChild: true,
      name: 'Operations',
      link: '#',
      relevantLinks: [
        OPERATIONS_CENTER_DRIVES_PATH.LIST,
        OPERATIONS_CENTER_DRIVES_PATH.CREATE,
        OPERATIONS_CENTER_DRIVES_PATH.VIEW,
      ],
      iconName: 'OperationNewIcon',
      child: [
        {
          id: 8,
          hasChild: false,
          name: 'Drives',
          iconName: 'DriveNewIcon',
          link: OPERATIONS_CENTER_DRIVES_PATH.LIST,
          relevantLinks: [
            OPERATIONS_CENTER_DRIVES_PATH.LIST,
            OPERATIONS_CENTER_DRIVES_PATH.CREATE,
            OPERATIONS_CENTER_DRIVES_PATH.VIEW,
          ],
        },
        {
          id: 9,
          hasChild: false,
          name: 'Sessions',
          link: OPERATIONS_CENTER_SESSIONS_PATH.LIST,
          relevantLinks: [
            OPERATIONS_CENTER_SESSIONS_PATH.LIST,
            OPERATIONS_CENTER_SESSIONS_PATH.CREATE,
            OPERATIONS_CENTER_SESSIONS_PATH.VIEW,
          ],
          iconName: 'SessionIcon',
        },
        {
          id: 10,
          hasChild: false,
          name: 'Non-Collection Events',
          link: OPERATIONS_CENTER_NCE.LIST,
          relevantLinks: [
            OPERATIONS_CENTER_NCE.LIST,
            OPERATIONS_CENTER_NCE.CREATE,
            OPERATIONS_CENTER_NCE.VIEW,
          ],
          iconName: 'NonCollectionEvenIcon',
        },
      ],
      abbrevation: 'OP',
    },
    {
      id: 5,
      hasChild: false,
      name: 'Resource Sharing',
      iconName: 'ResourceSharingIcon',
      link: OPERATIONS_CENTER_RESOURCE_SHARING.LIST,
      child: {},
      abbrevation: 'LO',
    },
    {
      id: 6,
      hasChild: false,
      name: 'Prospect',
      iconName: 'ProspectIcon',
      link: OS_PROSPECTS_PATH.CREATE,
      child: {},
      abbrevation: 'PR',
    },
    {
      id: 7,
      hasChild: false,
      name: 'Approvals',
      iconName: 'ApprovalIcon',
      link: '#',
      child: {},
      abbrevation: 'NCP',
    },
  ];

  const toggleChild = (itemId) => {
    if (openItems?.includes(itemId)) {
      setOpenItems(openItems.filter((id) => id !== itemId));
      localStorage.setItem(
        'menuItems',
        JSON.stringify(openItems.filter((id) => id !== itemId))
      );
    } else {
      setOpenItems([...openItems, itemId]);
      localStorage.setItem('menuItems', JSON.stringify([itemId]));
    }
  };

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
              <h3>Operations Center</h3>
            </div>
          ) : (
            <OverlayTrigger
              placement="right"
              overlay={(props) => (
                <Tooltip {...props}>Operations Center</Tooltip>
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
                ? menuItems.map((item) => (
                    <li
                      className={`${styles?.menuItem} ${
                        item?.hasChild ? styles.hasChildMain : ''
                      } ${activeItem === item?.id ? styles.active : ''}`}
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
                            <span>{item.name}</span>
                          </Link>
                          <ul
                            className={`${styles.hasChild} ${
                              openItems?.includes(item.id)
                                ? styles.open
                                : styles.close
                            }`}
                          >
                            {item?.child?.map((childItem) => (
                              <li
                                key={childItem.id}
                                className={`menuItem `}
                                id={`menuItem-${childItem.id}`}
                              >
                                <Link
                                  to={childItem.link}
                                  className={
                                    childItem?.relevantLinks?.some((link) =>
                                      window?.location?.pathname?.includes(link)
                                    )
                                      ? styles.activate
                                      : ''
                                  }
                                >
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
                        >
                          <SvgComponent name={item.iconName} />
                          {item.name}
                        </NavLink>
                      )}
                    </li>
                  ))
                : menuItems.map((item) => (
                    <li className={styles.menuItem} key={item.id}>
                      <Link to="#">
                        <SvgComponent name={item.iconName} />
                        {item.abbrevation}
                      </Link>
                    </li>
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
