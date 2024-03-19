import React from 'react';
import { Link, useParams } from 'react-router-dom';
import TopBar from '../../../../../common/topbar/index';
import '../index.scss';
import TopTabsDonorCenters from '../../../topTabsDonorCenters';
import { API } from '../../../../../../api/api-routes';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { formatUser } from '../../../../../../helpers/formatUser';
import { formatDate } from '../../../../../../helpers/formatDate';
import moment from 'moment';

export default function DonorBluePrintView() {
  const { id, blueprintId } = useParams();
  const [detailsData, setDetailsData] = useState();
  const accessToken = localStorage.getItem('token');

  useEffect(() => {
    const getDetails = async () => {
      const { data } = await API.crm.donorCenter.getdetails(
        blueprintId,
        accessToken
      );
      if (data?.status_code === 200) {
        setDetailsData(data?.data);
      } else {
        toast.error(`Error in fetching`, { autoClose: 3000 });
      }
    };
    getDetails();
  }, [id, blueprintId]);

  const BreadcrumbsData = [
    {
      label: 'CRM',
      class: 'disable-label',
      link: `/crm/accounts/${id}/view/about`,
    },
    {
      label: 'Donor Centers',
      class: 'disable-label',
      link: `/crm/donor_center`,
    },
    {
      label: 'View Donors Center',
      class: 'active-label',
      link: `/crm/donor_center/${id}`,
    },
    {
      label: 'Blueprints',
      class: 'disable-label',
      link: `/crm/donor-centers/${id}/blueprints`,
    },
    {
      label: 'View Blueprints',
      class: 'active-label',
      link: `/crm/donor-centers/${id}/blueprints/${blueprintId}/view`,
    },
    {
      label: 'About',
      class: 'active-label',
      link: `/crm/donor-centers/${id}/blueprints/${blueprintId}/view`,
    },
  ];

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Blueprints'}
      />
      <TopTabsDonorCenters
        donorCenterId={id}
        bluePrintId={blueprintId}
        editIcon={true}
      />
      <div className="mainContentInner">
        <div className="filterBar p-0 mb-3">
          <div className="flex justify-content-between tabs mb-0 position-relative">
            <div className="border-0">
              <ul>
                <li>
                  <Link
                    to={`/crm/donor-centers/${id}/blueprints/${blueprintId}/view`}
                    className="active"
                  >
                    Details
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/crm/donor-centers/${id}/blueprints/${blueprintId}/shiftDetails`}
                    className=""
                  >
                    Shift Details
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/crm/donor-centers/${id}/blueprints/${blueprintId}/donorSchedules`}
                    className=""
                  >
                    Donor Schedules
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="tableView blueprintView">
          <div className="tableViewInner">
            <div className="group">
              <div className="group-head">
                <h2>Blueprint Details</h2>
              </div>
              <div className="group-body">
                <ul>
                  <li>
                    <span
                      className="left-heading"
                      style={{ alignItems: 'start' }}
                    >
                      Blueprint Name
                    </span>
                    <span className="right-data">
                      {detailsData?.name ? detailsData?.name : 'N/A'}
                    </span>
                  </li>
                  <li>
                    <span
                      className="left-heading"
                      style={{ alignItems: 'start' }}
                    >
                      Session Hours
                    </span>
                    <span className="right-data">
                      {detailsData?.shifts_data
                        ? `${moment(detailsData?.shifts_data?.min_start_time)
                            .local()
                            .format('hh:mm A')} - ${moment(
                            detailsData?.shifts_data?.max_end_time
                          )
                            .local()
                            .format('hh:mm A')} `
                        : 'N/A'}
                    </span>
                  </li>

                  <li>
                    <span
                      className="left-heading"
                      style={{ alignItems: 'start' }}
                    >
                      Week Days
                    </span>
                    <span className="right-data">
                      <button className={detailsData?.monday ? 'active' : ''}>
                        M
                      </button>
                      <button className={detailsData?.tuesday ? 'active' : ''}>
                        T
                      </button>
                      <button
                        className={detailsData?.wednesday ? 'active' : ''}
                      >
                        W
                      </button>
                      <button className={detailsData?.thursday ? 'active' : ''}>
                        T
                      </button>
                      <button className={detailsData?.friday ? 'active' : ''}>
                        F
                      </button>
                      <button className={detailsData?.saturday ? 'active' : ''}>
                        S
                      </button>
                      <button className={detailsData?.sunday ? 'active' : ''}>
                        S
                      </button>
                    </span>
                  </li>
                  <li>
                    <span
                      className="w-100"
                      style={{
                        background: '#fff',
                      }}
                    >
                      <strong>Blueprint Details: OEF</strong>
                    </span>
                  </li>
                  <li>
                    <span
                      className="left-heading"
                      style={{ alignItems: 'start' }}
                    >
                      Procedures
                    </span>
                    <span className="right-data">
                      {detailsData?.oef_procedures
                        ? detailsData?.oef_procedures
                        : 'N/A'}
                    </span>
                  </li>
                  <li>
                    <span
                      className="left-heading"
                      style={{ alignItems: 'start' }}
                    >
                      Products
                    </span>
                    <span className="right-data">
                      {detailsData?.oef_products
                        ? detailsData?.oef_products
                        : 'N/A'}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="group">
              <div className="group-head">
                <h2>Insights</h2>
              </div>
              <div className="group-body">
                <ul>
                  <li>
                    <span className="left-heading ">Status</span>
                    <span className="right-data  ">
                      {detailsData?.is_active ? (
                        <span className="badge active">Active</span>
                      ) : (
                        <span className="badge inactive">InActive</span>
                      )}
                    </span>
                  </li>
                  <li>
                    <span className="left-heading ">Created</span>
                    <span className="right-data  ">
                      <span>
                        {formatUser(
                          detailsData?.created_by ?? detailsData?.created_by
                        )}
                        {formatDate(
                          detailsData?.created_at ?? detailsData?.created_at
                        )}
                      </span>
                      {/* <span>Mark Twain | 11-09-2023 | 11:39 AM </span> */}
                    </span>
                  </li>
                  <li>
                    <span className="left-heading ">Modified</span>
                    <span className="right-data  ">
                      <span>
                        {formatUser(
                          detailsData?.modified_by
                            ? detailsData?.modified_by
                            : detailsData?.created_by
                        )}
                        {formatDate(
                          detailsData?.modified_at
                            ? detailsData?.modified_at
                            : detailsData?.created_at
                        )}
                      </span>
                      {/* <span>Mark Twain | 11-12-2023 | 05:51 PM </span> */}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
