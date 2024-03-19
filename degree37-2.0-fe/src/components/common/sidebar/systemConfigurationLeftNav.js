import React, { useState, useEffect, useMemo } from 'react';
import { Link, NavLink, useLocation, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router';
import styles from './index.module.scss';
import SvgComponent from '../SvgComponent';
import {
  MONTHLY_GOALS_PATH,
  TEAMS_PATH,
  USER_ROLES,
  STAFF_SETUP,
  BUSINESS_UNIT_PATH,
  DAILY_GOALS_CALENDAR,
  GOALS_PERFORMANCE_RULES,
} from '../../../routes/path';
import { useAuth } from '../../../components/common/context/AuthContext';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import CheckPermission from '../../../helpers/CheckPermissions.js';
import Permissions from '../../../enums/PermissionsEnum.js';

export default function SystemConfigurationLeftNav() {
  const navigate = useNavigate();

  const { id } = useParams();
  const location = useLocation();
  const menuData = localStorage.getItem('menuItems');
  const { authenticated } = useAuth();

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
    const activeRoute = menuItems.find(
      (item) =>
        location?.pathname?.includes(item.link) ||
        item?.relevantLinks?.some((link) =>
          window?.location?.pathname?.includes(link)
        ) ||
        (item?.hasChild &&
          item?.child?.find((childItem) =>
            childItem?.relevantLinks?.some((link) => {
              return window?.location?.pathname?.includes(link);
            })
          ))
    );

    if (activeRoute) {
      setActiveItem(activeRoute.id);
      if (!openItems?.includes(activeRoute.id)) toggleChild(activeRoute.id);
      return setActiveItem(activeRoute.id);
    }
  }, [location.pathname]);
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

  const handleMenuClick = (itemId) => {
    setActiveItem(itemId);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const menuItems = [
    CheckPermission(
      null,
      Object.entries(Permissions.ORGANIZATIONAL_ADMINISTRATION)
        .map(([key, value]) =>
          Object.entries(value)
            .map(([nestedKey, nestedValue]) => nestedValue.MODULE_CODE)
            .flat()
        )
        .flat()
    ) && {
      id: 1,
      hasChild: true,
      name: 'Organizational Administration',
      // // link: "/#",
      iconName: 'OrganizationalIcon',
      child: [
        CheckPermission(
          null,
          Object.entries(
            Permissions.ORGANIZATIONAL_ADMINISTRATION.HIERARCHY
          ).map(([key, value]) => value.MODULE_CODE)
        ) && {
          id: 2,
          hasChild: false,
          name: 'Hierarchy',
          iconName: 'HeirarchyIcon',
          link: '/system-configuration/organizational-levels',
          relevantLinks: [
            '/system-configuration/organizational-levels',
            '/system-configuration/hierarchy/business-units',
            BUSINESS_UNIT_PATH.CREATE,
            BUSINESS_UNIT_PATH.EDIT.replace(':id', id),
            BUSINESS_UNIT_PATH.VIEW.replace(':id', id),
          ],
          // abbrevation: "DB",
        },
        CheckPermission(
          null,
          Object.entries(Permissions.ORGANIZATIONAL_ADMINISTRATION.GOALS).map(
            ([key, value]) => value.MODULE_CODE
          )
        ) && {
          id: 3,
          hasChild: false,
          iconName: 'GoalsIcon',
          name: 'Goals',
          link: MONTHLY_GOALS_PATH.LIST,
          child: {},
          relevantLinks: [
            '/system-configuration/tenant-administration/organizational-administration/goals/monthly-goals',
            '/system-configuration/tenant-administration/organizational-administration/goals/daily-goals-allocation',
            '/system-configuration/tenant-administration/organizational-administration/goals/performance-rules/view',
            DAILY_GOALS_CALENDAR.VIEW,
            DAILY_GOALS_CALENDAR.EDIT,
            GOALS_PERFORMANCE_RULES.EDIT,
            GOALS_PERFORMANCE_RULES.VIEW,
          ],
          // abbrevation: "DB",
        },
        CheckPermission(
          null,
          Object.entries(
            Permissions.ORGANIZATIONAL_ADMINISTRATION.PRODUCTS_AND_PROCEDURES
          ).map(([key, value]) => value.MODULE_CODE)
        ) && {
          id: 4,
          hasChild: false,
          iconName: 'ProductsIcon',
          name: 'Products & Procedures',
          link: '/system-configuration/tenant-admin/organization-admin/products',
          relevantLinks: [
            '/system-configuration/tenant-admin/organization-admin/products',
            '/system-configuration/tenant-admin/organization-admin/procedures',
            '/system-configuration/tenant-admin/organization-admin/procedures-types',
          ],
          child: {},
          // abbrevation: "DB",
        },
        CheckPermission(
          null,
          Object.entries(
            Permissions.ORGANIZATIONAL_ADMINISTRATION.RESOURCES
          ).map(([key, value]) => value.MODULE_CODE)
        ) && {
          id: 5,
          hasChild: false,
          iconName: 'ResourcesIcon',
          name: 'Resource Management',
          link: '/system-configuration/tenant-admin/organization-admin/resources/devices',
          child: {},
          relevantLinks: [
            '/system-configuration/tenant-admin/organization-admin/resources/devices',
            '/system-configuration/tenant-admin/organization-admin/resource/device-type',
            '/system-configuration/tenant-admin/organization-admin/resources/vehicles',
            '/system-configuration/tenant-admin/organization-admin/resources/vehicle-types',
            '/system-configuration/resource-management/facilities',
          ],
        },
        {
          id: 6,
          hasChild: false,
          iconName: 'LoyaltyIcon',
          name: 'Loyalty Program',
          link: '',
          child: {},
          // abbrevation: "DB",
        },
        CheckPermission(
          null,
          Object.entries(
            Permissions.ORGANIZATIONAL_ADMINISTRATION.CONTENT_MANAGEMENT_SYSTEM
          ).map(([key, value]) => value.MODULE_CODE)
        ) && {
          id: 7,
          hasChild: false,
          iconName: 'ContentIcon',
          name: 'Content Managment System',
          link: '/system-configuration/tenant-admin/organizational-admin/content-management-system/ads/list',
          child: {},
          abbrevation: 'CMS',
          relevantLinks: [
            '/system-configuration/tenant-admin/organizational-admin/content-management-system/ads',
            '/system-configuration/tenant-admin/organizational-admin/content-management-system/ads/list',
            '/system-configuration/platform-admin/email-template',
          ],
        },
        CheckPermission(null, [
          Permissions.ORGANIZATIONAL_ADMINISTRATION.CUSTOM_FIELDS.MODULE_CODE,
        ]) && {
          id: 8,
          hasChild: false,
          iconName: 'CustomFieldIcon',
          name: 'Custom Fields',
          link: '/system-configuration/tenant-admin/organizational-admin/custom-fields/list',
          child: {},
          abbrevation: 'CF',
          relevantLinks: [
            '/system-configuration/tenant-admin/organizational-admin/custom-fields/list',
            '/system-configuration/tenant-admin/organizational-admin/custom-fields/create',
            `/system-configuration/tenant-admin/organizational-admin/custom-fields/${id}/edit`,
            `/system-configuration/tenant-admin/organizational-admin/custom-fields/${id}/view`,
          ],
        },
      ].filter(Boolean),
      abbrevation: 'OA',
    },
    CheckPermission(null, [
      Permissions.GEO_ADMINISTRATION.TERRITORY_MANAGEMENT.MODULE_CODE,
    ]) && {
      id: 8,
      hasChild: false,
      iconName: 'GeoIcon',
      name: 'Geo Administration ',
      link: '/system-configuration/tenant-admin/geo-admin/territories/list',
      child: {},
      relevantLinks: [
        '/system-configuration/tenant-admin/geo-admin/territories',
        '/system-configuration/tenant-admin/geo-admin/territories/create',
        `/system-configuration/tenant-admin/geo-admin/territories/${id}/view`,
        `/system-configuration/tenant-admin/geo-admin/territories/${id}/edit`,
      ],
      abbrevation: 'GA',
    },
    // {
    //   id: 9,
    //   hasChild: true,
    //   name: 'Call Center Administration',
    //   // link: "/system-configuration/platform-admin/tenant-management",
    //   child: [
    //     {
    //       id: 8,
    //       hasChild: false,
    //       name: 'Custom Fields',
    //       // link: "/#",
    //       child: {},
    //       // abbrevation: "DB",
    //     },
    //   ],
    //   abbrevation: 'OA',
    // },
    {
      id: 10,
      hasChild: true,
      iconName: 'CallIcon',
      name: 'Call Center Administration',
      // link: "/system-configuration/platform-admin/tenant-management",
      child: [
        {
          id: 11,
          hasChild: false,
          iconName: 'CallOutIcon',
          name: 'Call Outcomes',
          // link: "/#",
          child: {},
          // abbrevation: "DB",
        },
        {
          id: 12,
          hasChild: false,
          iconName: 'CallCenIcon',
          name: 'Call Center Settings',
          // link: "/#",
          child: {},
          // abbrevation: "DB",
        },
        {
          id: 13,
          hasChild: false,
          name: 'Donor Assertion',
          iconName: 'CallDonIcon',
          // link: "/#",
          child: {},
          // abbrevation: "DB",
        },
      ],
      abbrevation: 'CCA',
    },
    CheckPermission(
      null,
      Object.entries(Permissions.CRM_ADMINISTRATION)
        .map(([key, value]) =>
          Object.entries(value)
            .map(([nestedKey, nestedValue]) => nestedValue.MODULE_CODE)
            .flat()
        )
        .flat()
    ) && {
      id: 14,
      hasChild: true,
      iconName: 'CRM_Icon',
      name: 'CRM Administration',
      child: [
        CheckPermission(
          null,
          Object.entries(Permissions.CRM_ADMINISTRATION.ACCOUNTS).map(
            ([key, value]) => value.MODULE_CODE
          )
        ) && {
          id: 15,
          hasChild: false,
          iconName: 'AccountIcon',
          name: 'Account',
          link: '/system-configuration/tenant-admin/crm-admin/accounts/affiliations',
          child: {},
          relevantLinks: [
            '/system-configuration/tenant-admin/crm-admin/accounts/affiliations',
            '/system-configuration/tenant-admin/crm-admin/accounts/stages',
            '/system-configuration/tenant-admin/crm-admin/accounts/attachment-categories',
            '/system-configuration/tenant-admin/crm-admin/accounts/attachment-subcategories',
            '/system-configuration/tenant-admin/crm-admin/accounts/sources',
            '/system-configuration/tenant-admin/crm-admin/accounts/note-categories',
            '/system-configuration/tenant-admin/crm-admin/accounts/industry-categories',
            '/system-configuration/tenant-admin/crm-admin/accounts/industry-subcategories',
            'system-configuration/tenant-admin/crm-admin/accounts/attachment-categories',
            'system-configuration/tenant-admin/crm-admin/accounts/attachment-subcategories',
            'system-configuration/tenant-admin/crm-admin/accounts/sources',
            '/system-configuration/tenant-admin/crm-admin/accounts/note-categories',
            'system-configuration/tenant-admin/crm-admin/accounts/note-subcategories',
          ],
          // abbrevation: "DB",
        },
        CheckPermission(
          null,
          Object.entries(Permissions.CRM_ADMINISTRATION.CONTACTS).map(
            ([key, value]) => value.MODULE_CODE
          )
        ) && {
          id: 16,
          hasChild: false,
          iconName: 'ContactIcon',
          name: 'Contact',
          link: '/system-configuration/tenant-admin/crm-admin/contacts/roles/list',
          child: {},
          relevantLinks: [
            '/system-configuration/tenant-admin/crm-admin/contacts/roles/list',
            '/system-configuration/tenant-admin/crm-admin/contacts/roles',
            '/system-configuration/tenant-admin/crm-admin/contacts/attachment-categories',
            '/system-configuration/tenant-admin/crm-admin/contacts/attachment-subcategories',
            '/system-configuration/tenant-admin/crm-admin/contacts/note-categories',
            '/system-configuration/tenant-admin/crm-admin/contacts/note-subcategories',
          ],
          // abbrevation: "DB",
        },
        CheckPermission(
          null,
          Object.entries(Permissions.CRM_ADMINISTRATION.LOCATIONS).map(
            ([key, value]) => value.MODULE_CODE
          )
        ) && {
          id: 17,
          hasChild: false,
          iconName: 'LocationIcon',
          name: 'Location',
          link: '/system-configuration/tenant-admin/crm-admin/locations/room-size',
          child: {},
          relevantLinks: [
            '/system-configuration/tenant-admin/crm-admin/locations/room-size',
            '/system-configuration/tenant-admin/crm-admin/locations/attachment-categories',
            '/system-configuration/tenant-admin/crm-admin/locations/attachment-subcategories',
            '/system-configuration/tenant-admin/crm-admin/locations/note-categories',
            '/system-configuration/tenant-admin/crm-admin/locations/note-subcategories',
          ],
          // abbrevation: "DB",
        },
      ],
      abbrevation: 'CRM A',
    },

    CheckPermission(
      null,
      Object.entries(Permissions.OPERATIONS_ADMINISTRATION)
        .map(([key, value]) =>
          Object.entries(value)
            .map(([nestedKey, nestedValue]) => nestedValue.MODULE_CODE)
            .flat()
        )
        .flat()
    ) && {
      id: 18,
      hasChild: true,
      iconName: 'OperationIcon',
      name: 'Operations Administration',
      child: [
        CheckPermission(
          null,
          Object.entries(
            Permissions.OPERATIONS_ADMINISTRATION.BOOKING_DRIVES
          ).map(([key, value]) => value.MODULE_CODE)
        ) && {
          id: 19,
          hasChild: false,
          iconName: 'BookingIcon',
          name: 'Booking Drives',
          link: '/system-configuration/operations-admin/booking-drives/booking-rule',
          child: {},
          relevantLinks: [
            '/system-configuration/operations-admin/booking-drives/booking-rule',
            '/system-configuration/operations-admin/booking-drives/daily-hours',
            '/system-configuration/operations-admin/booking-drives/daily-capacities',
            '/system-configuration/operations-admin/booking-drives/operation-status',
            '/system-configuration/tenant-admin/operations-admin/booking-drives/task-management',
            '/system-configuration/tenant-admin/operations-admin/booking-drives/task-management/list',
          ],
        },
        CheckPermission(
          null,
          Object.entries(Permissions.OPERATIONS_ADMINISTRATION.CALENDAR).map(
            ([key, value]) => value.MODULE_CODE
          )
        ) && {
          id: 20,
          hasChild: false,
          iconName: 'CalenderIcon',
          name: 'Calendar',
          link: '/system-configuration/tenant-admin/operations-admin/calendar/banners',
          child: {},
          relevantLinks: [
            '/system-configuration/tenant-admin/operations-admin/calendar/banners',
            '/system-configuration/tenant-admin/operations-admin/calendar/lock-dates',
            '/system-configuration/tenant-admin/operations-admin/calendar/close-dates',
            '/system-configuration/tenant-admin/operations-admin/calendar/goal-variance',
          ],
        },
        CheckPermission(
          null,
          Object.entries(
            Permissions.OPERATIONS_ADMINISTRATION.MARKETING_EQUIPMENTS
          ).map(([key, value]) => value.MODULE_CODE)
        ) && {
          id: 21,
          hasChild: false,
          iconName: 'MarketingIcon',
          name: 'Marketing & Equipment',
          link: '/system-configuration/tenant-admin/operations-admin/marketing-equipment/promotions',
          child: {},
          relevantLinks: [
            '/system-configuration/tenant-admin/operations-admin/marketing-equipment/promotions',
            '/system-configuration/tenant-admin/operations-admin/marketing-equipment/promotional-items',
            '/system-configuration/tenant-admin/operations-admin/marketing-equipment/marketing-material/list',
            '/system-configuration/tenant-admin/operations-admin/marketing-equipment/approvals',
            '/system-configuration/tenant-admin/operations-admin/marketing-equipment/marketing-material',
            '/system-configuration/tenant-admin/operations-admin/marketing-equipment/equipments/list',
            '/system-configuration/tenant-admin/operations-admin/marketing-equipment/equipments',
          ],
        },
        CheckPermission(
          null,
          Object.entries(
            Permissions.OPERATIONS_ADMINISTRATION.NOTES_AND_ATTACHMENTS
          ).map(([key, value]) => value.MODULE_CODE)
        ) && {
          id: 22,
          hasChild: false,
          iconName: 'NotesIcon',
          name: 'Notes & Attachments',
          link: '/system-configuration/tenant-admin/operations-admin/notes-attachments/attachment-categories',
          child: {},
          relevantLinks: [
            '/system-configuration/tenant-admin/operations-admin/notes-attachments/attachment-categories',
            '/system-configuration/tenant-admin/operations-admin/notes-attachments/attachment-subcategories',
            '/system-configuration/tenant-admin/operations-admin/notes-attachments/note-categories/list',
            '/system-configuration/tenant-admin/operations-admin/notes-attachments/note-categories',
            '/system-configuration/tenant-admin/operations-admin/notes-attachments/note-subcategories',
            '/system-configuration/tenant-admin/operations-admin/notes-attachments/note-subcategories/list',
          ],
        },
        CheckPermission(
          null,
          Object.entries(
            Permissions.OPERATIONS_ADMINISTRATION.NON_COLLECTION_EVENTS
          ).map(([key, value]) => value.MODULE_CODE)
        ) && {
          id: 23,
          hasChild: false,
          iconName: 'NonCollection',
          name: 'Non Collection Events',
          link: '/system-configuration/tenant-admin/operations-admin/nce-categories/list',
          child: {},
          relevantLinks: [
            '/system-configuration/tenant-admin/operations-admin/nce-categories/list',
            '/system-configuration/tenant-admin/operations-admin/nce-categories',
            '/system-configuration/tenant-admin/operations-admin/nce-subcategories',
            '/system-configuration/tenant-admin/operations-admin/nce-subcategories/list',
          ],
        },
      ],
      abbrevation: 'OA',
    },
    CheckPermission(
      null,
      Object.entries(Permissions.STAFF_ADMINISTRATION).map(
        ([key, value]) => value.MODULE_CODE
      )
    ) && {
      id: 24,
      hasChild: true,
      iconName: 'StaffIcon',
      name: 'Staff Administration',
      // link: "/system-configuration/platform-admin/roles-admin",
      child: [
        CheckPermission(null, [
          Permissions.STAFF_ADMINISTRATION.STAFF_SETUPS.MODULE_CODE,
        ]) && {
          id: 25,
          hasChild: false,
          iconName: 'StaffSetupIcon',
          name: 'Staff Setups',
          link: STAFF_SETUP.LIST,
          child: {},
          relevantLinks: [
            '/system-configuration/tenant-admin/staffing-admin/staff-setup',
          ],
        },
        CheckPermission(
          null,
          Object.entries(Permissions.STAFF_ADMINISTRATION.CLASSIFICATIONS).map(
            ([key, value]) => value.MODULE_CODE
          )
        ) && {
          id: 26,
          hasChild: false,
          iconName: 'ClassificationIcon',
          name: 'Classifications',
          link: '/system-configuration/tenant-admin/staffing-admin/classifications/list',
          child: {},
          relevantLinks: [
            '/system-configuration/tenant-admin/staffing-admin/classifications/list',
            '/system-configuration/tenant-admin/staffing-admin/classifications',
            '/system-configuration/tenant-admin/staffing-admin/classifications/settings',
            '/system-configuration/tenant-admin/staffing-admin/classifications/settings/list',
          ],
        },
        CheckPermission(null, [
          Permissions.STAFF_ADMINISTRATION.LEAVE_TYPES.MODULE_CODE,
        ]) && {
          id: 27,
          hasChild: false,
          iconName: 'LeaveIcon',
          name: 'Leave Types',
          link: '/system-configuration/tenant-admin/staffing-admin/leave-types/list',
          child: {},
          relevantLinks: [
            '/system-configuration/tenant-admin/staffing-admin/leave-types',
          ],
        },
        CheckPermission(
          null,
          Object.entries(Permissions.STAFF_ADMINISTRATION.CERTIFICATIONS).map(
            ([key, value]) => value.MODULE_CODE
          )
        ) && {
          id: 28,
          hasChild: false,
          iconName: 'CertificationIcon',
          name: 'Certifications',
          link: '/system-configuration/tenant-admin/staffing-admin/certifications',
          child: {},
          relevantLinks: [
            '/system-configuration/tenant-admin/staffing-admin/certifications',
          ],
        },
        CheckPermission(
          null,
          Object.entries(Permissions.STAFF_ADMINISTRATION.TEAMS).map(
            ([key, value]) => value.MODULE_CODE
          )
        ) && {
          id: 29,
          hasChild: false,
          iconName: 'TeamIcon',
          name: 'Teams',
          link: TEAMS_PATH.LIST,
          child: {},
          relevantLinks: [
            '/system-configuration/staffing-admin/teams',
            '/system-configuration/staffing-admin/teams/members',
          ],
        },
      ],
      abbrevation: 'SA',
    },
    CheckPermission(
      null,
      Object.entries(Permissions.USER_ADMINISTRATIONS).map(
        ([key, value]) => value.MODULE_CODE
      )
    ) && {
      id: 30,
      hasChild: true,
      iconName: 'UserIcon',
      name: 'User Administration',
      child: [
        CheckPermission(null, [
          Permissions.USER_ADMINISTRATIONS.USER_ROLES.MODULE_CODE,
        ]) && {
          id: 31,
          hasChild: false,
          iconName: 'UserRolesIcon',
          name: 'User Roles',
          link: USER_ROLES.LIST,
          child: {},
          relevantLinks: [
            '/system-configuration/tenant-administration/users-administration/user-roles',
          ],
        },
        CheckPermission(null, [
          Permissions.USER_ADMINISTRATIONS.USERS.MODULE_CODE,
        ]) && {
          id: 32,
          hasChild: false,
          iconName: 'User_Icon',
          name: 'Users',
          link: '/system-configuration/tenant-admin/user-admin/users',
          child: {},
          relevantLinks: [
            '/system-configuration/tenant-admin/user-admin/users',
          ],
        },
      ].filter(Boolean),
      abbrevation: 'UA',
    },
  ].filter(Boolean);
  // const toggleChild = (itemId) => {
  //   if (openItems.includes(itemId)) {
  //     setOpenItems(openItems.filter((id) => id !== itemId));
  //   } else {
  //     setOpenItems([...openItems, itemId]);
  //   }
  // };
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
              <h3>System Configuration</h3>
            </div>
          ) : (
            <OverlayTrigger
              placement="right"
              overlay={(props) => (
                <Tooltip {...props}>System Configuration</Tooltip>
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
                        <Link
                          to="#"
                          className="ps-0"
                          style={{ placeContent: 'center' }}
                        >
                          <SvgComponent name={item.iconName} />
                        </Link>
                      </li>
                    </OverlayTrigger>
                  ))}
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
                <OverlayTrigger
                  placement="right"
                  overlay={(props) => <Tooltip {...props}>Logout</Tooltip>}
                >
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
                </OverlayTrigger>
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
