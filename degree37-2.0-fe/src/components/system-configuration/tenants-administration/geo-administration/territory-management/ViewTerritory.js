import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useParams, Link } from 'react-router-dom';
import TopBar from '../../../../common/topbar/index';
import SvgComponent from '../../../../common/SvgComponent';
import styles from './index.module.scss';
import { formatDate } from '../../../../../helpers/formatDate';
import { makeAuthorizedApiRequestAxios } from '../../../../../helpers/Api';
import { formatUser } from '../../../../../helpers/formatUser';
import { GeoAdministrationBreadCrumbsData } from '../GeoAdministrationBreadCrumbsData';

const ViewTerritory = () => {
  const { id } = useParams();
  const [territoryData, setTerritoryData] = useState({});
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getData = async (id) => {
      setIsLoading(true);
      const result = await makeAuthorizedApiRequestAxios(
        'GET',
        `${BASE_URL}/territories/${id}`
      );
      let { data } = result.data;
      if (result.status === 200) {
        setTerritoryData(data);
      } else {
        toast.error('Error Fetching Territory Details', { autoClose: 3000 });
      }
      setIsLoading(false);
    };
    if (id) {
      getData(id);
    }
  }, [id]);

  const BreadcrumbsData = [
    ...GeoAdministrationBreadCrumbsData,
    {
      label: 'View Territory',
      class: 'active-label',
      link: `/system-configuration/tenant-admin/geo-admin/territories/${id}/view`,
    },
  ];

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Territory Management'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />

      <div className="mainContentInner">
        <div className="tableView">
          <div className="buttons">
            <Link
              to={`/system-configuration/tenant-admin/geo-admin/territories/${id}/edit`}
            >
              <span className="icon">
                <SvgComponent name="EditIcon" />
              </span>
              <span className="text">Edit</span>
            </Link>
          </div>
          <div className="tableViewInner">
            <div className="group">
              <div className="group-head">
                <h2>Territory Details</h2>
              </div>

              <div className={`group-body ${styles.groupRound}`}>
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
                        <span className="left-heading">Territory Name</span>
                        <span className="right-data">
                          {territoryData?.territory_name || 'N/A'}
                        </span>
                      </li>
                      <li>
                        <span className="left-heading">Recruiter</span>
                        <span className="right-data">
                          {territoryData?.recruiter
                            ? formatUser(territoryData?.recruiter, 1)
                            : 'N/A'}
                        </span>
                      </li>
                      <li>
                        <span className="left-heading">Description</span>
                        <span className="right-data">
                          {territoryData?.description || 'N/A'}
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
                      <span className="right-data d-flex justify-content-center align-items-center">
                        <p className="m-0">Data Loading </p>
                      </span>
                    </li>
                  ) : (
                    <>
                      <li>
                        <span className="left-heading">Status</span>
                        <span className="right-data">
                          {territoryData?.status ? (
                            <span className="badge active"> Active </span>
                          ) : (
                            <span className="badge inactive"> Inactive </span>
                          )}
                        </span>
                      </li>
                      <li>
                        <span className="left-heading">Created</span>
                        <span className="right-data">
                          {formatUser(territoryData?.created_by)}
                          {formatDate(territoryData?.created_at)}
                        </span>
                      </li>
                      <li>
                        <span className="left-heading">Modified</span>
                        <span className="right-data">
                          {formatUser(
                            territoryData?.modified_by !== null
                              ? territoryData?.modified_by
                              : territoryData?.created_by
                          )}
                          {formatDate(
                            territoryData?.modified_at !== null
                              ? territoryData?.modified_at
                              : territoryData?.created_at
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

export default ViewTerritory;
