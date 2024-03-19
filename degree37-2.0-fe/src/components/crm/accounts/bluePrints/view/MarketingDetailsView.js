import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import TopBar from '../../../../common/topbar/index';
import '../index.scss';
import styles from './index.module.scss';
import { CRMAccountsBreadCrumbsData } from '../../AccountsBreadCrumbsData';
import AccountViewHeader from '../../header';
import LocationAboutNavigationTabs from '../../../accounts/navigationTabs';
import Approved from '../../../../../assets/approved.png';
import viewimage from '../../../../../assets/images/viewimage.png';
import { CRM_ACCOUNT_BLUEPRINT_PATH } from '../../../../../routes/path';
import SvgComponent from '../../../../common/SvgComponent';
import { makeAuthorizedApiRequest } from '../../../../../helpers/Api';
// import { DashDateFormat } from '../../../../../helpers/formatDate';
import AddAccountsModal from '../../../../operations-center/operations/drives/create/add-accounts-modal';
import { API } from '../../../../../api/api-routes';
import { toast } from 'react-toastify';
import SuccessPopUpModal from '../../../../common/successModal';
import ConfirmModal from '../../../../common/confirmModal';
import ConfirmArchiveIcon from '../../../../../assets/images/ConfirmArchiveIcon.png';
import moment from 'moment';

