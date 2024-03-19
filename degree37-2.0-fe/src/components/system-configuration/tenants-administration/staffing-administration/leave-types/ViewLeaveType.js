import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
// import moment from 'moment';
import TopBar from '../../../../common/topbar/index';
import SvgComponent from '../../../../common/SvgComponent';
import { getLeaveTypeApi } from './api';
import { formatUser } from '../../../../../helpers/formatUser';
import { formatDate } from '../../../../../helpers/formatDate';
import styles from './index.module.scss';
import { LeaveTypesBreadCrumbsData } from './LeaveTypesBreadCrumbsData';
import CheckPermission from '../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../enums/PermissionsEnum';

const ViewLeaveType = () => {
  const { id } = useParams();
  const [leaveType, setLeaveType] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const BreadcrumbsData = [
    ...LeaveTypesBreadCrumbsData,
    {
      label: 'View Leave',
      class: 'active-label',
      link: `/system-configuration/tenant-admin/staffing-admin/leave-types/${id}/view`,
    },
  ];
  useEffect(() => {
    fetchLeave();
  }, []);

  const fetchLeave = async () => {
    try {
      setIsLoading(true);
      const { data } = await getLeaveTypeApi({ id });
      setLeaveType(data.data);
    } catch (error) {
      toast.error(`Failed to fetch`, { autoClose: false });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Leave Type'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />

      <div className="mainContentInner">
        <div className="tableView">
          {CheckPermission([
            Permissions.STAFF_ADMINISTRATION.LEAVE_TYPES.WRITE,
          ]) && (
            <div className="buttons">
              <Link
                to={`/system-configuration/tenant-admin/staffing-admin/leave-types/${id}/edit`}
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
                <h2>Classification Details</h2>
              </div>

              <div className={`group-body ${styles.groupRound}`}>
                <ul>
                  {isLoading ? (
                    <li>
                      <span className="right-data">
                        <p className="text-center m-0 w-100">Data Loading </p>
                      </span>
                    </li>
                  ) : (
                    <>
                      <li>
                        <span className="left-heading">Name</span>
                        <span className="right-data">
                          {leaveType?.name || 'N/A'}
                        </span>
                      </li>
                      <li>
                        <span className="left-heading">Description</span>
                        <span className="right-data">
                          {leaveType?.description || 'N/A'}
                        </span>
                      </li>
                      <li>
                        <span className="left-heading">Short Description</span>
                        <span className="right-data">
                          {leaveType?.short_description || 'N/A'}
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

              <div className={`group-body ${styles.groupRound}`}>
                <ul>
                  {isLoading ? (
                    <li>
                      <span className="right-data">
                        <p className="text-center m-0 w-100">Data Loading </p>
                      </span>
                    </li>
                  ) : (
                    <>
                      <li>
                        <span className="left-heading">Status</span>
                        <span className="right-data">
                          {leaveType?.status ? (
                            <span className="badge active"> Active </span>
                          ) : (
                            <span className="badge inactive"> Inactive </span>
                          )}
                        </span>
                      </li>
                      <li>
                        <span className="left-heading">Created</span>
                        <span className="right-data">
                          {formatUser(leaveType?.created_by)}
                          {formatDate(leaveType?.created_at)}
                        </span>
                      </li>
                      <li>
                        <span className="left-heading">Modified</span>
                        <span className="right-data">
                          {formatUser(
                            leaveType?.modified_by !== null
                              ? leaveType?.modified_by
                              : leaveType?.created_by
                          )}
                          {formatDate(
                            leaveType?.modified_at !== null
                              ? leaveType?.modified_at
                              : leaveType?.created_at
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

export default ViewLeaveType;
