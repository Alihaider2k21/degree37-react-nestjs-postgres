import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import SvgComponent from '../../../../../common/SvgComponent';
import TopBar from '../../../../../common/topbar/index';
import styles from './index.module.scss';
import { formatUser } from '../../../../../../helpers/formatUser';
import {
  SC_ORGANIZATIONAL_ADMINISTRATION_PATH,
  SYSTEM_CONFIGURATION_PATH,
} from '../../../../../../routes/path';
import { formatDate } from '../../../../../../helpers/formatDate';
import CheckPermission from '../../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../../enums/PermissionsEnum';
import axios from 'axios';

const ViewOrganizationalLevels = () => {
  const { id } = useParams();
  const [orgData, setOrgData] = useState({});
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const bearerToken = localStorage.getItem('token');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadData(id);
    }
  }, [id, BASE_URL]);

  const loadData = async (id) => {
    setIsLoading(true);

    const response = await axios.get(
      `${BASE_URL}/organizational_levels/${id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${bearerToken}`,
        },
      }
    );
    let { data, status_code } = response.data;
    if (status_code === 302) {
      setOrgData(data);
      setIsLoading(false);
    } else {
      toast.error('Error Fetching Organizational Level Details', {
        autoClose: 3000,
      });
      setIsLoading(false);
    }
  };

  const BreadcrumbsData = [
    {
      label: 'System Configurations',
      class: 'disable-label',
      link: SYSTEM_CONFIGURATION_PATH,
    },
    {
      label: 'Organizational Administration',
      class: 'disable-label',
      link: SC_ORGANIZATIONAL_ADMINISTRATION_PATH,
    },
    {
      label: 'Hierarchy',
      class: 'disable-label',
      link: '/system-configuration/organizational-levels',
    },
    {
      label: 'Organizational Levels',
      class: 'disable-label',
      link: '/system-configuration/organizational-levels',
    },
    {
      label: 'View',
      class: 'active-label',
      link: `/system-configuration/organizational-levels/${id}`,
    },
  ];

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Organizational Levels'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />
      <div className="mainContentInner">
        {CheckPermission([
          Permissions.ORGANIZATIONAL_ADMINISTRATION.HIERARCHY
            .ORGANIZATIONAL_LEVELS.WRITE,
        ]) && (
          <div className="editAnchor">
            <a href={`/system-configuration/organizational-levels/${id}/edit`}>
              <SvgComponent name={'EditIcon'} />
              <span className={styles.editsize}>Edit</span>
            </a>
          </div>
        )}

        <div className="row">
          <div className="col-6">
            <div className="tablesContainer">
              <div className="leftTables">
                <table className="viewTables">
                  <thead>
                    <tr>
                      <th colSpan="2">Details</th>
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
                        <td className="col2">{orgData?.name || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td className="col1">Description</td>
                        <td className="col2">
                          {orgData?.description || 'N/A'}
                        </td>
                      </tr>
                      <tr>
                        <td className="col1">Short Label</td>
                        <td className="col2">
                          {orgData?.short_label || 'N/A'}
                        </td>
                      </tr>
                      <tr>
                        <td className="col1">Parent</td>
                        <td className="col2">
                          {orgData?.parent_level?.name || 'N/A'}
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
                          {' '}
                          {orgData?.is_active ? (
                            <span className="badge active"> Active </span>
                          ) : (
                            <span className="badge inactive"> Inactive </span>
                          )}{' '}
                        </td>
                      </tr>

                      <tr>
                        <td className="col1">Created</td>
                        <td className="col2">
                          {' '}
                          {orgData &&
                          orgData?.created_by &&
                          orgData?.created_at ? (
                            <>
                              {formatUser(orgData?.created_by)}
                              {formatDate(orgData?.created_at)}
                            </>
                          ) : (
                            ''
                          )}
                        </td>
                      </tr>

                      <tr>
                        <td className="col1">Modified</td>
                        <td className="col2">
                          {' '}
                          <>
                            {formatUser(
                              orgData?.modified_by
                                ? orgData?.modified_by
                                : orgData?.created_by
                            )}
                            {formatDate(
                              orgData?.modified_at
                                ? orgData?.modified_at
                                : orgData?.created_at
                            )}
                          </>
                        </td>
                      </tr>
                    </tbody>
                  )}
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewOrganizationalLevels;
