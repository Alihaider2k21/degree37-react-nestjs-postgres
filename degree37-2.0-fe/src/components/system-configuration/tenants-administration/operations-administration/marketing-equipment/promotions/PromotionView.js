import React, { useEffect, useState } from 'react';
import TopBar from '../../../../../common/topbar/index';
import { toast } from 'react-toastify';
import SvgComponent from '../../../../../common/SvgComponent';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { makeAuthorizedApiRequest } from '../../../../../../helpers/Api';
import styles from './index.module.scss';
import { formatUser } from '../../../../../../helpers/formatUser';
import { formatDate } from '../../../../../../helpers/formatDate';
import { MarketingEquipmentBreadCrumbsData } from '../MarketingEquipmentBreadCrumbsData';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';

const PromotionView = ({ promotionId }) => {
  const [promotionData, setPromotionData] = useState({});
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [isLoading, setIsLoading] = useState(true);

  const BreadcrumbsData = [
    ...MarketingEquipmentBreadCrumbsData,
    {
      label: 'View Promotion',
      class: 'active-label',
      link: `/system-configuration/tenant-admin/operations-admin/marketing-equipment/promotions/${promotionId}/view`,
    },
  ];

  useEffect(() => {
    const getData = async (promotionId) => {
      setIsLoading(true);
      const result = await makeAuthorizedApiRequest(
        'GET',
        `${BASE_URL}/marketing-equipment/promotions/${promotionId}`
      );
      let { data } = await result.json();
      if (result.ok || result.status === 200) {
        const promotionalData = data.promotion;
        promotionalData.collectionOperations = data.collectionOperations
          .map((bco) => bco.collection_operation_id.name)
          .join(', ');
        setPromotionData(promotionalData);
        setIsLoading(false);
      } else {
        toast.error('Error Fetching Promotion Details', { autoClose: 3000 });
        setIsLoading(false);
      }
    };
    if (promotionId) {
      getData(promotionId);
    }
  }, [promotionId]);
  if (!promotionData || !Object.keys(promotionData).length > 0) {
    return;
  }
  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Promotions'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />
      <div className="filterBar">
        {CheckPermission([
          Permissions.OPERATIONS_ADMINISTRATION.MARKETING_EQUIPMENTS.PROMOTIONS
            .WRITE,
        ]) && (
          <div className="text-end h6 fw-normal cursor-pointer edit-icon">
            <Link
              to={`/system-configuration/tenant-admin/operations-admin/marketing-equipment/promotions/${promotionId}/edit`}
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
                <th colSpan="2">Promotion Details</th>
              </tr>
            </thead>
            {isLoading ? (
              <tbody>
                <td className="col2 no-data text-center">Data Loading</td>
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td className="col1">Name</td>
                  <td className="col2">
                    {promotionData?.name ? promotionData?.name : 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td className="col1">Short Name</td>
                  <td className="col2">
                    {promotionData?.short_name
                      ? promotionData?.short_name
                      : 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td className="col1">Description</td>
                  <td className="col2">
                    {promotionData?.description
                      ? promotionData?.description
                      : 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td className="col1">Start Date</td>
                  <td className="col2">
                    {promotionData?.start_date
                      ? moment(promotionData?.start_date, 'YYYY-MM-DD').format(
                          'MM-DD-YYYY'
                        )
                      : 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td className="col1">End Date</td>
                  <td className="col2">
                    {promotionData?.end_date &&
                      moment(promotionData?.end_date, 'YYYY-MM-DD').format(
                        'MM-DD-YYYY'
                      )}
                  </td>
                </tr>
                <tr>
                  <td className="col1">Donor Message</td>
                  <td className="col2">
                    {promotionData?.donor_message
                      ? promotionData?.donor_message
                      : 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td className="col1">Collection Operation</td>
                  <td className="col2">
                    {promotionData?.collectionOperations
                      ? promotionData?.collectionOperations
                      : 'N/A'}
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
                <td className="col2 no-data text-center">Data Loading</td>
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td className="col1">Status</td>
                  <td className="col2">
                    {promotionData && (
                      <span
                        className={`${
                          promotionData?.status
                            ? styles.active
                            : styles.inactive
                        } ${styles.badge}`}
                      >
                        {promotionData?.status == true ? 'Active' : 'InActive'}
                      </span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="col1">Created</td>
                  <td className="col2">
                    {promotionData?.created_by
                      ? formatUser(promotionData?.created_by)
                      : 'N/A |'}{' '}
                    {promotionData?.created_at
                      ? formatDate(promotionData?.created_at)
                      : 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td className="col1">Modified</td>
                  <td className="col2">
                    {promotionData?.modified_by || promotionData?.created_by
                      ? formatUser(
                          promotionData?.modified_by ??
                            promotionData?.created_by
                        )
                      : 'N/A |'}{' '}
                    {promotionData?.modified_at || promotionData?.created_at
                      ? formatDate(
                          promotionData?.modified_at ??
                            promotionData?.created_at
                        )
                      : 'N/A'}
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

export default PromotionView;
