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

const BannerView = ({ bannerId }) => {
  const [bannerData, setBannerData] = useState({});
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [isLoading, setIsLoading] = useState(true);

  const BreadcrumbsData = [
    ...CalendarBreadCrumbsData,
    {
      label: 'View Banner',
      class: 'active-label',
      link: `/system-configuration/tenant-admin/operations-admin/calendar/banners/${bannerId}/view`,
    },
  ];

  useEffect(() => {
    const getData = async (bannerId) => {
      setIsLoading(true);
      const result = await makeAuthorizedApiRequest(
        'GET',
        `${BASE_URL}/banners/${bannerId}`
      );
      let { data } = await result.json();
      if (result.ok || result.status === 200) {
        const bannerData = data.banner;
        bannerData.collection_operations = data.collectionOperations
          .map((bco) => bco.collection_operation_id.name)
          .join(', ');
        setBannerData(bannerData);
        setIsLoading(false);
      } else {
        toast.error('Error Fetching Banner Details', { autoClose: 3000 });
        setIsLoading(false);
      }
    };
    if (bannerId) {
      getData(bannerId);
    }
  }, [bannerId]);

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Banners'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />
      <div className="filterBar">
        {CheckPermission([
          Permissions.OPERATIONS_ADMINISTRATION.CALENDAR.BANNER.WRITE,
        ]) && (
          <div className="text-end h6 fw-normal cursor-pointer edit-icon">
            <Link
              to={`/system-configuration/tenant-admin/operations-admin/calendar/banners/${bannerId}/edit`}
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
                <th colSpan="2">Banner Details</th>
              </tr>
            </thead>
            {isLoading ? (
              <tbody>
                <tr>
                  <td className="col2 text-center">Data Loading</td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td className="col1">Title</td>
                  <td className="col2"> {bannerData?.title || 'N/A'} </td>
                </tr>
                <tr>
                  <td className="col1">Description</td>
                  <td className="col2"> {bannerData?.description || 'N/A'} </td>
                </tr>
                <tr>
                  <td className="col1">Start Date</td>
                  <td className="col2">
                    {bannerData?.start_date
                      ? moment(bannerData?.start_date, 'YYYY-MM-DD').format(
                          'MM-DD-YYYY'
                        )
                      : 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td className="col1">End Date</td>
                  <td className="col2">
                    {bannerData?.end_date
                      ? moment(bannerData?.end_date, 'YYYY-MM-DD').format(
                          'MM-DD-YYYY'
                        )
                      : 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td className="col1">Collection Operation</td>
                  <td className="col2">
                    {bannerData?.collection_operations || 'N/A'}{' '}
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
                <tr>
                  <td className="col2 text-center">Data Loading</td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td className="col1">Created</td>
                  <td className="col2">
                    {formatUser(bannerData?.created_by)}
                    {formatDate(bannerData?.created_at)}
                  </td>
                </tr>
                <tr>
                  <td className="col1">Modified</td>
                  <td className="col2">
                    {formatUser(bannerData?.modified_by)}
                    {formatDate(bannerData?.modified_at)}
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

export default BannerView;
