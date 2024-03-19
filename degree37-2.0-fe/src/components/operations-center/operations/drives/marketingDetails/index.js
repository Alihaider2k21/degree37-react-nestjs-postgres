import React from 'react';
import '../../../../../styles/Global/Global.scss';
import '../../../../../styles/Global/Variable.scss';

import Approved from '../../../../../assets/approved.png';
import SvgComponent from '../../../../common/SvgComponent';
import { API } from '../../../../../api/api-routes';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { makeAuthorizedApiRequest } from '../../../../../helpers/Api';
import { useParams } from 'react-router-dom';
import AddAccountsModal from '../create/add-accounts-modal';
import CancelModalPopUp from '../../../../common/cancelModal';
// import ContactsSection from './contacts';
// import { formatDate } from '@storybook/blocks';

function MarketingDetails({ driveData, isLoading, getDriveData }) {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const { id } = useParams();
  const [marketingDetail, setMarketingDetail] = useState();
  const [addAccountsModal, setAddAccountsModal] = useState(false);
  // const [driveData, setDriveData] = useState();
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [accountsSearchText, setAccountsSearchText] = useState('');
  const [accountRows, setAccountRows] = useState([]);
  const [deleteAccountModal, setDeleteAccountModal] = useState(false);
  const [deleteAccountId, setDeleteAccountId] = useState('');

  const getMaretingDetails = async () => {
    try {
      const result = await makeAuthorizedApiRequest(
        'GET',
        `${BASE_URL}/accounts/drives/marketing-details/?driveId=${id}`
      );
      const data = await result.json();
      setMarketingDetail(data?.data);
    } catch (error) {
      toast.error('Error fetching marketing details');
    }
  };

  // Fetch Supplemental accounts Start
  const fetchAllSupplementalAccounts = async () => {
    try {
      const { data } =
        await API.crm.crmAccounts.getAllRecruiterAccountsByRecruiterId(
          driveData?.drive?.recruiter_id,
          accountsSearchText
        );
      console.log('data.data:', data.data);
      console.log(
        'marketingDetail?.supplemental_recruitment?.accounts:',
        marketingDetail?.supplemental_recruitment?.accounts
      );

      const allAccounts = data.data.filter(
        (i) =>
          !marketingDetail?.supplemental_recruitment?.accounts
            ?.map((j) => j.account_id)
            ?.includes(i.id)
      );

      console.log('Filtered Accounts:', allAccounts);
      setAccountRows(allAccounts);
    } catch (error) {
      toast.error(`Failed to fetch table data ${error}`, { autoClose: 3000 });
    }
  };

  useEffect(() => {
    getMaretingDetails();
  }, [driveData, deleteAccountModal === false]);

  useEffect(() => {
    if (
      (accountsSearchText?.length >= 3 || accountsSearchText?.length == 0) &&
      driveData
    )
      fetchAllSupplementalAccounts();
  }, [marketingDetail, accountsSearchText, deleteAccountModal === false]);

  const submitAccounts = async () => {
    const body = selectedAccounts.map((i) => ({
      drive_id: parseInt(id),
      account_id: parseInt(i),
    }));
    try {
      const response = await makeAuthorizedApiRequest(
        'POST',
        `${BASE_URL}/accounts/drives`,
        JSON.stringify(body)
      );
      const res = await response.json();
      if (res?.status === 'success') {
        setSelectedAccounts([]);
        getMaretingDetails();
      } else {
        toast.error('Error adding account');
      }
    } catch (error) {
      toast.error('Error creating accounts');
    }
  };

  const onDeleteAccount = async () => {
    try {
      const response = await makeAuthorizedApiRequest(
        'PUT',
        `${BASE_URL}/accounts/${deleteAccountId}/marketing-material/${id}`
      );
      const data = await response.json();
      if (data.status === 'success') {
        setDeleteAccountId('');
      } else {
        toast.error('Error deleting accounts');
      }
    } catch (error) {
      toast.error('Error deleting accounts');
    }
  };

  const getFormatedDate = (orderDueDate) => {
    if (orderDueDate) {
      const date = new Date(orderDueDate);
      const day = date.getDate();
      const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();

      const formattedDate = `${day} ${month} ${year}`;
      return formattedDate; // Output: "12 July 2023"
    } else {
      console.log('Order due date is not available.');
    }
  };

  useEffect(() => {
    if (selectedAccounts?.length) submitAccounts();
  }, [selectedAccounts]);
  if (isLoading) return null;
  return (
    <div className="row row-gap-4 aboutAccountMain">
      <div className="col-12 col-md-6">
        <table className="viewTables w-100 mt-0 marketing-table">
          <thead>
            <tr>
              <th colSpan="2">Marketing Details</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="tableTD col1">Online Scheduling</td>
              <td className="tableTD col2">
                {marketingDetail?.marketing_details?.online_scheduling_allowed
                  ? 'Yes'
                  : 'No'}
              </td>
            </tr>
            <tr>
              <td className="tableTD col1">Start Date & Time</td>
              <td className="tableTD col2">
                {marketingDetail?.marketing_details?.start_date
                  ? moment(
                      marketingDetail?.marketing_details?.start_date
                    ).format('MM-DD-YYYY')
                  : ''}
                ,{' '}
                {marketingDetail?.marketing_details?.start_time
                  ? moment(
                      marketingDetail?.marketing_details?.start_time
                    ).format('h:mm A')
                  : ''}
              </td>
            </tr>
            <tr>
              <td className="tableTD col1">End Date & Time</td>
              <td className="tableTD col2">
                {marketingDetail?.marketing_details?.end_date
                  ? moment(marketingDetail?.marketing_details?.end_date).format(
                      'MM-DD-YYYY'
                    )
                  : ''}
                ,{' '}
                {marketingDetail?.marketing_details?.end_time
                  ? moment(marketingDetail?.marketing_details?.end_time).format(
                      'h:mm A'
                    )
                  : ''}
              </td>
            </tr>
            <tr>
              <td className="tableTD col1">Instructional Information</td>
              <td className="tableTD col2">
                {marketingDetail?.marketing_details?.instructional_info}
              </td>
            </tr>
            <tr>
              <td className="tableTD col1">Donor Information</td>
              <td className="tableTD col2">
                {marketingDetail?.marketing_details?.donor_info}
              </td>
            </tr>
            <tr className="marketing-heading">
              <td className="tableTD col1">Marketing Materials</td>
              <td className="tableTD col2" align="right">
                <img src={Approved} alt="Check" />
                Approved
              </td>
            </tr>
            <tr className="bg-white">
              <td colSpan={2}>
                <div className="row">
                  <div className="col-5">
                    <strong>Approval Details</strong>
                  </div>
                  <div className="col-3">
                    <strong>No. of Items</strong>
                  </div>
                  <div className="col-4 text-right">
                    <strong>Order Due</strong>
                  </div>
                </div>
              </td>
            </tr>
            <tr className="bg-white">
              <td colSpan={2}>
                <div className="row">
                  <div className="col-5">
                    John Doe
                    <span> 23 July 2023 | 04:56 PM</span>
                  </div>
                  <div className="col-3">
                    {
                      marketingDetail?.marketing_materials?.drive_material_items
                        ?.length
                    }
                  </div>
                  <div className="col-4 text-right">
                    {getFormatedDate(
                      marketingDetail?.marketing_materials?.order_due_date
                    )}
                  </div>
                </div>
              </td>
            </tr>
            <tr className="parent-table">
              <td colSpan={2}>
                <table className="w-100">
                  <div className="row">
                    {marketingDetail?.marketing_materials?.drive_material_items?.map(
                      (i) => (
                        <div className="col-md-6" key={i}>
                          <tr className="bg-white">
                            <td className="col-3">
                              <strong>Items</strong>
                            </td>
                            <td className="col-1">
                              <strong>Qty</strong>
                            </td>
                          </tr>
                          <tr>
                            <td className="col-3">{i.items}</td>
                            <td className="col-1">{i.quantity}</td>
                          </tr>
                        </div>
                      )
                    )}
                  </div>
                </table>
              </td>
            </tr>
            <tr className="marketing-heading">
              <td className="tableTD col1">Promotional Items</td>
              <td className="tableTD col2" align="right">
                <img src={Approved} alt="Check" />
                Approved
              </td>
            </tr>
            <tr className="bg-white">
              <td colSpan={2}>
                <div className="row">
                  <div className="col-5">
                    <strong>Approval Details</strong>
                  </div>
                  <div className="col-3">
                    <strong>No. of Items</strong>
                  </div>
                  <div className="col-4 text-right"></div>
                </div>
              </td>
            </tr>
            <tr className="bg-white">
              <td colSpan={2}>
                <div className="row">
                  <div className="col-5">
                    John Doe
                    <span> 23 July 2023 | 04:56 PM</span>
                  </div>
                  <div className="col-3">
                    {
                      marketingDetail?.promotional_materials
                        ?.drive_promotional_items?.length
                    }
                  </div>
                  <div className="col-4 text-right"></div>
                </div>
              </td>
            </tr>
            <tr className="parent-table">
              <td colSpan={2}>
                <table className="w-100">
                  <div className="row">
                    {marketingDetail?.promotional_materials?.drive_promotional_items?.map(
                      (i) => (
                        <div className="col-md-6" key={i}>
                          <tr className="bg-white">
                            <td className="col-3">
                              <strong>Items</strong>
                            </td>
                            <td className="col-1">
                              <strong>Qty</strong>
                            </td>
                          </tr>
                          <tr>
                            <td className="col-3">{i.items}</td>
                            <td className="col-1">{i.quantity}</td>
                          </tr>
                        </div>
                      )
                    )}
                  </div>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="col-12 col-md-6">
        <table className="viewTables w-100 mt-0 marketing-table ">
          <thead>
            <tr>
              <th colSpan="2">Donor Communication</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white">
              <td colSpan={2} className="p-15">
                <strong>Telerecruitment</strong>
              </td>
            </tr>
            <tr>
              <td className="tableTD col1">Ordered</td>
              <td className="tableTD col2">
                {marketingDetail?.donor_communication?.telerecruitment_enabled
                  ? 'Yes'
                  : 'No'}
              </td>
            </tr>
            <tr>
              <td className="tableTD col1">Order Status</td>
              <td className="tableTD col2">
                <span
                  className={
                    marketingDetail?.donor_communication
                      ?.telerecruitment_status === 'approved'
                      ? 'approved'
                      : 'pending'
                  }
                ></span>
                {marketingDetail?.donor_communication
                  ?.telerecruitment_status === 'approved'
                  ? 'Approved'
                  : 'Pending'}
              </td>
            </tr>
            <tr className="bg-white">
              <td colSpan={2} className="p-15">
                <strong>Email</strong>
              </td>
            </tr>
            <tr>
              <td className="tableTD col1">Ordered</td>
              <td className="tableTD col2">
                {marketingDetail?.donor_communication?.email_enabled
                  ? 'Yes'
                  : 'No'}
              </td>
            </tr>
            <tr>
              <td className="tableTD col1">Order Status</td>
              <td className="tableTD col2">
                <span
                  className={
                    marketingDetail?.donor_communication?.email_status ===
                    'approved'
                      ? 'approved'
                      : 'pending'
                  }
                ></span>
                {marketingDetail?.donor_communication?.email_status ===
                'approved'
                  ? 'Approved'
                  : 'Pending'}
              </td>
            </tr>
            <tr className="bg-white">
              <td colSpan={2} className="p-15">
                <strong>SMS</strong>
              </td>
            </tr>
            <tr>
              <td className="tableTD col1">Ordered</td>
              <td className="tableTD col2">
                {marketingDetail?.donor_communication?.sms_enabled
                  ? 'Yes'
                  : 'No'}
              </td>
            </tr>
            <tr>
              <td className="tableTD col1">Order Status</td>
              <td className="tableTD col2">
                <span
                  className={
                    marketingDetail?.donor_communication?.sms_status ===
                    'approved'
                      ? 'approved'
                      : 'pending'
                  }
                ></span>
                {marketingDetail?.donor_communication?.sms_status === 'approved'
                  ? 'Approved'
                  : 'Pending'}
              </td>
            </tr>
          </tbody>
        </table>
        <table className="viewTables w-100 mt-4 marketing-table">
          <thead>
            <tr>
              <th colSpan="5">
                <div className="d-flex align-items-center justify-between w-100">
                  <span>Supplemental Recruitment</span>
                  <button
                    className="btn btn-link btn-md bg-transparent"
                    onClick={() => setAddAccountsModal(true)}
                  >
                    Add Account
                  </button>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="overflow-y-auto w-100">
            <tr className="bg-white position-sticky top-0 w-100">
              <td
                className="p-15 tableTD tableHead"
                style={{ width: '10%', whiteSpace: 'nowrap' }}
              >
                <strong>BECS Code</strong>
              </td>
              <td
                className="p-15 tableTD tableHead"
                style={{ width: '15%', whiteSpace: 'nowrap' }}
              >
                <strong>Account</strong>
              </td>
              <td
                className="p-15 tableTD tableHead"
                style={{ width: '25%', whiteSpace: 'nowrap' }}
              >
                <strong>City</strong>
              </td>
              <td
                className="p-15 tableTD tableHead"
                style={{ width: '25%', whiteSpace: 'nowrap' }}
              >
                <strong>Collection Operation</strong>
              </td>
              <td
                className="p-15 tableTD tableHead"
                style={{ width: '5%' }}
              ></td>
            </tr>
            {marketingDetail?.supplemental_recruitment?.accounts?.map((i) => (
              <tr className="bg-white" key={i}>
                <td className="tableTD col2">{i.becs_code}</td>
                <td className="tableTD col2 ">{i.name}</td>
                <td className="tableTD col2 text-capitalize ">
                  {i.city}, {i.state}
                </td>
                <td className="tableTD col2 text-capitalize ">
                  {i.collection_operation}
                </td>
                <td className="tableTD col2">
                  <div
                    onClick={() => {
                      setDeleteAccountModal(true);
                      setDeleteAccountId(i.account_id);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <SvgComponent name={'DrivesCrossIcon'} />
                  </div>
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan={2} className="p-15">
                Zip Code
              </td>
              <td colSpan={3} className="bg-white">
                {marketingDetail?.supplemental_recruitment?.zipCodes?.map(
                  (i) => (
                    <span className="bg-grey" key={i}>
                      {i}
                    </span>
                  )
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <AddAccountsModal
        setAddAccountsModal={setAddAccountsModal}
        addAccountsModal={addAccountsModal}
        selectedAccounts={selectedAccounts}
        setSelectedAccounts={setSelectedAccounts}
        accountRows={accountRows}
        accountsSearchText={accountsSearchText}
        setAccountsSearchText={setAccountsSearchText}
      />
      <CancelModalPopUp
        title="Confirmation"
        message="Are you sure you want to delete this account?"
        modalPopUp={deleteAccountModal}
        setModalPopUp={setDeleteAccountModal}
        methodsToCall={true}
        methods={onDeleteAccount}
      />
    </div>
  );
}

export default MarketingDetails;