const MarketingDetailsView = () => {
  const { account_id, id } = useParams();
  const [marketingDetails, setMarketingDetails] = useState([]);
  const [marketingMaterials, setMarketingMaterials] = useState([]);
  const [promotionalMaterials, setPromotionalMaterials] = useState([]);
  const [supplementalRecruiment, setSupplementalRecruiment] = useState([]);
  const [zipCodes, setzipCodes] = useState([]);
  const [donorCommunication, setdonorCommunication] = useState([]);
  const [addAccountsModal, setAddAccountsModal] = useState(false);
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [accountsSearchText, setAccountsSearchText] = useState('');
  const [accountRows, setAccountRows] = useState([]);
  const [archiveModalPopUp, setArchiveModalPopUp] = useState(false);
  const [submitModalPopUp, setSubmitModalPopUp] = useState(false);
  const [itemToArchive, setItemToArchive] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const BreadcrumbsData = [
    ...CRMAccountsBreadCrumbsData,
    {
      label: 'View Account',
      class: 'disable-label',
      link: `/crm/accounts/${account_id}/view/about`,
    },
    {
      label: 'Blueprints',
      class: 'active-label',
      link: `/crm/accounts/${account_id}/blueprint`,
    },
    {
      label: 'Marketing Details',
      class: 'active-label',
      link: `/crm/accounts/${account_id}/blueprint/${id}/marketing-details`,
    },
  ];

  // Fetch Marketing materials Start
  const getMarketingDetails = async () => {
    try {
      const result = await makeAuthorizedApiRequest(
        'GET',
        `${BASE_URL}/accounts/drives/marketing-details?account_id=${account_id}&bluePrint_id=${id}`
      );
      let { data } = await result.json();
      setMarketingDetails(data?.marketing_details);
      setMarketingMaterials(data?.marketing_materials);
      setPromotionalMaterials(data?.promotional_materials);
      setSupplementalRecruiment(data?.supplemental_recruitment?.accounts);
      setzipCodes(data?.supplemental_recruitment?.zipCodes);
      setdonorCommunication(data?.donor_communication);
    } catch (error) {
      toast.error(`Failed to fetch table data ${error}`, { autoClose: 3000 });
    }
  };

  // Fetch Supplemental accounts Start
  const fetchAllSupplementalAccounts = async (recruiterId) => {
    try {
      const { data } =
        await API.crm.crmAccounts.getAllRecruiterAccountsByRecruiterId(
          recruiterId,
          accountsSearchText
        );
      setAccountRows(data?.data);
    } catch (error) {
      toast.error(`Failed to fetch table data ${error}`, { autoClose: 3000 });
    }
  };

  const onSubmit = async (selectedAccounts) => {
    try {
      const transformedArray = selectedAccounts.map((value) => ({
        drive_id: parseInt(id),
        account_id: parseInt(value),
      }));

      const result = await makeAuthorizedApiRequest(
        'POST',
        `${BASE_URL}/accounts/drives`,
        JSON.stringify(transformedArray)
      );
      let { data } = await result.json();
      if (result.status === 201) {
        setSubmitModalPopUp(true);
      } else {
        toast.error(data.response, { autoClose: 3000 });
      }
    } catch (error) {
      toast.error(`Failed on Submit ${error}`, { autoClose: 3000 });
    } finally {
      setRefresh(true);
    }
  };

  const filterAccounts = () => {
    const marketingAccountIds = supplementalRecruiment?.map(
      (account) => account.account_id
    );

    const filteredAccounts =
      accountRows?.length &&
      accountRows?.filter(
        (account) => !marketingAccountIds?.includes(account.id)
      );

    return filteredAccounts;
  };

  const handleArchive = (id) => {
    setShowConfirmation(true);
    setItemToArchive(id);
  };

  const confirmArchive = async () => {
    if (itemToArchive) {
      try {
        const result = await makeAuthorizedApiRequest(
          'PUT',
          `${BASE_URL}/accounts/${itemToArchive}/marketing-material/${id}`
        );
        let { data } = await result.json();
        if (result.status === 201) {
          setArchiveModalPopUp(true);
        } else {
          toast.error(data.response, { autoClose: 3000 });
        }
      } catch (error) {
        toast.error(`failed on archive ${error}`, { autoClose: 3000 });
      } finally {
        setRefresh((prevState) => !prevState);
      }

      setShowConfirmation(false);
      setItemToArchive(null);
    }
  };

  const cancelArchive = () => {
    setShowConfirmation(false);
    setItemToArchive(null);
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
    const fetchRecruiterId = async () => {
      try {
        const result = await makeAuthorizedApiRequest(
          'GET',
          `${BASE_URL}/accounts/${account_id}`
        );
        let { data } = await result.json();
        const recruiterId = data?.recruiter?.id;

        // Once recruiter ID is available, proceed with other actions
        if (recruiterId) {
          // Fetch other data or perform additional actions here
          getMarketingDetails();
          fetchAllSupplementalAccounts(recruiterId);
        } else {
          console.error('Recruiter ID not found');
        }
      } catch (error) {
        toast.error(`Failed to fetch table data ${error}`, { autoClose: 3000 });
      }
    };

    fetchRecruiterId();
  }, [account_id, refresh]);

  useEffect(() => {
    if (accountsSearchText?.length >= 3) {
      fetchAllSupplementalAccounts();
    }
  }, [accountsSearchText]);

  return (
    <>
      <>
        {/* {!loading && ( */}
        <div className="mainContent">
          <TopBar
            BreadCrumbsData={BreadcrumbsData}
            BreadCrumbsTitle={'Marketing Details'}
          />
          <div className="imageMainContent">
            <div className="d-flex align-items-center gap-3 ">
              <div style={{ width: '62px', height: '62px' }}>
                <img
                  src={viewimage}
                  style={{ width: '100%' }}
                  alt="CancelIcon"
                />
              </div>
              <AccountViewHeader />
            </div>
            <LocationAboutNavigationTabs editIcon={true} />
          </div>
          <div className="mainContentInner">
            <div className="filterBar p-0 mb-3">
              <div className="flex justify-content-between tabs mb-0 position-relative">
                <div className="border-0">
                  <ul>
                    <li>
                      <Link
                        to={CRM_ACCOUNT_BLUEPRINT_PATH.ABOUT.replace(
                          ':account_id',
                          account_id
                        ).replace(':id', id)}
                        className=""
                      >
                        About
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={`/crm/accounts/${account_id}/blueprint/${id}/shifts/view`}
                        className=""
                      >
                        Shift Details
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={`/crm/accounts/${account_id}/blueprint/${id}/marketing-details`}
                        className="active"
                      >
                        Marketing Details
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className={`tableView ${styles.marketingView}`}>
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
                          {marketingDetails?.online_scheduling_allowed
                            ? 'Yes'
                            : 'No'}
                        </td>
                      </tr>
                      <tr>
                        <td className="tableTD col1">Start Date & Time</td>
                        <td className="tableTD col2">
                          {marketingDetails?.start_date
                            ? moment(marketingDetails?.start_date).format(
                                'MM-DD-YYYY'
                              )
                            : ''}
                          ,{' '}
                          {marketingDetails?.start_time
                            ? moment(marketingDetails?.start_time).format(
                                'h:mm A'
                              )
                            : ''}
                        </td>
                      </tr>
                      <tr>
                        <td className="tableTD col1">End Date & Time</td>
                        <td className="tableTD col2">
                          {marketingDetails?.end_date
                            ? moment(marketingDetails?.end_date).format(
                                'MM-DD-YYYY'
                              )
                            : ''}
                          ,{' '}
                          {marketingDetails?.end_time
                            ? moment(marketingDetails?.end_time).format(
                                'h:mm A'
                              )
                            : ''}
                        </td>
                      </tr>
                      <tr>
                        <td className="tableTD col1">
                          Instructional Information
                        </td>
                        <td className="tableTD col2">
                          {marketingDetails?.instructional_info
                            ? marketingDetails?.instructional_info
                            : ''}
                        </td>
                      </tr>
                      <tr>
                        <td className="tableTD col1">Donor Information</td>
                        <td className="tableTD col2">
                          {marketingDetails?.donor_info
                            ? marketingDetails?.donor_info
                            : ''}
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
                              {marketingMaterials?.drive_material_items?.length}
                            </div>
                            <div className="col-4 text-right">
                              {getFormatedDate(
                                marketingMaterials?.order_due_date
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                      <tr className="parent-table">
                        <td colSpan={2}>
                          <table className="w-100">
                            <tr className="bg-white" width="100%">
                              <td width="37%">
                                <strong>Items</strong>
                              </td>
                              <td width="13%" className="text-center">
                                <strong>Qty</strong>
                              </td>
                              <td width="37%">
                                <strong>Items</strong>
                              </td>
                              <td width="13%" className="text-center">
                                <strong>Qty</strong>
                              </td>
                            </tr>
                            {marketingMaterials &&
                              marketingMaterials?.drive_material_items &&
                              marketingMaterials?.drive_material_items.reduce(
                                (rows, data, index) => {
                                  if (
                                    marketingMaterials?.drive_material_items
                                      ?.length === 1
                                  ) {
                                    // Handle the case when there is only one item
                                    rows.push(
                                      <tr key={index} width="100%">
                                        <td width="37%">{data.items}</td>
                                        <td
                                          width="13%"
                                          className="bg-white text-center"
                                        >
                                          {data.quantity}
                                        </td>
                                        <td width="37%"></td>
                                        <td
                                          width="13%"
                                          className="bg-white text-center"
                                        ></td>
                                      </tr>
                                    );
                                  } else if (index % 2 === 0) {
                                    const nextItem =
                                      marketingMaterials?.drive_material_items[
                                        index + 1
                                      ];
                                    rows.push(
                                      <tr key={index} width="100%">
                                        <td width="37%">{data.items}</td>
                                        <td
                                          width="13%"
                                          className="bg-white text-center"
                                        >
                                          {data.quantity}
                                        </td>
                                        <td width="37%">{nextItem?.items}</td>
                                        <td
                                          width="13%"
                                          className="bg-white text-center"
                                        >
                                          {nextItem?.quantity}
                                        </td>
                                      </tr>
                                    );
                                  }

                                  return rows;
                                },
                                []
                              )}
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
                                promotionalMaterials?.drive_promotional_items
                                  ?.length
                              }
                            </div>
                            <div className="col-4 text-right"></div>
                          </div>
                        </td>
                      </tr>
                      <tr className="parent-table">
                        <td colSpan={2}>
                          <table className="w-100">
                            <tr className="bg-white" width="100%">
                              <td width="37%">
                                <strong>Items</strong>
                              </td>
                              <td width="13%" className="text-center">
                                <strong>Qty</strong>
                              </td>
                              <td width="37%">
                                <strong>Items</strong>
                              </td>
                              <td width="13%" className="text-center">
                                <strong>Qty</strong>
                              </td>
                            </tr>
                            {promotionalMaterials &&
                              promotionalMaterials?.drive_promotional_items &&
                              promotionalMaterials?.drive_promotional_items.reduce(
                                (rows, data, index) => {
                                  if (
                                    promotionalMaterials
                                      ?.drive_promotional_items?.length === 1
                                  ) {
                                    // Handle the case when there is only one item
                                    rows.push(
                                      <tr key={index} width="100%">
                                        <td width="37%">{data.items}</td>
                                        <td
                                          width="13%"
                                          className="bg-white text-center"
                                        >
                                          {data.quantity}
                                        </td>
                                        <td width="37%"></td>
                                        <td
                                          width="13%"
                                          className="bg-white text-center"
                                        ></td>
                                      </tr>
                                    );
                                  } else if (index % 2 === 0) {
                                    const nextItem =
                                      promotionalMaterials
                                        ?.drive_promotional_items[index + 1];
                                    rows.push(
                                      <tr key={index} width="100%">
                                        <td width="37%">{data.items}</td>
                                        <td
                                          width="13%"
                                          className="bg-white text-center"
                                        >
                                          {data.quantity}
                                        </td>
                                        <td width="37%">{nextItem?.items}</td>
                                        <td
                                          width="13%"
                                          className="bg-white text-center"
                                        >
                                          {nextItem?.quantity}
                                        </td>
                                      </tr>
                                    );
                                  }

                                  return rows;
                                },
                                []
                              )}
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
                          {donorCommunication?.telerecruitment_enabled
                            ? 'Yes'
                            : 'No'}
                        </td>
                      </tr>
                      <tr>
                        <td className="tableTD col1">Order Status</td>
                        <td className="tableTD col2">
                          <span
                            className={`${
                              donorCommunication?.telerecruitment_status?.toLowerCase() ===
                              'approved'
                                ? 'approved'
                                : 'pending'
                            }`}
                          ></span>
                          {donorCommunication?.telerecruitment_status?.toLowerCase() ===
                          'approved'
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
                          {donorCommunication?.email_enabled ? 'Yes' : 'No'}
                        </td>
                      </tr>
                      <tr>
                        <td className="tableTD col1">Order Status</td>
                        <td className="tableTD col2">
                          <span
                            className={`${
                              donorCommunication?.email_status?.toLowerCase() ===
                              'approved'
                                ? 'approved'
                                : 'pending'
                            }`}
                          ></span>
                          {donorCommunication?.email_status?.toLowerCase() ===
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
                          {donorCommunication?.sms_enabled ? 'Yes' : 'No'}
                        </td>
                      </tr>
                      <tr>
                        <td className="tableTD col1">Order Status</td>
                        <td className="tableTD col2">
                          <span
                            className={`${
                              donorCommunication?.sms_status?.toLowerCase() ===
                              'approved'
                                ? 'approved'
                                : 'pending'
                            }`}
                          ></span>
                          {donorCommunication?.sms_status?.toLowerCase() ===
                          'approved'
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
                      {supplementalRecruiment &&
                        supplementalRecruiment?.map((data, index) => (
                          <tr className="bg-white" key={index}>
                            <td className="tableTD col2">123674</td>
                            <td className="tableTD col2 ">{data?.name}</td>
                            <td className="tableTD col2 text-capitalize ">
                              {data?.city}
                            </td>
                            <td className="tableTD col2 text-capitalize ">
                              {data?.collection_operation}
                            </td>
                            <td className="tableTD col2">
                              <div
                                onClick={() => handleArchive(data?.account_id)}
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
                          {zipCodes?.map((data, index) => (
                            <span className="bg-grey" key={index}>
                              {data}
                            </span>
                          ))}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* )} */}
        <AddAccountsModal
          setAddAccountsModal={setAddAccountsModal}
          addAccountsModal={addAccountsModal}
          selectedAccounts={selectedAccounts}
          setSelectedAccounts={setSelectedAccounts}
          accountRows={filterAccounts()}
          accountsSearchText={accountsSearchText}
          setAccountsSearchText={setAccountsSearchText}
          isView={true}
          onSubmit={onSubmit}
        />
        <SuccessPopUpModal
          title={'Success!'}
          message={'Account removed successfully.'}
          modalPopUp={archiveModalPopUp}
          setModalPopUp={setArchiveModalPopUp}
          onConfirm={() => {
            setArchiveModalPopUp(false);
          }}
          showActionBtns={true}
        />
        <SuccessPopUpModal
          title={'Success!'}
          message={'Accounts added successfully.'}
          modalPopUp={submitModalPopUp}
          setModalPopUp={setSubmitModalPopUp}
          onConfirm={() => {
            setSubmitModalPopUp(false);
          }}
          showActionBtns={true}
        />
        <ConfirmModal
          showConfirmation={showConfirmation}
          onCancel={cancelArchive}
          onConfirm={confirmArchive}
          icon={ConfirmArchiveIcon}
          heading={'Confirmation'}
          description={'Are you sure you want to remove this account?'}
        />
      </>
    </>
  );
};
export default MarketingDetailsView;
