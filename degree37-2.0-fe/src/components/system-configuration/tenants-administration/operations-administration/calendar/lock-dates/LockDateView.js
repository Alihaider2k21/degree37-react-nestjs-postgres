import React, { useEffect, useState } from 'react';
import TopBar from '../../../../../common/topbar/index';
import { toast } from 'react-toastify';
import SvgComponent from '../../../../../common/SvgComponent';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { makeAuthorizedApiRequest } from '../../../../../../helpers/Api';
import { formatUser } from '../../../../../../helpers/formatUser';
import { formatDate } from '../../../../../../helpers/formatDate';
import { CalendarBreadCrumbsData } from '../CalendarBreadCrumbsData';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';

const LockDateView = ({ lockDateId }) => {
  const [lockDateData, setLockDateData] = useState({});
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [isLoading, setIsLoading] = useState(true);

  const BreadcrumbsData = [
    ...CalendarBreadCrumbsData,
    {
      label: 'View Lock Date',
      class: 'active-label',
      link: `/system-configuration/tenant-admin/operations-admin/calendar/lock-dates/${lockDateId}/view`,
    },
  ];

  useEffect(() => {
    const getData = async (lockDateId) => {
      setIsLoading(true);
      const result = await makeAuthorizedApiRequest(
        'GET',
        `${BASE_URL}/lock-dates/${lockDateId}`
      );
      let { data } = await result.json();
      if (result.ok || result.status === 200) {
        const lockDateData = data.lockDate;
        lockDateData.collection_operations = data.collectionOperations
          .map((bco) => bco.collection_operation_id.name)
          .join(', ');
        setLockDateData(lockDateData);
      } else {
        toast.error('Error Fetching Lock Date Details', { autoClose: 3000 });
      }
      setIsLoading(false);
    };
    if (lockDateId) {
      getData(lockDateId);
    }
  }, [lockDateId]);

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Lock Dates'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />
      <div className="filterBar">
        {CheckPermission([
          Permissions.OPERATIONS_ADMINISTRATION.CALENDAR.LOCK_DATES.WRITE,
        ]) && (
          <div className="text-end h6 fw-normal cursor-pointer edit-icon">
            <Link
              to={`/system-configuration/tenant-admin/operations-admin/calendar/lock-dates/${lockDateId}/edit`}
            >
              <SvgComponent name={'EditIcon'} /> Edit
            </Link>
          </div>
        )}
      </div>

      <div className="mainContentInner">
        <div className="col-md-6">
          <table className="viewTables mt-0">
            <thead>
              <tr>
                <th colSpan="2">Lock Date Details</th>
              </tr>
            </thead>
            {isLoading ? (
              <tbody>
                <td className="col2 text-center">Data Loading </td>
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td className="col1">Title</td>
                  <td className="col2"> {lockDateData?.title || 'N/A'} </td>
                </tr>
                <tr>
                  <td className="col1">Description</td>
                  <td className="col2">
                    {' '}
                    {lockDateData?.description || 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td className="col1">Start Date</td>
                  <td className="col2">
                    {lockDateData?.start_date
                      ? moment(lockDateData?.start_date, 'YYYY-MM-DD').format(
                          'MM-DD-YYYY'
                        )
                      : 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td className="col1">End Date</td>
                  <td className="col2">
                    {lockDateData?.end_date
                      ? moment(lockDateData?.end_date, 'YYYY-MM-DD').format(
                          'MM-DD-YYYY'
                        )
                      : 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td className="col1">Collection Operation</td>
                  <td className="col2">
                    {lockDateData?.collection_operations || 'N/A'}
                  </td>
                </tr>
              </tbody>
            )}
          </table>

          <table className="viewTables">
            <thead>
              <tr>
                <th colSpan="2">Insights</th>
              </tr>
            </thead>
            {isLoading ? (
              <tbody>
                <td className="col2 text-center">Data Loading </td>
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td className="col1">Created</td>
                  <td className="col2">
                    {formatUser(lockDateData?.created_by)}
                    {formatDate(lockDateData?.created_at)}
                  </td>
                </tr>
                <tr>
                  <td className="col1">Modified</td>
                  <td className="col2">
                    {formatUser(lockDateData?.modified_by)}
                    {formatDate(lockDateData?.modified_at)}
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
      </div>
    </div>
  );
};

export default LockDateView;
