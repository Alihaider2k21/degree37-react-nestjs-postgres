// import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import SvgComponent from '../../../../../../common/SvgComponent';
import TopBar from '../../../../../../common/topbar/index';
import { getStageApi } from '../api.js';
import { formatUser } from '../../../../../../../helpers/formatUser';
import { formatDate } from '../../../../../../../helpers/formatDate';
import { AccountBreadCrumbsData } from '../../AccountBreadCrumbsData';
import CheckPermission from '../../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../../enums/PermissionsEnum';

const ViewStage = () => {
  const { id } = useParams();
  const [view_tenant, setView_tenant] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const BreadcrumbsData = [
    ...AccountBreadCrumbsData,
    {
      label: 'View Stage',
      class: 'active-label',
      link: `/system-configuration/tenant-admin/crm-admin/accounts/stages/${id}/view`,
    },
  ];
  useEffect(() => {
    fetchAllStages();
  }, [id]);

  const fetchAllStages = async () => {
    try {
      setIsLoading(true);
      const { data } = await getStageApi({ id });
      setView_tenant(data.data);
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
        BreadCrumbsTitle={'Stage'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />
      {CheckPermission([
        Permissions.CRM_ADMINISTRATION.ACCOUNTS.STAGES.WRITE,
      ]) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            margin: '1% 3%',
          }}
        >
          <span style={{ fontSize: 16 }}>
            <Link
              className="dropdown-item"
              to={`/system-configuration/tenant-admin/crm-admin/accounts/stages/${id}/edit`}
              state={{
                edit: true,
              }}
            >
              <SvgComponent name="EditIcon" /> Edit
            </Link>
          </span>
        </div>
      )}
      <div style={{ margin: '0 5%' }}>
        <table className="viewTables" style={{ width: '60%' }}>
          <thead>
            <tr>
              <th colSpan="2">Stage Details</th>
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
                <td className="col2"> {view_tenant?.name || 'N/A'} </td>
              </tr>
              <tr>
                <td className="col1">Description</td>
                <td className="col2"> {view_tenant?.description || 'N/A'} </td>
              </tr>
            </tbody>
          )}
        </table>
        <table className="viewTables" style={{ width: '60%' }}>
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
                  {view_tenant.is_active ? (
                    <span className="badge active">Active</span>
                  ) : (
                    <span className="badge inactive">InActive</span>
                  )}
                </td>
              </tr>
              <tr>
                <td className="col1">Created by</td>
                <td className="col2">
                  {formatUser(
                    view_tenant?.created_by ?? view_tenant?.created_by
                  )}
                  {formatDate(
                    view_tenant?.created_at ?? view_tenant?.created_at
                  )}
                </td>
              </tr>
              <tr>
                <td className="col1">Modified</td>
                <td className="col2">
                  {formatUser(
                    view_tenant?.modified_by
                      ? view_tenant?.modified_by
                      : view_tenant?.created_by
                  )}{' '}
                  {formatDate(
                    view_tenant?.modified_at
                      ? view_tenant?.modified_at
                      : view_tenant?.created_at
                  )}
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
};

export default ViewStage;
