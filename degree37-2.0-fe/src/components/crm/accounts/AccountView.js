import React, { useEffect, useState } from 'react';
import TopBar from '../../common/topbar/index';
import viewimage from '../../../assets/images/viewimage.png';
import styles from './accounts.module.scss';
import './accountView.scss';
import AccountViewNavigationTabs from './navigationTabs';
import AccountViewHeader from './header';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { makeAuthorizedApiRequest } from '../../../helpers/Api';
import CrmPermissions from '../../../enums/CrmPermissionsEnum';
import CheckPermission from '../../../helpers/CheckPermissions';
import { CRMAccountsBreadCrumbsData } from './AccountsBreadCrumbsData';
import { OPERATIONS_CENTER_DRIVES_PATH } from '../../../routes/path';
import AccountsViewRoutes from '../../../routes/crm/accounts/view/index';

function AccountView() {
  const location = useLocation();
  const currentLocation = location.pathname;
  const { account_id } = useParams();
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [accountData, setAccountData] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [viewNumbersPercentage, setViewNumbersPrcentage] = useState('numbers');
  const [viewProductsProcedure, setViewProductsProcedure] =
    useState('products');

  useEffect(() => {
    getAccountData(account_id);
  }, [account_id]);

  const getAccountData = async (account_id) => {
    const result = await makeAuthorizedApiRequest(
      'GET',
      `${BASE_URL}/accounts/${account_id}`
    );
    const { data } = await result.json();
    setAccountData(data);
  };

  const BreadcrumbsData = [
    ...CRMAccountsBreadCrumbsData,
    {
      label: 'View Account',
      class: 'disable-label',
      link: `/crm/accounts/${account_id}/view/about`,
    },
    {
      label:
        currentLocation === `/crm/accounts/${account_id}/view/about`
          ? 'About'
          : currentLocation === `/crm/accounts/${account_id}/blueprint`
          ? 'Blueprints'
          : currentLocation === `/crm/accounts/${account_id}/tasks`
          ? 'Tasks'
          : currentLocation ===
              `/crm/accounts/${account_id}/view/documents/notes` ||
            currentLocation.includes(
              `/crm/accounts/${account_id}/view/documents/notes`
            ) ||
            currentLocation.includes(
              `/crm/accounts/${account_id}/view/documents/attachments`
            ) ||
            currentLocation ===
              `/crm/accounts/${account_id}/view/documents/attachments`
          ? 'Document'
          : currentLocation === `/crm/accounts/${account_id}/view/drive-history`
          ? 'Drives History'
          : currentLocation === `/crm/accounts/${account_id}/view/duplicates`
          ? 'Duplicates'
          : null,
      class: 'disable-label',
      link:
        currentLocation ===
          `/crm/accounts/${account_id}/view/documents/notes` ||
        currentLocation ===
          `/crm/accounts/${account_id}/view/documents/attachments`
          ? `/crm/accounts/${account_id}/view/documents/notes`
          : '#',
    },
  ];

  const searchFieldChange = (e) => {
    setSearchText(e.target.value);
  };
  return (
    <div className={styles.accountViewMain}>
      <div className="mainContent">
        <TopBar
          BreadCrumbsData={
            currentLocation ===
            `/crm/accounts/${account_id}/view/documents/notes`
              ? [
                  ...BreadcrumbsData,
                  {
                    label: 'Notes',
                    class: 'active-label',
                    link: `/crm/accounts/${account_id}/view/documents/notes`,
                  },
                ]
              : currentLocation.includes(
                  `/crm/accounts/${account_id}/view/documents/notes`
                ) && currentLocation.includes(`/view`)
              ? [
                  ...BreadcrumbsData,
                  {
                    label: 'Notes',
                    class: 'active-label',
                    link: `/crm/accounts/${account_id}/view/documents/notes`,
                  },
                  {
                    label: 'View Note',
                    class: 'active-label',
                    link: `#`,
                  },
                ]
              : currentLocation ===
                `/crm/accounts/${account_id}/view/documents/attachments`
              ? [
                  ...BreadcrumbsData,
                  {
                    label: 'Attachments',
                    class: 'active-label',
                    link: `/crm/accounts/${account_id}/view/documents/attachments`,
                  },
                ]
              : currentLocation.includes(
                  `/crm/accounts/${account_id}/view/documents/attachments`
                ) && currentLocation.includes(`/view`)
              ? [
                  ...BreadcrumbsData,
                  {
                    label: 'Attachments',
                    class: 'active-label',
                    link: `/crm/accounts/${account_id}/view/documents/attachments`,
                  },
                  {
                    label: 'View Attachment',
                    class: 'active-label',
                    link: `#`,
                  },
                ]
              : BreadcrumbsData
          }
          BreadCrumbsTitle={
            currentLocation === `/crm/accounts/${account_id}/view/about`
              ? 'About'
              : currentLocation === `/crm/accounts/${account_id}/blueprint`
              ? 'Blueprints'
              : currentLocation === `/crm/accounts/${account_id}/tasks`
              ? 'Tasks'
              : currentLocation ===
                  `/crm/accounts/${account_id}/view/documents/notes` ||
                currentLocation.includes(
                  `/crm/accounts/${account_id}/view/documents/notes`
                )
              ? 'Notes'
              : currentLocation ===
                  `/crm/accounts/${account_id}/view/documents/attachments` ||
                currentLocation.includes(
                  `/crm/accounts/${account_id}/view/documents/attachments`
                )
              ? 'Attachments'
              : currentLocation ===
                `/crm/accounts/${account_id}/view/drive-history`
              ? 'Drives History'
              : currentLocation ===
                `/crm/accounts/${account_id}/view/duplicates`
              ? 'Duplicates'
              : null
          }
          SearchValue={
            currentLocation === `/crm/accounts/${account_id}/tasks` ||
            currentLocation ===
              `/crm/accounts/${account_id}/view/documents/notes` ||
            currentLocation ===
              `/crm/accounts/${account_id}/view/documents/attachments` ||
            currentLocation === `/crm/accounts/${account_id}/view/duplicates` ||
            currentLocation === `/crm/accounts/${account_id}/blueprint`
              ? searchText
              : null
          }
          SearchOnChange={
            currentLocation === `/crm/accounts/${account_id}/tasks` ||
            currentLocation ===
              `/crm/accounts/${account_id}/view/documents/notes` ||
            currentLocation ===
              `/crm/accounts/${account_id}/view/documents/attachments` ||
            currentLocation === `/crm/accounts/${account_id}/view/duplicates` ||
            currentLocation === `/crm/accounts/${account_id}/blueprint`
              ? searchFieldChange
              : null
          }
          SearchPlaceholder={
            currentLocation === `/crm/accounts/${account_id}/tasks` ||
            currentLocation ===
              `/crm/accounts/${account_id}/view/documents/notes` ||
            currentLocation ===
              `/crm/accounts/${account_id}/view/documents/attachments` ||
            currentLocation === `/crm/accounts/${account_id}/view/duplicates` ||
            currentLocation === `/crm/accounts/${account_id}/blueprint`
              ? 'Search'
              : null
          }
        />
        <div className="imageMainContent">
          <div className="d-flex align-items-center gap-3 ">
            <img
              src={viewimage}
              className="bg-white heroIconImg"
              alt="CancelIcon"
            />
            <AccountViewHeader />
          </div>
          <div className="d-flex align-items-center justify-between">
            <AccountViewNavigationTabs />
            {currentLocation === `/crm/accounts/${account_id}/view/about` && (
              <div className="d-flex align-items-center gap-3">
                {CheckPermission([CrmPermissions.CRM.ACCOUNTS.WRITE]) && (
                  <button
                    className="btn btn-md btn-link p-0 editBtn"
                    color="primary"
                    onClick={() => navigate(`/crm/accounts/${account_id}/edit`)}
                  >
                    <FontAwesomeIcon
                      className="m-1"
                      width={15}
                      height={15}
                      icon={faPenToSquare}
                    />
                    Edit Account
                  </button>
                )}
                {CheckPermission([
                  CrmPermissions.CRM.ACCOUNTS.SCHEDULE_DRIVE,
                ]) && (
                  <Link
                    to={`${OPERATIONS_CENTER_DRIVES_PATH.CREATE}?accountId=${account_id}`}
                    className="btn btn-md btn-primary scheduleBtn"
                  >
                    Schedule Drive
                  </Link>
                )}
              </div>
            )}
            {currentLocation ===
              `/crm/accounts/${account_id}/view/drive-history` && (
              <div className="d-flex align-items-center gap-3">
                <button
                  className="btn btn-md btn-link p-0 editBtn"
                  color="primary"
                  onClick={() => {
                    if (viewNumbersPercentage === 'numbers')
                      setViewNumbersPrcentage('percentage');
                    else setViewNumbersPrcentage('numbers');
                  }}
                >
                  {viewNumbersPercentage === 'percentage'
                    ? 'View as Numbers'
                    : 'View as Percentage'}
                </button>
                <button
                  className="btn btn-md btn-link p-0 editBtn"
                  color="primary"
                  onClick={() => {
                    if (viewProductsProcedure === 'products')
                      setViewProductsProcedure('procedures');
                    else setViewProductsProcedure('products');
                  }}
                >
                  {viewProductsProcedure === 'products'
                    ? 'View as Procedures'
                    : 'View as Products'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <AccountsViewRoutes
        accountData={accountData}
        setAccountData={setAccountData}
        searchText={searchText}
        setSearchText={setSearchText}
        viewNumbersPercentage={viewNumbersPercentage}
        viewProductsProcedure={viewProductsProcedure}
      />
    </div>
  );
}

export default AccountView;
