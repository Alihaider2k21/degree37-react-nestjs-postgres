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

const CloseDateView = ({ closeDateId }) => {
  const [closeDateData, setCloseDateData] = useState({});
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [isLoading, setIsLoading] = useState(true);

  const BreadcrumbsData = [
    ...CalendarBreadCrumbsData,
    {
      label: 'View Close Date',
      class: 'active-label',
      link: `/system-configuration/tenant-admin/operations-admin/calendar/close-dates/${closeDateId}/view`,
    },
  ];

  useEffect(() => {
    const getData = async (closeDateId) => {
      setIsLoading(true);
      const result = await makeAuthorizedApiRequest(
        'GET',
        `${BASE_URL}/close-dates/${closeDateId}`
      );
      let { data } = await result.json();
      if (result.ok || result.status === 200) {
        const closeDateData = data.closeDate;
        closeDateData.collection_operations = data.collectionOperations
          .map((bco) => bco.collection_operation_id.name)
          .join(', ');
        setCloseDateData(closeDateData);
      } else {
        toast.error('Error Fetching Close Date Details', { autoClose: 3000 });
      }
      setIsLoading(false);
    };
    if (closeDateId) {
      getData(closeDateId);
    }
  }, [closeDateId]);

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Close Dates'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />
      <div className="filterBar">
        {CheckPermission([
          Permissions.OPERATIONS_ADMINISTRATION.CALENDAR.CLOSE_DATES.WRITE,
        ]) && (
          <div className="text-end h6 fw-normal cursor-pointer edit-icon">
            <Link
              to={`/system-configuration/tenant-admin/operations-admin/calendar/close-dates/${closeDateId}/edit`}
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
                <th colSpan="2">Close Date Details</th>
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
                  <td className="col2"> {closeDateData?.title} </td>
                </tr>
                <tr>
                  <td className="col1">Description</td>
                  <td className="col2"> {closeDateData?.description} </td>
                </tr>
                <tr>
                  <td className="col1">Start Date</td>
                  <td className="col2">
                    {' '}
                    {moment(closeDateData?.start_date, 'YYYY-MM-DD').format(
                      'MM-DD-YYYY'
                    )}{' '}
                  </td>
                </tr>
                <tr>
                  <td className="col1">End Date</td>
                  <td className="col2">
                    {' '}
                    {moment(closeDateData?.end_date, 'YYYY-MM-DD').format(
                      'MM-DD-YYYY'
                    )}{' '}
                  </td>
                </tr>
                <tr>
                  <td className="col1">Collection Operation</td>
                  <td className="col2">
                    {' '}
                    {closeDateData?.collection_operations}{' '}
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
                    {formatUser(closeDateData?.created_by)}
                    {formatDate(closeDateData?.created_at)}
                  </td>
                </tr>
                <tr>
                  <td className="col1">Modified</td>
                  <td className="col2">
                    {formatUser(closeDateData?.modified_by)}
                    {formatDate(closeDateData?.modified_at)}
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

export default CloseDateView;
