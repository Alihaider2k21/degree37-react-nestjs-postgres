import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import TopBar from '../../../../common/topbar/index';
import SvgComponent from '../../../../common/SvgComponent';
import { makeAuthorizedApiRequest } from '../../../../../helpers/Api';
import { formatUser } from '../../../../../helpers/formatUser';
import { formatDate } from '../../../../../helpers/formatDate';

import styles from './index.module.scss';
import { ClassificationsBreadCrumbsData } from './ClassificationsBreadCrumbsData';
import CheckPermission from '../../../../../helpers/CheckPermissions';
import Permissions from '../../../../../enums/PermissionsEnum';

const ViewSingleClassification = () => {
  const { id } = useParams();
  const [classificationData, setClassificationData] = useState({});
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getData = async (id) => {
      try {
        setIsLoading(true);
        const result = await makeAuthorizedApiRequest(
          'GET',
          `${BASE_URL}/staffing-admin/classifications/${id}`
        );
        let { data } = await result.json();
        if (result.ok || result.status === 200) {
          setClassificationData(data);
        } else {
          toast.error('Error Fetching Classification Details', {
            autoClose: 3000,
          });
        }
      } catch (error) {
        console.log(error);
        toast.error('Error Fetching Classification Details', {
          autoClose: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    };
    if (id) {
      getData(id);
    }
  }, [id]);

  const BreadcrumbsData = [
    ...ClassificationsBreadCrumbsData,
    {
      label: 'View Classification',
      class: 'active-label',
      link: `/system-configuration/tenant-admin/staffing-admin/classifications/${id}/view`,
    },
  ];

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Classifications'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />
      <div className="mainContentInner">
        <div className="tableView">
          {CheckPermission([
            Permissions.STAFF_ADMINISTRATION.CLASSIFICATIONS.CLASSIFICATIONS
              .WRITE,
          ]) && (
            <div className="buttons">
              <Link
                to={`/system-configuration/tenant-admin/staffing-admin/classifications/${id}/edit`}
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
              {isLoading ? (
                <div className={`group-body ${styles.groupRound}`}>
                  <p className="col2 no-data text-center m-3">Data Loading</p>
                </div>
              ) : (
                <div className={`group-body ${styles.groupRound}`}>
                  <ul>
                    <li>
                      <span className="left-heading">Name</span>
                      <span className="right-data">
                        {classificationData?.name || 'N/A'}
                      </span>
                    </li>
                    <li>
                      <span className="left-heading">Description</span>
                      <span className="right-data">
                        {classificationData?.description || 'N/A'}
                      </span>
                    </li>
                    <li>
                      <span className="left-heading">Short Description</span>
                      <span className="right-data">
                        {classificationData?.short_description || 'N/A'}
                      </span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
            <div className="group">
              <div className="group-head">
                <h2>Insights</h2>
              </div>
              {isLoading ? (
                <div className={`group-body ${styles.groupRound}`}>
                  <p className="col2 no-data text-center m-3">Data Loading</p>
                </div>
              ) : (
                <div className={`group-body ${styles.groupRound}`}>
                  <ul>
                    <li>
                      <span className="left-heading">Status</span>
                      <span className="right-data">
                        {classificationData?.status ? (
                          <span className="badge active"> Active </span>
                        ) : (
                          <span className="badge inactive"> Inactive </span>
                        )}
                      </span>
                    </li>
                    <li>
                      <span className="left-heading">Created</span>
                      <span className="right-data">
                        {formatUser(classificationData?.created_by)}
                        {formatDate(classificationData?.created_at)}
                      </span>
                    </li>
                    <li>
                      <span className="left-heading">Modified</span>
                      <span className="right-data">
                        {formatUser(
                          classificationData?.modified_by !== null
                            ? classificationData?.modified_by
                            : classificationData?.created_by
                        )}
                        {formatDate(
                          classificationData?.modified_at !== null
                            ? classificationData?.modified_at
                            : classificationData?.created_at
                        )}
                      </span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewSingleClassification;
