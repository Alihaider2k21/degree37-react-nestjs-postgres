import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import TopBar from '../../../common/topbar/index';
import { toast } from 'react-toastify';
import { CRMAccountsBreadCrumbsData } from '../AccountsBreadCrumbsData';
import AccountViewHeader from '../header';
import LocationAboutNavigationTabs from '../../accounts/navigationTabs';
import viewimage from '../../../../assets/images/viewimage.png';
import DriveContactsSection from '../../../operations-center/operations/drives/about/driveContacts';
import EquipmentsSection from '../../../operations-center/operations/drives/about/equipments';
import CertificationsSection from '../../../operations-center/operations/drives/about/certifications';
import { makeAuthorizedApiRequest } from '../../../../helpers/Api';
import { CRM_ACCOUNT_BLUEPRINT_PATH } from '../../../../routes/path';
import { formatUser } from '../../../../helpers/formatUser';
import { formatDate } from '@storybook/blocks';
import moment from 'moment/moment';

const BluePrintView = () => {
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const { account_id, id } = useParams();
  const [driveData, setDriveData] = useState(null);
  const [filled, setFilled] = useState(0);

  const getStartEndTime = () => {
    driveData?.shifts?.map((item) => {
      if (startTime > item.start_time || startTime == 0) {
        let start_time = moment(item.start_time).format('hh:mm a');
        setStartTime(start_time);
      }
      if (endTime < item.end_time || endTime == 0) {
        let end_time = moment(item.end_time).format('hh:mm a');
        setEndTime(end_time);
      }
    });
  };
  const getDriveData = async (blueprintId) => {
    try {
      const result = await makeAuthorizedApiRequest(
        'GET',
        `${BASE_URL}/drives/${blueprintId}`
      );
      const { data } = await result.json();
      data[0] ? setDriveData(data[0]) : setDriveData(null);
    } catch (error) {
      toast.error('Error fetching drive');
    } finally {
      // setIsLoading(false);
    }
  };
  const getFillRateAndFilled = async () => {
    const response = await makeAuthorizedApiRequest(
      'GET',
      `${BASE_URL}/drives/shifts/donors-schedules/${id}`
    );
    const data = await response?.json();
    setFilled(data?.data);
  };

  useEffect(() => {
    getFillRateAndFilled();
    getDriveData(id);
  }, []);
  useEffect(() => {
    if (driveData?.shifts?.length) {
      getStartEndTime();
    }
  }, [getStartEndTime, driveData, startTime, endTime]);
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
      label: 'About',
      class: 'active-label',
      link: `${CRM_ACCOUNT_BLUEPRINT_PATH.ABOUT.replace(
        ':account_id',
        account_id
      ).replace(':id', id)}`,
    },
  ];
  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={
          CRM_ACCOUNT_BLUEPRINT_PATH.ABOUT.replace(
            ':account_id',
            account_id
          ).replace(':id', id)
            ? 'About'
            : 'Blueprints'
        }
      />
      <div className="imageMainContent">
        <div className="d-flex align-items-center gap-3 ">
          <div style={{ width: '62px', height: '62px' }}>
            <img src={viewimage} style={{ width: '100%' }} alt="CancelIcon" />
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
                    className="active"
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
                    to={CRM_ACCOUNT_BLUEPRINT_PATH.MARKETING_DETAILS.replace(
                      ':account_id',
                      account_id
                    ).replace(':id', id)}
                    className=""
                  >
                    Marketing Details
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="bodyMainContent">
          <div className="row row-gap-4 aboutAccountMain">
            <div className="col-12 col-md-6">
              <table className="viewTables w-100 mt-0">
                <thead>
                  <tr>
                    <th colSpan="2">Drive Details</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="tableTD col1">Operation Date</td>
                    <td className="tableTD col2">
                      {' '}
                      {moment(driveData?.drive?.date).format('MM-DD-YYYY') ||
                        '-'}{' '}
                    </td>
                  </tr>
                  <tr>
                    <td className="tableTD col1">Account</td>
                    <td className="tableTD col2">
                      <a
                        href={
                          driveData?.account?.name
                            ? `/crm/accounts/${driveData?.account?.id}/view`
                            : '#'
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="linkText"
                      >
                        {driveData?.account?.name || 'N/A'}
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="tableTD col1">Location Name</td>
                    <td className="tableTD col2">
                      <a
                        href={
                          driveData?.crm_locations?.name
                            ? `/crm/locations/${driveData?.crm_locations?.id}/view`
                            : '#'
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="linkText"
                      >
                        {driveData?.crm_locations?.name || 'N/A'}
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="tableTD col1">Primary Chairperson</td>
                    <td className="tableTD col2">
                      {driveData?.account?.account_contacts?.map(
                        (item, index) => {
                          if (
                            item?.role_id &&
                            item?.role_id?.name == 'Primary Chairperson'
                          ) {
                            return item?.record_id?.first_name
                              ? item?.record_id?.first_name +
                                  ' ' +
                                  item?.record_id?.last_name
                              : 'N/A';
                          }
                        }
                      ) || 'N/A'}
                    </td>
                  </tr>
                  <tr>
                    <td className="tableTD col1">Chairperson Phone</td>
                    <td className="tableTD col2 linkText">
                      {driveData?.account?.account_contacts?.map(
                        (item, index) => {
                          if (
                            item?.role_id &&
                            item?.role_id?.name == 'Primary Chairperson'
                          ) {
                            if (
                              item?.record_id?.contactable_data &&
                              item?.record_id?.contactable_data?.length
                            ) {
                              return item?.record_id?.contactable_data?.[0]
                                ?.data
                                ? item?.record_id?.contactable_data[0].data
                                : 'N/A';
                            }
                          }
                        }
                      ) || 'N/A'}
                    </td>
                  </tr>
                  <tr>
                    <td className="tableTD col1">Chairperson SMS</td>
                    <td className="tableTD col2 linkText">
                      {driveData?.account?.account_contacts?.map(
                        (item, index) => {
                          if (
                            item?.role_id &&
                            item?.role_id?.name == 'Primary Chairperson'
                          ) {
                            if (
                              item?.record_id?.contactable_data &&
                              item?.record_id?.contactable_data?.length
                            ) {
                              return item?.record_id?.contactable_data?.[0]
                                ?.data
                                ? item?.record_id?.contactable_data[0].data
                                : 'N/A';
                            }
                          }
                        }
                      ) || 'N/A'}
                    </td>
                  </tr>
                  <tr>
                    <td className="tableTD col1">Chairperson Email</td>
                    <td className="tableTD col2 linkText">
                      {driveData?.account?.account_contacts?.map(
                        (item, index) => {
                          if (
                            item?.role_id &&
                            item?.role_id?.name == 'Primary Chairperson'
                          ) {
                            if (
                              item?.record_id?.contactable_data &&
                              item?.record_id?.contactable_data?.length
                            ) {
                              return item?.record_id?.contactable_data?.[1]
                                ?.data
                                ? item?.record_id?.contactable_data[1].data
                                : 'N/A';
                            }
                          }
                        }
                      ) || 'N/A'}
                    </td>
                  </tr>
                  <tr>
                    <td className="tableTD col1">Draw Hours</td>
                    <td className="tableTD col2 linkText">
                      {`${startTime} - ${endTime}`}
                    </td>
                  </tr>
                  <tr>
                    <td className="tableTD col1">Projection</td>
                    <td className="tableTD col2 linkText">
                      {/* {driveData?.shifts?.map((item) => {
                        return item?.shifts_projections_staff?.map((xx) => {
                          return `${xx?.procedure_type_qty}/${xx?.product_yield} `;
                        });
                      })} */}
                      {driveData?.shifts?.map((shift) => {
                        if (shift?.shifts_projections_staff) {
                          const proceduresQtyArray =
                            shift?.shifts_projections_staff.map(
                              (staff) => staff?.procedure_type_qty || 0
                            );
                          const totalProceduresQty = proceduresQtyArray.reduce(
                            (acc, value) => acc + value,
                            0
                          );
                          return totalProceduresQty;
                        }
                        return 0;
                      })}
                      /
                      {driveData?.shifts?.map((shift) => {
                        if (shift?.shifts_projections_staff) {
                          const productsQtyArray =
                            shift?.shifts_projections_staff.map(
                              (staff) => staff?.product_yield || 0
                            );
                          const totalProductsQty = productsQtyArray.reduce(
                            (acc, value) => acc + value,
                            0
                          );
                          return totalProductsQty;
                        }
                        return 0;
                      })}
                    </td>
                  </tr>
                  <tr>
                    <td className="tableTD col1 bg-white">
                      Drive Details: OEF
                    </td>
                    <td className="tableTD col2"></td>
                  </tr>
                  <tr>
                    <td className="tableTD col1">Procedures</td>
                    <td className="tableTD col2 linkText">
                      {driveData?.shifts
                        ?.map((shift) => shift?.oef_procedures || 0)
                        .reduce((acc, value) => acc + value, 0)}
                    </td>
                  </tr>
                  <tr>
                    <td className="tableTD col1">Products</td>
                    <td className="tableTD col2 linkText">
                      {driveData?.shifts
                        ?.map((shift) => shift?.oef_products || 0)
                        .reduce((acc, value) => acc + value, 0)}
                    </td>
                  </tr>
                </tbody>
              </table>
              <table className="viewTables w-100 mt-4">
                <thead>
                  <tr>
                    <th colSpan="2">Attributes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="tableTD col1">Industry Category</td>
                    <td className="tableTD col2">
                      {driveData?.account?.industry_category?.name
                        ? driveData?.account?.industry_category?.name
                        : 'N/A'}
                    </td>
                  </tr>
                  <tr>
                    <td className="tableTD col1">Industry Subcategory</td>
                    <td className="tableTD col2">
                      {driveData?.account?.industry_subcategory?.name
                        ? driveData?.account?.industry_subcategory?.name
                        : 'N/A'}
                    </td>
                  </tr>
                  <tr>
                    <td className="tableTD col1">Stage</td>
                    <td className="tableTD col2">
                      {driveData?.account?.stage?.name
                        ? driveData?.account?.stage?.name
                        : 'N/A'}
                    </td>
                  </tr>
                  <tr>
                    <td className="tableTD col1">Source</td>
                    <td className="tableTD col2">
                      {driveData?.account?.source?.name
                        ? driveData?.account?.source?.name
                        : 'N/A'}
                    </td>
                  </tr>
                  <tr>
                    <td className="tableTD col1">Collection Operation</td>
                    <td className="tableTD col2">
                      {driveData?.account?.collection_operation?.name
                        ? driveData?.account?.collection_operation?.name
                        : 'N/A'}
                    </td>
                  </tr>
                  <tr>
                    <td className="tableTD col1">Recruiter </td>
                    <td className="tableTD col2">
                      {driveData?.account?.recruiter?.first_name
                        ? driveData?.account?.recruiter?.first_name +
                          ' ' +
                          driveData?.account?.recruiter?.last_name
                        : 'N/A'}
                    </td>
                  </tr>
                  <tr>
                    <td className="tableTD col1">Territory</td>
                    <td className="tableTD col2">
                      {driveData?.account?.territory?.territory_name
                        ? driveData?.account?.territory?.territory_name
                        : 'N/A'}
                    </td>
                  </tr>
                  <tr>
                    <td className="tableTD col1">Affiliation</td>
                    <td className="tableTD col2">
                      {driveData?.account?.affiliations
                        ? driveData?.account?.affiliations
                            .map((item) => item.affiliation_data.name)
                            .join(',')
                        : 'N/A'}
                    </td>
                  </tr>
                  <tr>
                    <td className="tableTD col1">Multi-day Drive</td>
                    <td className="tableTD col2">
                      {driveData?.drive?.is_multi_day_drive ? 'Yes' : 'No'}
                    </td>
                  </tr>
                </tbody>
              </table>
              <table className="viewTables w-100 mt-4">
                <thead>
                  <tr>
                    <th colSpan="2">Insights</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="tableTD col1">Status</td>
                    <td className="tableTD col2">
                      {driveData?.drive?.operation_status_id ? (
                        <span className="badge active">
                          {driveData?.drive?.operation_status_id?.name}
                        </span>
                      ) : (
                        <span className="badge inactive">Inactive</span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="tableTD col1">Linked With</td>
                    <td className="tableTD col2">
                      <span style={{ color: '#005375', cursor: 'pointer' }}>
                        Link Drive
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="tableTD col1">Slots (Filled/Capacity)</td>
                    <td className="tableTD col2">
                      {filled?.filled_slots}/{driveData?.slots}
                    </td>
                  </tr>
                  <tr>
                    <td className="tableTD col1">Fill Rate</td>
                    <td className="tableTD col2">{`${(
                      (filled?.filled_slots / filled?.total_slots) *
                      100
                    ).toFixed(2)}%`}</td>
                  </tr>
                  <tr>
                    <td className="tableTD col1">Created</td>
                    <td className="tableTD col2">
                      {formatUser(driveData?.drive?.created_by)}{' '}
                      {formatDate(driveData?.drive?.created_at)}
                    </td>
                  </tr>
                  <tr>
                    <td className="tableTD col1">Modified</td>
                    <td className="tableTD col2">
                      {formatUser(driveData?.drive?.created_by)}{' '}
                      {formatDate(driveData?.drive?.created_at)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="col-12 col-md-6">
              <DriveContactsSection
                driveData={driveData}
                getDriveData={getDriveData}
              />
              <EquipmentsSection
                driveData={driveData}
                getDriveData={getDriveData}
              />
              <CertificationsSection
                driveData={driveData}
                getDriveData={getDriveData}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BluePrintView;
