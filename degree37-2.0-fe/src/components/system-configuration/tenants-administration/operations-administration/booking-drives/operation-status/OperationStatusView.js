import React, { useEffect, useState } from 'react';
import TopBar from '../../../../../common/topbar/index';
import { toast } from 'react-toastify';
import { Link, useParams } from 'react-router-dom';
import SvgComponent from '../../../../../common/SvgComponent';
import { formatUser } from '../../../../../../helpers/formatUser';
import { formatDate } from '../../../../../../helpers/formatDate';
import { BookingDrivesBreadCrumbsData } from '../BookingDrivesBreadCrumbsData';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';

const OperationStatusView = () => {
  const { id } = useParams();
  const [operationStatusData, setOperationStatusData] = useState({});
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const bearerToken = localStorage.getItem('token');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getData = async (id) => {
      setIsLoading(true);
      if (id) {
        const result = await fetch(
          `${BASE_URL}/booking-drive/operation-status/${id}`,
          {
            headers: {
              'Content-Type': 'application/json',
              authorization: `Bearer ${bearerToken}`,
            },
          }
        );
        let { data, status } = await result.json();
        if ((result.ok || result.status === 200) & (status === 200)) {
          setOperationStatusData(data);
        } else {
          toast.error('Error Fetching Operation Status', { autoClose: 3000 });
        }
      } else {
        toast.error('Error getting Operation Status', { autoClose: 3000 });
      }
      setIsLoading(false);
    };
    if (id) {
      getData(id);
    }
  }, [id, BASE_URL]);

  const BreadcrumbsData = [
    ...BookingDrivesBreadCrumbsData,
    {
      label: 'View Operation Status',
      class: 'active-label',
      link: `/system-configuration/operations-admin/booking-drives/operation-status/${id}`,
    },
  ];

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Operation Status'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />
      <div className="mainContentInner">
        <div className="tableView">
          {CheckPermission([
            Permissions.OPERATIONS_ADMINISTRATION.BOOKING_DRIVES
              .OPERATION_STATUS.WRITE,
          ]) && (
            <div className="buttons">
              <Link
                to={`/system-configuration/operations-admin/booking-drives/operation-status/${id}/edit`}
              >
                <span className="icon">
                  <SvgComponent name="EditIcon" />
                </span>
                <span className="text">Edit</span>
              </Link>
            </div>
          )}
          <div className="tableViewInner">
            <div className="group">
              <div className="group-head">
                <h2>Operation Status Details</h2>
              </div>
              <div className="group-body">
                <ul>
                  {isLoading ? (
                    <li>
                      <span className="right-data d-flex justify-content-center align-items-center">
                        <p className="m-0">Data Loading </p>
                      </span>
                    </li>
                  ) : (
                    <>
                      <li>
                        <span className="left-heading">Name</span>
                        <span className="right-data">
                          {operationStatusData?.name || 'N/A'}
                        </span>
                      </li>
                      <li>
                        <span className="left-heading">Description</span>
                        <span className="right-data">
                          {operationStatusData?.description || 'N/A'}
                        </span>
                      </li>
                      <li>
                        <span className="left-heading">Applies To</span>
                        <span className="right-data">
                          {operationStatusData?.applies_to?.length
                            ? operationStatusData?.applies_to.map(
                                (appliesToData, key) =>
                                  key === 0
                                    ? appliesToData
                                    : ', ' + appliesToData
                              )
                            : 'N/A'}
                        </span>
                      </li>
                      <li>
                        <span className="left-heading">Chip Color</span>
                        <span className="right-data">
                          {operationStatusData?.chip_color ? (
                            <span
                              className={`badge ${operationStatusData.chip_color}`}
                            >
                              {' '}
                              {operationStatusData?.chip_color}{' '}
                            </span>
                          ) : (
                            'N/A'
                          )}
                        </span>
                      </li>
                      <li>
                        <span className="left-heading">Schedulable</span>
                        <span className="right-data">
                          {operationStatusData?.schedulable ? 'Yes' : 'No'}
                        </span>
                      </li>
                      <li>
                        <span className="left-heading">Holds Resources</span>
                        <span className="right-data">
                          {operationStatusData?.hold_resources ? 'Yes' : 'No'}
                        </span>
                      </li>
                      <li>
                        <span className="left-heading">
                          Contribute to Scheduled
                        </span>
                        <span className="right-data">
                          {operationStatusData?.contribute_to_scheduled
                            ? 'Yes'
                            : 'No'}
                        </span>
                      </li>
                      <li>
                        <span className="left-heading">Requires Approval</span>
                        <span className="right-data">
                          {operationStatusData?.requires_approval
                            ? 'Yes'
                            : 'No'}
                        </span>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
            <div className="group">
              <div className="group-head">
                <h2>Insights</h2>
              </div>
              <div className="group-body">
                <ul>
                  {isLoading ? (
                    <li>
                      <span className="right-data d-flex justify-content-center align-items-center">
                        <p className="m-0">Data Loading </p>
                      </span>
                    </li>
                  ) : (
                    <>
                      <li>
                        <span className="left-heading">Status</span>
                        <span className="right-data">
                          {operationStatusData?.is_active ? (
                            <span className="badge active"> Active </span>
                          ) : (
                            <span className="badge inactive"> Inactive </span>
                          )}
                        </span>
                      </li>
                      <li>
                        <span className="left-heading">Created</span>
                        <span className="right-data">
                          {operationStatusData?.created_by &&
                            operationStatusData?.created_at && (
                              <>
                                {formatUser(operationStatusData?.created_by)}
                                {formatDate(operationStatusData?.created_at)}
                              </>
                            )}
                        </span>
                      </li>
                      <li>
                        <span className="left-heading">Modified</span>
                        <span className="right-data">
                          {operationStatusData?.modified_at &&
                          operationStatusData?.modified_by ? (
                            <>
                              {formatUser(operationStatusData?.modified_by)}
                              {formatDate(operationStatusData?.modified_at)}
                            </>
                          ) : (
                            <>
                              {formatUser(operationStatusData?.created_by)}
                              {formatDate(operationStatusData?.created_at)}
                            </>
                          )}
                        </span>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperationStatusView;
