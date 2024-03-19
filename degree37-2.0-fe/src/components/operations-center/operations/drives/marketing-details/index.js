import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './index.module.scss';
import TopBar from '../../../../common/topbar/index';
import viewimage from '../../../../../assets/images/viewimage.png';
import DriveViewNavigationTabs from '../navigationTabs';
// import About from '../about';
import {
  //   OPERATIONS_CENTER,
  OPERATIONS_CENTER_DRIVES_PATH,
  OPERATIONS_CENTER_MANAGE_FAVORITES_PATH,
} from '../../../../../routes/path';
import { makeAuthorizedApiRequest } from '../../../../../helpers/Api';
import NavigationTopBar from '../../../../common/NavigationTopBar';
// import CheckPermission from '../../../../../helpers/CheckPermissions';
// import Permissions from '../../../../../enums/OcPermissionsEnum';
import { toast } from 'react-toastify';

const MarketingDetails = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const { id } = useParams();
  const [driveData, setDriveData] = useState(null);

  const BreadcrumbsData = [
    {
      label: 'Operations Center',
      class: 'active-label',
      link: OPERATIONS_CENTER_MANAGE_FAVORITES_PATH.LIST,
    },
    {
      label: 'Operations',
      class: 'active-label',
      link: OPERATIONS_CENTER_DRIVES_PATH.LIST,
    },
    {
      label: 'Drives',
      class: 'active-label',
      link: OPERATIONS_CENTER_DRIVES_PATH.LIST,
    },
    {
      label: 'View Drive',
      class: 'active-label',
      link: `/operations-center/operations/drives/${id}/view/about`,
    },
    {
      label: 'Marketing Details',
      class: 'active-label',
      link: `/operations-center/operations/drives/${id}/view/marketing-details`,
    },
  ];

  const getDriveData = async (id) => {
    try {
      const result = await makeAuthorizedApiRequest(
        'GET',
        `${BASE_URL}/drives/${id}`
      );
      const { data } = await result.json();
      data[0] ? setDriveData(data[0]) : setDriveData(null);
    } catch (error) {
      toast.error('Error fetching drive');
    }
  };

  useEffect(() => {
    getDriveData(id);
  }, []);

  return (
    <div className={styles.DriveViewMain}>
      <div className="mainContent ">
        <TopBar
          BreadCrumbsData={BreadcrumbsData}
          //   BreadCrumbsTitle={breadCrumbsTitle}
          SearchValue={null}
          SearchOnChange={null}
          SearchPlaceholder={null}
        />
        <div className="imageMainContent">
          <NavigationTopBar img={viewimage} data={driveData} />
          <div className="d-flex align-items-center justify-between">
            <DriveViewNavigationTabs />
          </div>
        </div>
      </div>
      <div className="bodyMainContent">
        <>
          <div className="mainContentInner">
            <div className={`tableView ${styles.marketingView}`}>
              <div className="row">
                <div className="col-md-6">
                  <div className="tableViewInner test">
                    <div className="group">
                      <div className="group-head">
                        <h2>Marketing Details</h2>
                      </div>
                      <div className="group-body">
                        <ul>
                          <li>
                            <span className="left-heading">
                              Online Schedule
                            </span>
                            <span className="right-data">Yes</span>
                          </li>
                          <li>
                            <span className="left-heading">
                              Instructional Information
                            </span>
                            <span className="right-data">
                              Please use the summer campaign promotional items
                              and include, &apos;Free T-shirt&apos; on all
                              printed items.
                            </span>
                          </li>
                          <li className="banner green">
                            <h3 className="banner-heading">
                              Marketing Materials
                            </h3>
                            <h4 className="approved">Approved</h4>
                          </li>
                          <li className="three-column-headings">
                            <span>Approval Details</span>
                            <span>No. of Items</span>
                            <span>Order Due</span>
                          </li>
                          <li className="three-column-data">
                            <span>
                              John Doe
                              <p>23 July 2023 | 04:56 PM</p>
                            </span>
                            <span>40</span>
                            <span>21 July 2023</span>
                          </li>
                          <li className="items-list">
                            <ul className="left-items">
                              <li className="heading">
                                <span>Items</span>
                                <span>Qty</span>
                              </li>
                              <li>
                                <span>Large Poster</span>
                                <span>20</span>
                              </li>
                              <li>
                                <span>Large Poster</span>
                                <span>20</span>
                              </li>
                              <li>
                                <span>Large Poster</span>
                                <span>20</span>
                              </li>
                              <li>
                                <span>Large Poster</span>
                                <span>20</span>
                              </li>
                              <li>
                                <span>Large Poster</span>
                                <span>20</span>
                              </li>
                            </ul>
                            <ul className="right-items">
                              <li className="heading">
                                <span>Items</span>
                                <span>Qty</span>
                              </li>
                              <li>
                                <span>Large Poster</span>
                                <span>20</span>
                              </li>
                              <li>
                                <span>Large Poster</span>
                                <span>20</span>
                              </li>
                              <li>
                                <span>Large Poster</span>
                                <span>20</span>
                              </li>
                              <li>
                                <span>Large Poster</span>
                                <span>20</span>
                              </li>
                              <li>
                                <span>Large Poster</span>
                                <span>20</span>
                              </li>
                            </ul>
                          </li>
                          <li className="banner green dotted">
                            <h3 className="banner-heading">
                              Promotional Items
                            </h3>
                            <h4 className="approved">Approved</h4>
                          </li>
                          <li className="three-column-headings">
                            <span>Approval Details</span>
                            <span>No. of Items</span>
                            <span>&nbsp;</span>
                          </li>
                          <li className="three-column-data">
                            <span>
                              John Doe
                              <p>23 July 2023 | 04:56 PM</p>
                            </span>
                            <span>40</span>
                            <span>&nbsp;</span>
                          </li>
                          <li className="items-list">
                            <ul className="left-items">
                              <li className="heading">
                                <span>Items</span>
                                <span>Qty</span>
                              </li>
                              <li>
                                <span>T-Shirts</span>
                                <span>5</span>
                              </li>
                            </ul>
                            <ul className="right-items">
                              <li className="heading">
                                <span>Items</span>
                                <span>Qty</span>
                              </li>
                              <li>
                                <span>Game Tickets</span>
                                <span>5</span>
                              </li>
                            </ul>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="tableViewInner test">
                    <div className="group">
                      <div className="group-head">
                        <h2>Donor Communication</h2>
                      </div>
                      <div className="group-body">
                        <ul className="donor-communication">
                          <li>
                            <span className="right-data">Telerecruitment</span>
                          </li>
                          <li>
                            <span className="left-heading">Ordered</span>
                            <span className="right-data">Yes</span>
                          </li>
                          <li>
                            <span className="left-heading">Order Status</span>
                            <span className="right-data status approved">
                              Approved
                            </span>
                          </li>
                          <li>
                            <span className="right-data">Email</span>
                          </li>
                          <li>
                            <span className="left-heading">Ordered</span>
                            <span className="right-data">Yes</span>
                          </li>
                          <li>
                            <span className="left-heading">Order Status</span>
                            <span className="right-data status pending">
                              Pending Approval
                            </span>
                          </li>
                          <li>
                            <span className="right-data">SMS</span>
                          </li>
                          <li>
                            <span className="left-heading">Ordered</span>
                            <span className="right-data">Yes</span>
                          </li>
                          <li>
                            <span className="left-heading">Order Status</span>
                            <span className="right-data status approved">
                              Approved
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      </div>
    </div>
  );
};

export default MarketingDetails;
