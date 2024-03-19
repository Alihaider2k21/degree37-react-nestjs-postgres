import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import styles from './index.module.scss';
import SvgComponent from '../SvgComponent';
import { CRM_DONORS_CENTERS, CRM_PATH } from '../../../routes/path';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import CrmPermissions from '../../../enums/CrmPermissionsEnum';
import CheckPermission from '../../../helpers/CheckPermissions';

export default function CRMLeftNav() {
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
      /* Doing below if statement to highlight accounts when
         user click on dashboard as it is not designed yet 
         Later this should be removed!
        */
      if (activeRoute.link === '/crm/accounts') {
        setActiveItem(2);
        return;
      }
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
      link: CRM_PATH,
      permission: [CrmPermissions.CRM.DASHBOARD.MODULE_CODE],
      child: {},
      abbrevation: 'DA',
    },
    {
      id: 2,
      hasChild: false,
      name: 'Accounts',
      iconName: 'TenetOnboardingIconSec',
      link: '/crm/accounts',
      permission: [CrmPermissions.CRM.ACCOUNTS.MODULE_CODE],
      child: {},
      abbrevation: 'AC',
    },
    {
      id: 3,
      hasChild: false,
      name: 'Contacts',
      iconName: 'CRMContactIcon',
      link: CheckPermission(null, [
        CrmPermissions.CRM.CONTACTS.VOLUNTEERS.MODULE_CODE,
      ])
        ? '/crm/contacts/volunteers'
        : CheckPermission(null, [CrmPermissions.CRM.CONTACTS.DONOR.MODULE_CODE])
        ? '/crm/contacts/donor'
        : CheckPermission(null, [CrmPermissions.CRM.CONTACTS.STAFF.MODULE_CODE])
        ? '/crm/contacts/staff'
        : '',
      permission: [
        CrmPermissions.CRM.CONTACTS.VOLUNTEERS.MODULE_CODE,
        CrmPermissions.CRM.CONTACTS.DONOR.MODULE_CODE,
        CrmPermissions.CRM.CONTACTS.STAFF.MODULE_CODE,
      ],
      child: {},
      relevantLinks: [
        '/crm/contacts/volunteers',
        '/crm/contacts/volunteer',
        '/crm/contacts/donor',
        '/crm/contacts/staff',
      ],
      abbrevation: 'CO',
    },
    {
      id: 4,
      hasChild: false,
      iconName: 'CRMLocationIcon',
      name: 'Locations',
      link: '/crm/locations',
      permission: [CrmPermissions.CRM.LOCATIONS.MODULE_CODE],
      child: {},
      abbrevation: 'LO',
    },
    {
      id: 5,
      hasChild: false,
      iconName: 'CRMDonorIcon',
      name: 'Donors Centers',
      link: CRM_DONORS_CENTERS.LIST,
      permission: [CrmPermissions.CRM.DONOR_CENTERS.MODULE_CODE],
      child: {},
      relevantLinks: [CRM_DONORS_CENTERS.LIST, '/crm/donor-center'],
      abbrevation: 'DC',
    },
    {
      id: 6,
      hasChild: false,
      iconName: 'CRMNonCollectionsIcon',
      name: 'Non-Collection Profiles',
      link: '/crm/non-collection-profiles',
      permission: [CrmPermissions.CRM.NON_COLLECTION_PROFILES.MODULE_CODE],
      child: {},
      abbrevation: 'NCP',
    },
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
          {isMenuOpen ? (
            <div className={`${styles.sidebarHeader}`}>
              <div className={`${styles.icon}`} onClick={toggleMenu}>
                <SvgComponent name={'Hamburger'} />
              </div>
              <h3>CRM</h3>
            </div>
          ) : (
            <OverlayTrigger
              placement="right"
              overlay={(props) => <Tooltip {...props}>CRM</Tooltip>}
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
                          {item?.hasChild ? (
                            <>
                              <Link
                                to={item.link}
                                onClick={() => toggleChild(item.id)}
                                className={
                                  item?.relevantLinks?.some((link) =>
                                    window?.location?.pathname?.includes(link)
                                  )
                                    ? `${styles.active}`
                                    : ''
                                }
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
                                    className={`menuItem ${
                                      location?.pathname?.includes('goal') &&
                                      childItem?.link?.includes('goal')
                                        ? styles.active
                                        : ''
                                    }`}
                                    id={`menuItem-${childItem.id}`}
                                  >
                                    <NavLink
                                      to={childItem.link}
                                      className={({ isActive }) => {
                                        if (
                                          childItem.name === 'Classifications'
                                        ) {
                                          if (
                                            location?.pathname?.includes(
                                              'classifications/settings/list'
                                            ) ||
                                            location?.pathname?.includes(
                                              'classifications/list'
                                            )
                                          ) {
                                            return styles.active;
                                          }
                                        } else if (isActive) {
                                          return `${styles.active}`;
                                        } else {
                                          return '';
                                        }
                                      }}
                                    >
                                      {childItem.name}
                                    </NavLink>
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
                      );
                    }
                  })
                : menuItems.map((item, key) => (
                    <OverlayTrigger
                      key={key}
                      // show={true}
                      placement="right"
                      overlay={(props) => (
                        <Tooltip {...props}>{item.name}</Tooltip>
                      )}
                    >
                      <li className={styles.menuItem} key={item.id}>
                        <Link to="#">
                          <SvgComponent name={item.iconName} />
                          {/* {item.abbrevation} */}
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
