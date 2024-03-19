import React, { useEffect, useState } from 'react';
import TopBar from '../../../../../common/topbar/index';
import { Link, useParams } from 'react-router-dom';
import SvgComponent from '../../../../../common/SvgComponent';
import { formatDate } from '../../../../../../helpers/formatDate';
import { formatUser } from '../../../../../../helpers/formatUser';
import { BookingDrivesBreadCrumbsData } from '../BookingDrivesBreadCrumbsData';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';

const BreadcrumbsData = [
  ...BookingDrivesBreadCrumbsData,
  {
    label: 'View Task',
    class: 'active-label',
    link: `/system-configuration/tenant-admin/operations-admin/booking-drives/task-management/view/:id`,
  },
];

const TaskManagementView = () => {
  const [bookData, setBookData] = useState({});
  const bearerToken = localStorage.getItem('token');
  const [isLoading, setIsLoading] = useState(true);
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const { id } = useParams();

  const getBookDrive = async (id) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${BASE_URL}/booking-drive/task/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${bearerToken}`,
        },
      });
      const data = await response.json();
      setBookData(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getBookDrive(id);
  }, []);

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Task Management'}
      />

      <div className="mainContentInner">
        <div className="tableView">
          {CheckPermission([
            Permissions.OPERATIONS_ADMINISTRATION.BOOKING_DRIVES.TASK_MANAGEMENT
              .WRITE,
          ]) && (
            <div className="buttons">
              <Link
                to={`/system-configuration/tenant-admin/operations-admin/booking-drives/task-management/${id}`}
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
                <h2>Task Details</h2>
              </div>
              <div className="group-body">
                <ul>
                  {isLoading ? (
                    <li>
                      <span className="right-data d-flex justify-content-center align-items-center">
                        <p className="m-0"> Data Loading</p>
                      </span>
                    </li>
                  ) : (
                    <>
                      <li>
                        <span className="left-heading">Name</span>
                        <span className="right-data">
                          {bookData?.data?.name || 'N/A'}
                        </span>
                      </li>
                      <li>
                        <span className="left-heading">Description</span>
                        <span className="right-data">
                          {bookData?.data?.description || 'N/A'}
                        </span>
                      </li>
                      <li>
                        <span className="left-heading">Offset</span>
                        <span
                          className="right-data"
                          style={{
                            'text-align': 'justify',
                            wordBreak: 'break-word',
                          }}
                        >
                          {bookData?.data?.offset || 'N/A'}
                        </span>
                      </li>
                      <li>
                        <span className="left-heading">Owner</span>
                        <span className="right-data">
                          {bookData?.data?.owner || 'N/A'}
                        </span>
                      </li>
                      <li>
                        <span className="left-heading">Applies To</span>
                        <span className="right-data">
                          {bookData?.data?.applies_to || 'N/A'}
                        </span>
                      </li>
                      <li>
                        <span className="left-heading">
                          Collection Operation
                        </span>
                        <span className="right-data">
                          {bookData?.data?.collection_operation || 'N/A'}
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
                        <p className="m-0"> Data Loading</p>
                      </span>
                    </li>
                  ) : (
                    <>
                      <li>
                        <span className="left-heading">Status</span>
                        <span className="right-data">
                          {bookData.data?.is_active ? (
                            <span className="badge active"> Active </span>
                          ) : (
                            <span className="badge inactive"> Inactive </span>
                          )}
                        </span>
                      </li>
                      <li>
                        <span className="left-heading">Created by</span>
                        <span className="right-data">
                          {formatUser(
                            bookData?.data?.created_by ??
                              bookData?.data?.created_by
                          )}
                          {formatDate(
                            bookData?.data?.created_at ??
                              bookData?.data?.created_at
                          )}
                        </span>
                      </li>
                      <li>
                        <span className="left-heading">Modified</span>
                        <span className="right-data">
                          {formatUser(
                            bookData?.data?.modified_by
                              ? bookData?.data?.modified_by
                              : bookData?.data?.created_by
                          )}
                          {formatDate(
                            bookData?.data?.modified_at
                              ? bookData?.data?.modified_at
                              : bookData?.data?.created_at
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

export default TaskManagementView;
